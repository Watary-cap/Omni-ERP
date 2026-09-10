import { useCallback, useMemo, useReducer } from "react";

export type ToggleListAction =
  | { type: "toggle"; value: string }
  | { type: "select"; value: string }
  | { type: "clear" };

export type ToggleListReducer = (
  state: string[],
  action: ToggleListAction,
) => string[];

function defaultReducer(state: string[], action: ToggleListAction): string[] {
  switch (action.type) {
    case "toggle":
      return state.includes(action.value)
        ? state.filter((item) => item !== action.value)
        : [...state, action.value];

    case "select":
      return state.includes(action.value) ? state : [...state, action.value];

    case "clear":
      return [];

    default:
      return state;
  }
}

/**
 * State reducer pattern : le comportement par défaut est fourni, mais
 * l'appelant peut intercepter chaque action pour l'infléchir — par exemple
 * plafonner le nombre de sélections — sans réécrire la logique.
 *
 *   useToggleList([], (state, action, next) =>
 *     next.length > 3 ? state : next
 *   )
 */
export function useToggleList(
  initial: string[] = [],
  stateReducer?: (
    state: string[],
    action: ToggleListAction,
    proposed: string[],
  ) => string[],
) {
  const [selected, dispatch] = useReducer(
    (state: string[], action: ToggleListAction) => {
      const proposed = defaultReducer(state, action);

      return stateReducer ? stateReducer(state, action, proposed) : proposed;
    },
    initial,
  );

  /* `dispatch` est stable : les actions le sont donc aussi, ce qui permet
     aux consommateurs de mémoïser leurs enfants sans les invalider. */
  const toggle = useCallback(
    (value: string) => dispatch({ type: "toggle", value }),
    [],
  );

  const select = useCallback(
    (value: string) => dispatch({ type: "select", value }),
    [],
  );

  const clear = useCallback(() => dispatch({ type: "clear" }), []);

  const isSelected = useCallback(
    (value: string) => selected.includes(value),
    [selected],
  );

  return useMemo(
    () => ({ selected, toggle, select, clear, isSelected }),
    [selected, toggle, select, clear, isSelected],
  );
}
