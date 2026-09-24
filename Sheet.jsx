import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { ring } from "./ui";

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/** Accessible bottom sheet: traps focus, closes on Escape / backdrop, restores focus on close. */
export default function Sheet({ titleId, title, onClose, children }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Tab" && panelRef.current) {
        const items = [...panelRef.current.querySelectorAll(FOCUSABLE)];
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-40 flex flex-col items-center justify-end bg-navy/60" onClick={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[88dvh] w-full max-w-md flex-col gap-4 overflow-y-auto rounded-t-3xl bg-white px-4 pb-6 pt-2 shadow-2xl"
      >
        <div aria-hidden="true" className="h-1 w-10 self-center rounded bg-slate-400" />
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-xl font-extrabold leading-snug">{title}</h2>
          <button
            ref={closeRef}
            type="button"
            aria-label="Close explanation"
            onClick={onClose}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-300 bg-white ${ring}`}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
