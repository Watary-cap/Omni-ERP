import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="login-page">
      <section className="login-brand-panel">
        <div className="login-brand-content">
          <div className="login-logo">
            <div className="login-logo-icon">O</div>

            <div>
              <h2>Omni-ERP</h2>
              <span>Enterprise Suite</span>
            </div>
          </div>

          <div className="login-presentation">
            <span className="login-badge">GESTION CENTRALISÉE</span>

            <h1>
              Gérez votre entreprise
              <br />
              depuis un seul endroit.
            </h1>

            <p>
              Projets, collaborateurs, clients, ventes et stocks réunis
              dans une plateforme unique.
            </p>
          </div>

          <div className="login-modules">
            <div className="login-module">
              <div>▦</div>
              <span>Projets</span>
            </div>

            <div className="login-module">
              <div>👥</div>
              <span>RH</span>
            </div>

            <div className="login-module">
              <div>◉</div>
              <span>CRM</span>
            </div>

            <div className="login-module">
              <div>▣</div>
              <span>ERP</span>
            </div>

            <div className="login-module">
              <div>📊</div>
              <span>Analytics</span>
            </div>
          </div>

          <p className="login-copyright">
            © 2026 GlobalTech Solutions
          </p>
        </div>
      </section>

      <section className="login-form-panel">
        <div className="login-card">
          <div className="mobile-login-logo">
            <div className="login-logo-icon">O</div>
            <strong>Omni-ERP</strong>
          </div>

          <div className="login-card-heading">
            <span className="welcome-label">BIENVENUE</span>

            <h2>Connectez-vous</h2>

            <p>
              Entrez vos identifiants pour accéder à votre espace
              de travail.
            </p>
          </div>

          <LoginForm />

          <div className="login-divider">
            <span />
            <p>Accès sécurisé</p>
            <span />
          </div>

          <div className="login-security">
            <span>🔒</span>

            <p>
              Vos informations de connexion sont protégées et
              sécurisées.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}