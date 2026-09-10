import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../hooks/useAuth";
import { useSettings } from "../../settings/hooks/useSettings";

import { loginSchema, type LoginValues } from "../schemas/auth.schemas";

interface LoginFormProps {
  onSwitchToRegister?: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { settings } = useSettings();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  async function onSubmit(values: LoginValues) {
    setServerError("");

    try {
      await login(values);

      // Page d'accueil choisie dans les paramètres
      navigate(settings.landingPage, { replace: true });
    } catch (error) {
      setServerError(
        error instanceof Error &&
          error.message === "Identifiant ou mot de passe incorrect."
          ? error.message
          : "Impossible de contacter le serveur. Vérifie que json-server est lancé.",
      );
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="form-group">
        <label htmlFor="email">Identifiant</label>

        <div className="input-wrapper">
          <span className="input-icon">✉</span>

          <input
            id="email"
            type="text"
            placeholder="Login ou email"
            aria-invalid={Boolean(errors.username)}
            {...register("username")}
          />
        </div>

        {errors.username && (
          <p className="field-error">{errors.username.message}</p>
        )}
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
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
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

        {errors.password && (
          <p className="field-error">{errors.password.message}</p>
        )}
      </div>

      {serverError && (
        <div className="login-error" role="alert">
          {serverError}
        </div>
      )}

      <div className="login-options">
        <label className="remember-me">
          <input type="checkbox" />
          <span>Se souvenir de moi</span>
        </label>
      </div>

      <button className="login-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Connexion..." : "Se connecter"}
        {!isSubmitting && <span>→</span>}
      </button>

      {onSwitchToRegister && (
        <p className="login-switch">
          Pas encore de compte ?{" "}
          <button type="button" onClick={onSwitchToRegister}>
            Créer un compte
          </button>
        </p>
      )}
    </form>
  );
}
