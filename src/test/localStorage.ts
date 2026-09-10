/**
 * jsdom 29 sous Vitest 4 expose `window.localStorage` comme un objet vide,
 * sans les méthodes de l'interface Storage. Les stores Zustand persistés
 * s'en servent dès leur import : on installe une implémentation conforme
 * avant que le moindre module applicatif ne soit chargé.
 */
export function installLocalStorage() {
  const createStorage = (): Storage => {
    let store = new Map<string, string>();

    return {
      get length() {
        return store.size;
      },
      key: (index: number) => [...store.keys()][index] ?? null,
      getItem: (key: string) => store.get(String(key)) ?? null,
      setItem: (key: string, value: string) => {
        store.set(String(key), String(value));
      },
      removeItem: (key: string) => {
        store.delete(String(key));
      },
      clear: () => {
        store = new Map();
      },
    };
  };

  for (const name of ["localStorage", "sessionStorage"] as const) {
    Object.defineProperty(window, name, {
      value: createStorage(),
      configurable: true,
      writable: true,
    });
  }
}
