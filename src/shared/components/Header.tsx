export default function Header() {
  return (
    <header className="topbar">
      <div>
        <h2>Bonjour 👋</h2>
        <p>Voici un aperçu de votre entreprise aujourd'hui.</p>
      </div>

      <div className="topbar-actions">
        <button className="icon-button">🔔</button>

        <div className="user-profile">
          <div className="avatar">AD</div>

          <div className="user-info">
            <strong>Admin</strong>
            <span>Administrateur</span>
          </div>
        </div>
      </div>
    </header>
  );
}