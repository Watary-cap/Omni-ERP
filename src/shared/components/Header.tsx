import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../features/auth/hooks/useAuth";

const roleLabels = {
  admin: "Administrateur",
  manager: "Manager",
  user: "Salarié",
  super_manager: "Super manager",
  ceo: "Directeur général",
} as const;

interface HeaderProps {
  isDarkTheme: boolean;
  onToggleTheme: () => void;
}

function Header({ isDarkTheme, onToggleTheme }: HeaderProps) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const username = user?.username ?? "Utilisateur";
  const initials = username.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="topbar">
      <div>
        <h2>Bonjour 👋</h2>
        <p>Voici un aperçu de votre entreprise aujourd'hui.</p>
      </div>

      <div className="topbar-actions">
        <button
          type="button"
          className="icon-button"
          onClick={onToggleTheme}
          aria-label={
            isDarkTheme ? "Activer le thème clair" : "Activer le thème sombre"
          }
          title={isDarkTheme ? "Thème clair" : "Thème sombre"}
        >
          {isDarkTheme ? "☀" : "☾"}
        </button>

        <div className="user-profile-wrapper">
          <button
            type="button"
            className="user-profile"
            onClick={() => setIsProfileOpen((isOpen) => !isOpen)}
            aria-expanded={isProfileOpen}
            aria-haspopup="menu"
          >
            <div className="avatar">{initials}</div>

            <div className="user-info">
              <strong>{username}</strong>
              <span>{user ? roleLabels[user.role] : ""}</span>
            </div>
          </button>

          {isProfileOpen && (
            <div className="profile-menu" role="menu">
              <div className="profile-menu-heading">
                <strong>{username}</strong>
                <span>{user?.role ? roleLabels[user.role] : ""}</span>
              </div>

              <button
                type="button"
                className="profile-logout-button"
                onClick={handleLogout}
                role="menuitem"
              >
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* La barre du haut ne dépend que de deux props stables : elle n'a pas à
   se re-rendre à chaque changement de page. */
export default memo(Header);
