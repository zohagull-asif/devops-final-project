import express from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432", 10),
  user: process.env.DB_USER || "taskflow",
  password: process.env.DB_PASSWORD || "taskflow",
  database: process.env.DB_NAME || "taskflowdb",
});

async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id          SERIAL PRIMARY KEY,
      title       TEXT NOT NULL,
      priority    TEXT NOT NULL DEFAULT 'medium',
      done        BOOLEAN NOT NULL DEFAULT false,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  console.log("DB ready");
}

let requestCount = 0;
app.use((req, _res, next) => {
  requestCount++;
  next();
});

app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", db: "connected" });
  } catch {
    res.status(503).json({ status: "degraded", db: "unreachable" });
  }
});

app.get("/metrics", (_req, res) => {
  res.type("text/plain").send(
    `# HELP taskflow_requests_total Total HTTP requests\n` +
      `# TYPE taskflow_requests_total counter\n` +
      `taskflow_requests_total ${requestCount}\n`
  );
});

app.get("/api/tasks", async (_req, res) => {
  const { rows } = await pool.query(
    "SELECT * FROM tasks ORDER BY done ASC, created_at DESC"
  );
  res.json(rows);
});

app.post("/api/tasks", async (req, res) => {
  const { title, priority } = req.body;
  if (!title || !title.trim())
    return res.status(400).json({ error: "title is required" });
  const { rows } = await pool.query(
    "INSERT INTO tasks (title, priority) VALUES ($1, $2) RETURNING *",
    [title.trim(), priority || "medium"]
  );
  res.status(201).json(rows[0]);
});

app.patch("/api/tasks/:id", async (req, res) => {
  const { rows } = await pool.query(
    "UPDATE tasks SET done = NOT done WHERE id = $1 RETURNING *",
    [req.params.id]
  );
  if (!rows.length) return res.status(404).json({ error: "not found" });
  res.json(rows[0]);
});

app.delete("/api/tasks/:id", async (req, res) => {
  const { rowCount } = await pool.query("DELETE FROM tasks WHERE id = $1", [
    req.params.id,
  ]);
  if (!rowCount) return res.status(404).json({ error: "not found" });
  res.status(204).end();
});

const PORT = process.env.PORT || 5000;

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`API listening on :${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to init DB:", err.message);
    process.exit(1);
  });
