const canaryUser = (() => {
  const key = "omni-erp-canary-id";
  const existing = window.localStorage.getItem(key);
  if (existing) return existing;
  const value = crypto.randomUUID();
  window.localStorage.setItem(key, value);
  return value;
})();

function bucket(value: string) {
  return [...value].reduce((total, character) => total + character.charCodeAt(0), 0) % 100;
}

export function isFeatureEnabled(
  flag: string,
  options: { rollout?: number; defaultValue?: boolean } = {},
) {
  const configured = import.meta.env[`VITE_FLAG_${flag.toUpperCase()}`];
  if (configured === "true") return true;
  if (configured === "false") return false;
  if (options.rollout !== undefined) return bucket(`${flag}:${canaryUser}`) < options.rollout;
  return options.defaultValue ?? false;
}
