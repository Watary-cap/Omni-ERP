import { useState, type FormEvent } from "react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log({
      email,
      password,
    });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Adresse email</label>

        <div className="input-wrapper">
          <span className="input-icon">✉</span>

          <input
            id="email"
            type="email"
            placeholder="admin@omnierp.com"
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
            placeholder="Votre mot de passe"
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

      <div className="login-options">
        <label className="remember-me">
          <input type="checkbox" />
          <span>Se souvenir de moi</span>
        </label>
      </div>

      <button className="login-button" type="submit">
        Se connecter
        <span>→</span>
      </button>
    </form>
  );
}