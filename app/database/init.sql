-- TaskFlow database schema + seed data
CREATE TABLE IF NOT EXISTS tasks (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL,
    priority    TEXT NOT NULL DEFAULT 'medium',
    done        BOOLEAN NOT NULL DEFAULT false,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO tasks (title, priority, done) VALUES
    ('Provision AWS infrastructure with Terraform', 'high', false),
    ('Configure server with Ansible', 'high', false),
    ('Build Jenkins CI/CD pipeline', 'high', false),
    ('Deploy to Kubernetes cluster', 'medium', false),
    ('Set up Prometheus + Grafana monitoring', 'medium', false),
    ('Run Trivy security scan', 'low', true)
ON CONFLICT DO NOTHING;
