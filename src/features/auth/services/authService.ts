import type { AuthUser, LoginCredentials } from "../types/auth.types";

const API_URL = "http://localhost:3000";

export async function loginRequest(
  credentials: LoginCredentials,
): Promise<AuthUser> {
  const response = await fetch(
    `${API_URL}/users?username=${encodeURIComponent(
      credentials.username,
    )}&password=${encodeURIComponent(credentials.password)}`,
  );

  if (!response.ok) {
    throw new Error("Impossible de contacter le serveur.");
  }

  const users: AuthUser[] = await response.json();

  if (users.length === 0) {
    throw new Error("Identifiant ou mot de passe incorrect.");
  }

  return users[0];
}
