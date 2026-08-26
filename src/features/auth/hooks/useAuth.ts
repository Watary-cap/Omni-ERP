import { loginRequest } from "../services/authService";

import { useAuthStore } from "../store/authStore";

import type { LoginCredentials, UserRole } from "../types/auth.types";

export function useAuth() {
  const { user, isAuthenticated, login: loginStore, logout } = useAuthStore();

  async function login(credentials: LoginCredentials) {
    const user = await loginRequest(credentials);

    loginStore(user);

    return user;
  }

  function hasRole(roles: UserRole[]) {
    if (!user) {
      return false;
    }

    return roles.includes(user.role);
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    hasRole,
  };
}
