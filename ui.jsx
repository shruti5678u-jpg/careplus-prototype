import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export const ring =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-cobalt";

export const btn = `inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-colors ${ring}`;

/** Sets the tab title and moves focus to the page heading on every route change (screen-reader friendly). */
export function usePage(title) {
  const headingRef = useRef(null);
  useEffect(() => {
    document.title = `${title} · CarePlus Health`;
    headingRef.current?.focus({ preventScroll: true });
    window.scrollTo?.(0, 0);
  }, [title]);
  return headingRef;
}

/** Goes back in app history when there is some, otherwise to a fallback route. */
export function useBack(fallback = "/") {
  const navigate = useNavigate();
  return () => {
    const idx = window.history.state?.idx ?? 0;
    if (idx > 0) navigate(-1);
    else navigate(fallback);
  };
}

export function Pill({ pressed, onClick, children, className = "" }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`h-11 rounded-full px-3 text-sm ${ring} ${
        pressed
          ? "border-2 border-cobalt bg-cobalt-tint font-bold text-cobalt-ink"
          : "border border-slate-400 bg-white font-semibold text-navy hover:bg-slate-50"
      } ${className}`}
    >
      {children}
    </button>
  );
}

/** Phone-width column used by the three purchase-flow screens. */
export function MobileScreen({ children }) {
  return (
    <div className="relative mx-auto flex min-h-dvh w-full max-w-md flex-col bg-[#F8FAFC] md:my-6 md:min-h-[calc(100dvh-3rem)] md:overflow-hidden md:rounded-[32px] md:border md:border-slate-200 md:shadow-xl">
      {children}
    </div>
  );
}

export function StepBar({ step, total = 3, label }) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      <p className="text-[13px] font-semibold text-ink-muted">
        Step {step} of {total}: <span className="text-navy">{label}</span>
      </p>
      <div aria-hidden="true" className="grid grid-cols-3 gap-1">
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className={`h-1 rounded ${i < step ? "bg-cobalt" : "bg-slate-300"}`} />
        ))}
      </div>
    </div>
  );
}
