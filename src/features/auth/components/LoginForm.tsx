import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login({ username: email.trim(), password });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(
        error instanceof Error &&
          error.message === "Identifiant ou mot de passe incorrect."
          ? error.message
          : "Impossible de contacter le serveur. Vérifie que json-server est lancé.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Identifiant</label>

        <div className="input-wrapper">
          <span className="input-icon">✉</span>

          <input
            id="email"
            type="text"
            placeholder="Login ou email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
      </div>

      <div className="form-group">
        <div className="password-label">
          <label htmlFor="password">Mot de passe</label>

          <button type="button" className="forgot-password">
            Mot de passe oublié ?
          </button>
        </div>

        <div className="input-wrapper">
          <span className="input-icon">🔒</span>

          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <button
            type="button"
            className="show-password"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={
              showPassword
                ? "Masquer le mot de passe"
                : "Afficher le mot de passe"
            }
          >
            {showPassword ? "🙈" : "👁"}
          </button>
        </div>
      </div>

      {error && (
        <div className="login-error" role="alert">
          {error}
        </div>
      )}

      <div className="login-options">
        <label className="remember-me">
          <input type="checkbox" />
          <span>Se souvenir de moi</span>
        </label>
      </div>

      <button className="login-button" type="submit" disabled={loading}>
        {loading ? "Connexion..." : "Se connecter"}
        {!loading && <span>→</span>}
      </button>
    </form>
  );
}
