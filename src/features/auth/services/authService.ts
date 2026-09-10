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

export async function registerRequest(input: {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
}): Promise<AuthUser> {
  // L'identifiant doit rester unique : json-server ne l'impose pas
  const existing = await fetch(
    `${API_URL}/users?username=${encodeURIComponent(input.username)}`,
  );

  if (!existing.ok) {
    throw new Error("Impossible de contacter le serveur.");
  }

  const found: AuthUser[] = await existing.json();

  if (found.length > 0) {
    throw new Error("Cet identifiant est déjà utilisé.");
  }

  const response = await fetch(`${API_URL}/users`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      username: input.username,
      password: input.password,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      // Un compte créé librement n'obtient que le rôle le plus restreint
      role: "user",
      employeeId: null,
    }),
  });

  if (!response.ok) {
    throw new Error("La création du compte a échoué.");
  }

  return response.json();
}
