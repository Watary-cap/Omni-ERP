import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerRequest } from "../services/authService";
import { useAuthStore } from "../store/authStore";
import { useSettings } from "../../settings/hooks/useSettings";

import { registerSchema, type RegisterValues } from "../schemas/auth.schemas";

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);
  const { settings } = useSettings();

  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    // La validation se déclenche à la sortie du champ, pas à chaque frappe
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: RegisterValues) {
    setServerError("");

    try {
      const user = await registerRequest({
        username: values.username,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
      });

      // Auto-login : le compte créé ouvre directement la session
      loginStore(user);

      navigate(settings.landingPage, { replace: true });
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "La création du compte a échoué.",
      );
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="register-grid">
        <div className="form-group">
          <label htmlFor="firstName">Prénom</label>

          <div className="input-wrapper">
            <input
              id="firstName"
              aria-invalid={Boolean(errors.firstName)}
              {...register("firstName")}
            />
          </div>

          {errors.firstName && (
            <p className="field-error">{errors.firstName.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Nom</label>

          <div className="input-wrapper">
            <input
              id="lastName"
              aria-invalid={Boolean(errors.lastName)}
              {...register("lastName")}
            />
          </div>

          {errors.lastName && (
            <p className="field-error">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="registerEmail">Email</label>

        <div className="input-wrapper">
          <span className="input-icon">✉</span>

          <input
            id="registerEmail"
            type="email"
            placeholder="prenom.nom@globaltech.fr"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </div>

        {errors.email && <p className="field-error">{errors.email.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="registerUsername">Identifiant</label>

        <div className="input-wrapper">
          <span className="input-icon">@</span>

          <input
            id="registerUsername"
            aria-invalid={Boolean(errors.username)}
            {...register("username")}
          />
        </div>

        {errors.username && (
          <p className="field-error">{errors.username.message}</p>
        )}
      </div>

      <div className="register-grid">
        <div className="form-group">
          <label htmlFor="registerPassword">Mot de passe</label>

          <div className="input-wrapper">
            <span className="input-icon">🔒</span>

            <input
              id="registerPassword"
              type="password"
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
          </div>

          {errors.password ? (
            <p className="field-error">{errors.password.message}</p>
          ) : (
            <p className="field-hint">
              8 caractères, une majuscule, une minuscule et un chiffre.
            </p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmation</label>

          <div className="input-wrapper">
            <span className="input-icon">🔒</span>

            <input
              id="confirmPassword"
              type="password"
              aria-invalid={Boolean(errors.confirmPassword)}
              {...register("confirmPassword")}
            />
          </div>

          {errors.confirmPassword && (
            <p className="field-error">{errors.confirmPassword.message}</p>
          )}
        </div>
      </div>

      {serverError && (
        <div className="login-error" role="alert">
          {serverError}
        </div>
      )}

      <button className="login-button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Création..." : "Créer mon compte"}
        {!isSubmitting && <span>→</span>}
      </button>

      {onSwitchToLogin && (
        <p className="login-switch">
          Déjà inscrit ?{" "}
          <button type="button" onClick={onSwitchToLogin}>
            Se connecter
          </button>
        </p>
      )}
    </form>
  );
}
