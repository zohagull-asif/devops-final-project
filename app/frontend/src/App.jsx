import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "";

const PRIORITIES = [
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    try {
      const res = await fetch(`${API}/api/tasks`);
      if (!res.ok) throw new Error("Failed to load");
      setTasks(await res.json());
      setError("");
    } catch {
      setError("Could not reach the API. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addTask(e) {
    e.preventDefault();
    if (!title.trim()) return;
    const res = await fetch(`${API}/api/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, priority }),
    });
    if (res.ok) {
      setTitle("");
      setPriority("medium");
      load();
    }
  }

  async function toggle(id) {
    await fetch(`${API}/api/tasks/${id}`, { method: "PATCH" });
    load();
  }

  async function remove(id) {
    await fetch(`${API}/api/tasks/${id}`, { method: "DELETE" });
    load();
  }

  const done = tasks.filter((t) => t.done).length;
  const total = tasks.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="app">
      <div className="bg-mesh" aria-hidden />
      <div className="grain" aria-hidden />

      <header className="hero">
        <div className="brand">
          <span className="logo">
            <svg viewBox="0 0 32 32" width="28" height="28">
              <path
                d="M9 16.5l4.5 4.5L23 11"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="brand-name">TaskFlow</span>
          <span className="badge-cloud">cloud-native</span>
        </div>
        <h1 className="headline">
          Ship your <em>DevOps</em> pipeline,
          <br /> one task at a time.
        </h1>
        <p className="sub">
          A three-tier demo app — React · Node · PostgreSQL — built to ride the
          full CI/CD lifecycle.
        </p>
      </header>

      <main className="panel">
        <div className="stats">
          <div className="stat">
            <span className="stat-num">{total}</span>
            <span className="stat-label">total</span>
          </div>
          <div className="stat">
            <span className="stat-num">{done}</span>
            <span className="stat-label">done</span>
          </div>
          <div className="progress-wrap">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="progress-pct">{pct}%</span>
          </div>
        </div>

        <form className="composer" onSubmit={addTask}>
          <input
            className="composer-input"
            placeholder="What needs to get done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="composer-actions">
            <div className="prio-group">
              {PRIORITIES.map((p) => (
                <button
                  type="button"
                  key={p.key}
                  className={`prio-chip ${p.key} ${
                    priority === p.key ? "active" : ""
                  }`}
                  onClick={() => setPriority(p.key)}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button className="add-btn" type="submit">
              Add task
            </button>
          </div>
        </form>

        {error && <div className="error">{error}</div>}
        {loading ? (
          <div className="empty">Loading…</div>
        ) : tasks.length === 0 ? (
          <div className="empty">No tasks yet — add your first one above.</div>
        ) : (
          <ul className="list">
            {tasks.map((t, i) => (
              <li
                key={t.id}
                className={`task ${t.done ? "is-done" : ""}`}
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <button
                  className="check"
                  onClick={() => toggle(t.id)}
                  aria-label="toggle"
                >
                  {t.done && (
                    <svg viewBox="0 0 24 24" width="14" height="14">
                      <path
                        d="M5 12.5l4.5 4.5L19 7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
                <span className="task-title">{t.title}</span>
                <span className={`prio-tag ${t.priority}`}>{t.priority}</span>
                <button
                  className="del"
                  onClick={() => remove(t.id)}
                  aria-label="delete"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16">
                    <path
                      d="M6 6l12 12M18 6L6 18"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      <footer className="foot">
        BSE-8B · DevOps Final Lab · TaskFlow v1.0
      </footer>
    </div>
  );
}
