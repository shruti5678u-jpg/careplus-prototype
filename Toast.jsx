import { createContext, useCallback, useContext, useRef, useState } from "react";
import { Info, X } from "lucide-react";
import { ring } from "./ui";

const ToastContext = createContext(() => {});

export function ToastProvider({ children }) {
  const [msg, setMsg] = useState("");
  const timer = useRef();
  const show = useCallback((text) => {
    setMsg(text);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setMsg(""), 4000);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-28 z-50 flex justify-center px-4">
        {msg && (
          <div className="pointer-events-auto flex max-w-md items-start gap-3 rounded-2xl bg-navy px-4 py-3 text-sm text-white shadow-xl">
            <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
            <span className="flex-1 leading-normal">{msg}</span>
            <button type="button" aria-label="Dismiss" onClick={() => setMsg("")} className={`-m-2 flex h-9 w-9 items-center justify-center rounded-full ${ring}`}>
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
