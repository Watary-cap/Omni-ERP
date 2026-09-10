import type { AuthUser } from "../../auth/types/auth.types";

const API_URL = "http://localhost:3000";

export async function updatePassword(
  userId: number | string,
  password: string,
): Promise<AuthUser> {
  const response = await fetch(`${API_URL}/users/${userId}`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    throw new Error("Impossible de mettre à jour le mot de passe");
  }

  return response.json();
}
