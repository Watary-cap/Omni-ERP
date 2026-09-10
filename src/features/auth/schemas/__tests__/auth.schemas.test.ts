import { describe, expect, it } from "vitest";

import { loginSchema, registerSchema } from "../auth.schemas";

const valide = {
  firstName: "Arthur",
  lastName: "Litschig",
  email: "arthur@omni-erp.fr",
  username: "arthur",
  password: "Motdepasse1",
  confirmPassword: "Motdepasse1",
};

describe("loginSchema", () => {
  it("accepte des identifiants renseignés", () => {
    expect(
      loginSchema.safeParse({ username: "Arthur", password: "admin" }).success,
    ).toBe(true);
  });

  it("refuse un identifiant vide", () => {
    const result = loginSchema.safeParse({ username: "  ", password: "x" });

    expect(result.success).toBe(false);
  });

  it("refuse un mot de passe vide", () => {
    const result = loginSchema.safeParse({ username: "Arthur", password: "" });

    expect(result.success).toBe(false);
  });
});

describe("registerSchema", () => {
  it("accepte une inscription complète", () => {
    expect(registerSchema.safeParse(valide).success).toBe(true);
  });

  it.each([
    ["court", "Ab1"],
    ["sans majuscule", "motdepasse1"],
    ["sans minuscule", "MOTDEPASSE1"],
    ["sans chiffre", "Motdepasse"],
  ])("refuse un mot de passe %s", (_cas, password) => {
    const result = registerSchema.safeParse({
      ...valide,
      password,
      confirmPassword: password,
    });

    expect(result.success).toBe(false);
  });

  it("rattache l'erreur de confirmation au bon champ", () => {
    const result = registerSchema.safeParse({
      ...valide,
      confirmPassword: "Autrechose1",
    });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(result.error.issues[0].path).toEqual(["confirmPassword"]);
    }
  });

  it("refuse un mot de passe qui reprend l'identifiant", () => {
    const result = registerSchema.safeParse({
      ...valide,
      username: "Motdepasse1",
      password: "Motdepasse1",
      confirmPassword: "Motdepasse1",
    });

    expect(result.success).toBe(false);
  });

  it("refuse un email mal formé", () => {
    expect(
      registerSchema.safeParse({ ...valide, email: "pas-un-email" }).success,
    ).toBe(false);
  });

  it("refuse un identifiant avec des caractères interdits", () => {
    expect(
      registerSchema.safeParse({ ...valide, username: "arthur litschig" })
        .success,
    ).toBe(false);
  });
});
