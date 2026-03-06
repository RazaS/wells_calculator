import { useMemo, useState } from "react";

const VALID_USERNAME = "raza";
const VALID_PASSWORD = "ismail";

const CRITERIA = [
  {
    id: "dvt_signs",
    label: "Clinical signs and symptoms of DVT",
    detail: "Minimum of leg swelling and pain with palpation of deep veins",
    points: 3.0,
  },
  {
    id: "pe_most_likely",
    label: "PE is the most likely diagnosis",
    detail: "Alternative diagnosis is less likely than PE",
    points: 3.0,
  },
  {
    id: "heart_rate",
    label: "Heart rate > 100 bpm",
    detail: "",
    points: 1.5,
  },
  {
    id: "immobilization_surgery",
    label: "Immobilization >= 3 days or recent surgery",
    detail: "Surgery in the previous 4 weeks",
    points: 1.5,
  },
  {
    id: "previous_vte",
    label: "Previous DVT or PE",
    detail: "",
    points: 1.5,
  },
  {
    id: "hemoptysis",
    label: "Hemoptysis",
    detail: "",
    points: 1.0,
  },
  {
    id: "malignancy",
    label: "Malignancy",
    detail: "On treatment, treated in the last 6 months, or palliative",
    points: 1.0,
  },
];

function getTwoTier(score) {
  return score > 4 ? "PE likely" : "PE unlikely";
}

function getThreeTier(score) {
  if (score < 2) return "Low probability";
  if (score <= 6) return "Moderate probability";
  return "High probability";
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [selected, setSelected] = useState({});

  const score = useMemo(
    () =>
      CRITERIA.reduce(
        (sum, criterion) => (selected[criterion.id] ? sum + criterion.points : sum),
        0
      ),
    [selected]
  );

  const selectedCount = useMemo(
    () => CRITERIA.filter((criterion) => selected[criterion.id]).length,
    [selected]
  );

  const toggleCriterion = (id) => {
    setSelected((previous) => ({ ...previous, [id]: !previous[id] }));
  };

  const reset = () => setSelected({});
  const logout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    setLoginError("");
    reset();
  };

  const handleLogin = (event) => {
    event.preventDefault();
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError("");
      return;
    }
    setLoginError("Invalid username or password.");
  };

  if (!isAuthenticated) {
    return (
      <main className="page login-page">
        <section className="panel login-panel">
          <p className="eyebrow">Secure Access</p>
          <h1>Wells PE Calculator Login</h1>
          <p className="subtitle">Sign in to access the pulmonary embolism scoring tool.</p>

          <form className="login-form" onSubmit={handleLogin}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              required
            />

            {loginError ? <p className="login-error">{loginError}</p> : null}
            <button type="submit" className="primary-btn">
              Login
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="panel title-panel">
        <p className="eyebrow">Clinical Scoring Tool</p>
        <h1>Wells Criteria for Pulmonary Embolism</h1>
        <p className="subtitle">
          Select all findings present in your patient. Score updates instantly.
        </p>
        <button type="button" className="primary-btn logout-btn" onClick={logout}>
          Logout
        </button>
      </section>

      <section className="layout">
        <section className="panel criteria-panel">
          <header className="section-head">
            <h2>Criteria</h2>
            <button className="reset-btn" type="button" onClick={reset}>
              Clear all
            </button>
          </header>

          <div className="criteria-grid">
            {CRITERIA.map((criterion) => {
              const active = Boolean(selected[criterion.id]);
              return (
                <label
                  key={criterion.id}
                  className={`criterion-card ${active ? "active" : ""}`}
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleCriterion(criterion.id)}
                  />
                  <div className="criterion-content">
                    <div className="criterion-top">
                      <h3>{criterion.label}</h3>
                      <span className="points">{criterion.points.toFixed(1)}</span>
                    </div>
                    {criterion.detail ? <p>{criterion.detail}</p> : null}
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        <aside className="panel score-panel">
          <h2>Result</h2>
          <p className="score-label">Total Score</p>
          <p className="score-value">{score.toFixed(1)}</p>
          <p className="selected-count">
            {selectedCount} of {CRITERIA.length} criteria selected
          </p>

          <div className="result-box">
            <p className="result-heading">Two-tier model</p>
            <p className="result-value">{getTwoTier(score)}</p>
          </div>

          <div className="result-box">
            <p className="result-heading">Three-tier model</p>
            <p className="result-value">{getThreeTier(score)}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}
