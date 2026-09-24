import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { BILL_DEFAULT, createPolicy } from "./data";

const STORAGE_KEY = "careplus-prototype-v1";

const INITIAL = {
  bill: BILL_DEFAULT,
  persona: "me",
  planId: "ultra",
  declaration: null,
  policy: null,
};

function load() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...INITIAL, ...JSON.parse(raw) } : INITIAL;
  } catch {
    return INITIAL;
  }
}

const AppStateContext = createContext(null);

export function AppStateProvider({ children, initialState }) {
  const [state, setState] = useState(() => (initialState ? { ...INITIAL, ...initialState } : load()));

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage unavailable (private mode): keep working in memory */
    }
  }, [state]);

  const set = useCallback((patch) => setState((s) => ({ ...s, ...patch })), []);

  const actions = useMemo(
    () => ({
      setBill: (bill) => set({ bill }),
      setPersona: (persona) => set({ persona }),
      selectPlan: (planId) => set({ planId }),
      activatePolicy: (declaration) =>
        setState((s) => ({ ...s, declaration, policy: createPolicy(s.planId, s.persona) })),
      reset: () => setState(INITIAL),
    }),
    [set]
  );

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions]);
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used inside <AppStateProvider>");
  return ctx;
}
