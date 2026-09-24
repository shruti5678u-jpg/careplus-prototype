import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Check, ShieldCheck, Info, CircleCheck, TriangleAlert, ArrowRight } from "lucide-react";
import { useAppState } from "../state";
import { MobileScreen, StepBar, Pill, btn, ring, useBack, usePage } from "../components/ui";
import Sheet from "../components/Sheet";
import { COMPARE_CELLS, COMPARE_ROWS, GLOSSARY, PERSONAS, PLANS, getPlan } from "../data";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "zero", label: "Zero Copay" },
  { id: "parent", label: "Parent Cover" },
];

function Explanation({ id, onClose }) {
  const s = GLOSSARY[id];
  return (
    <Sheet titleId="sheet-title" title={s.title} onClose={onClose}>
      {s.points.map((t) => (
        <p key={t} className="text-[15px] leading-relaxed">{t}</p>
      ))}
      {s.steps && (
        <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-[#F8FAFC] p-4">
          <h3 className="text-[13px] font-extrabold uppercase tracking-wide text-ink-muted">Example</h3>
          <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm leading-normal tabular-nums">
            {s.steps.map((t) => <li key={t}>{t}</li>)}
          </ol>
          <p className="rounded-lg bg-danger-tint px-3 py-2 text-sm font-bold tabular-nums text-danger-ink">{s.result}</p>
        </div>
      )}
      <div className="flex flex-col gap-2 text-sm leading-normal">
        <p className="flex gap-2"><strong className="shrink-0">Standard Shield:</strong><span>{s.a}</span></p>
        <p className="flex gap-2 text-safe-ink"><strong className="shrink-0">CarePlus Ultra:</strong><span>{s.b}</span></p>
      </div>
      <button type="button" onClick={onClose} className={`${btn} h-12 bg-navy text-base text-white`}>Got it</button>
    </Sheet>
  );
}

export default function PlanCompare() {
  const navigate = useNavigate();
  const back = useBack("/");
  const headingRef = usePage("Compare plans");
  const { planId, selectPlan, persona } = useAppState();
  const [filter, setFilter] = useState("all");
  const [sheet, setSheet] = useState(null);
  const closeSheet = useCallback(() => setSheet(null), []);

  const visible = PLANS.filter((p) => (filter === "zero" ? p.zeroCopay : filter === "parent" ? p.parentCover : true));
  const cols = visible.length === 2 ? "grid-cols-2" : "grid-cols-1";
  const sel = getPlan(planId);
  const personaLabel = PERSONAS.find((p) => p.id === persona)?.label;

  const pickFilter = (id) => {
    setFilter(id);
    if (id === "zero") selectPlan("ultra");
  };

  return (
    <MobileScreen>
      <header className="flex flex-col gap-4 border-b border-slate-200 bg-white p-4">
        <div className="flex items-center gap-4">
          <button type="button" aria-label="Back to step 1" onClick={back} className={`flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 ${ring}`}>
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <StepBar step={2} label="Select Coverage" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-extrabold leading-tight tracking-tight outline-none">Compare plans in plain English</h1>
          <p className="text-[13px] text-ink-muted">
            Cover for: <strong className="text-navy">{personaLabel}</strong>{" "}
            <button type="button" onClick={() => navigate("/")} className={`rounded font-bold text-cobalt-deep underline underline-offset-2 ${ring}`}>Change</button>
          </p>
        </div>
        <div role="group" aria-label="Filter plans" className="flex gap-2">
          {FILTERS.map((f) => (
            <Pill key={f.id} pressed={filter === f.id} onClick={() => pickFilter(f.id)} className="px-4">{f.label}</Pill>
          ))}
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-4 px-4 pb-48 pt-4">
        {visible.length === 0 ? (
          <div className="flex flex-col items-start gap-2 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-base font-bold">No plans here include parent cover</h2>
            <p className="text-sm leading-normal text-ink-muted">Neither Standard Shield nor CarePlus Ultra covers parents yet.</p>
            <button type="button" onClick={() => setFilter("all")} className={`${btn} mt-2 h-11 border border-cobalt-deep px-4 text-sm text-cobalt-deep`}>
              Show all plans
            </button>
          </div>
        ) : (
          <>
            <div role="radiogroup" aria-label="Choose a plan" className={`grid gap-2 ${cols}`}>
              {visible.map((p) => {
                const on = planId === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => selectPlan(p.id)}
                    className={`flex flex-col gap-2 rounded-2xl px-3 py-4 text-left ${ring} ${on ? "border-2 border-cobalt bg-cobalt-wash" : "border border-slate-400 bg-white hover:bg-slate-50"}`}
                  >
                    <span className="flex min-h-6 items-start justify-between gap-2">
                      {p.featured ? (
                        <span className="rounded-full bg-navy px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-white">Recommended</span>
                      ) : (
                        <span className="pt-1 text-xs font-semibold text-ink-muted">Basic</span>
                      )}
                      <span aria-hidden="true" className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${on ? "border-cobalt bg-cobalt text-white" : "border-slate-500 bg-white text-transparent"}`}>
                        <Check size={14} strokeWidth={3} />
                      </span>
                    </span>
                    <span className="text-base font-bold leading-tight">{p.name}</span>
                    <span className="flex items-baseline gap-1 tabular-nums">
                      <span className="text-2xl font-extrabold tracking-tight">₹{p.price}</span>
                      <span className="text-[13px] text-ink-muted">/month</span>
                    </span>
                    {p.featured && (
                      <span className="inline-flex items-center gap-1 self-start rounded-lg bg-safe-mint px-2 py-1 text-xs font-extrabold text-safe-ink">
                        <ShieldCheck size={14} aria-hidden="true" /> Zero Deductions
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <section aria-label="Plan details compared" className="rounded-2xl border border-slate-200 bg-white">
              <div aria-hidden="true" className={`sticky top-0 z-10 grid gap-2 rounded-t-2xl border-b border-slate-200 bg-slate-100 px-3 py-2 text-xs font-bold text-ink-muted ${cols}`}>
                {visible.map((p) => <span key={p.id}>{p.name}</span>)}
              </div>
              {COMPARE_ROWS.map((r, i) => (
                <div key={r.id} className={`flex flex-col gap-2 p-3 ${i ? "border-t border-slate-200" : ""}`}>
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    aria-label={`${r.label}: ${r.plain}. Open plain-English explanation`}
                    onClick={() => setSheet(r.id)}
                    className={`flex min-h-11 items-center justify-between gap-2 rounded-lg text-left ${ring}`}
                  >
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[15px] font-bold">{r.label}</span>
                      <span className="text-xs text-ink-muted">{r.plain}</span>
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cobalt-tint text-cobalt-deep">
                      <Info size={18} aria-hidden="true" />
                    </span>
                  </button>
                  <div className={`grid gap-2 ${cols}`}>
                    {visible.map((p) => {
                      const c = COMPARE_CELLS[r.id][p.id];
                      return (
                        <div key={p.id} className={`flex flex-col gap-1 rounded-xl px-3 pb-3 pt-2 ${p.featured ? "border border-[#BFD6FF] bg-cobalt-wash" : "border border-slate-200 bg-white"}`}>
                          <span className="sr-only">{p.name}:</span>
                          <span className="flex min-h-6 items-center gap-1">
                            {c.good && <CircleCheck size={16} className="text-safe" aria-hidden="true" />}
                            <span className="text-base font-extrabold tabular-nums">{c.value}</span>
                          </span>
                          {c.warn && (
                            <span className="inline-flex items-center gap-1 self-start rounded-lg border border-amber-600 bg-warn-tint px-2 py-0.5 text-xs font-bold text-warn-ink">
                              <TriangleAlert size={12} aria-hidden="true" /> Sub-limit
                            </span>
                          )}
                          <span className="text-xs leading-snug text-ink-muted">{c.note}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </section>
          </>
        )}
      </main>

      <div className="fixed inset-x-0 bottom-4 z-30 mx-auto w-full max-w-md px-2">
        <div className="flex flex-col gap-4 rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_8px_24px_rgba(10,37,64,0.16)]">
          <div aria-live="polite" className="flex items-end justify-between gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-ink-muted">Selected plan</span>
              <span data-testid="selected-plan" className="text-base font-bold">{sel.name}</span>
            </div>
            <div className="flex items-baseline gap-1 tabular-nums">
              <span data-testid="selected-price" className="text-2xl font-extrabold tracking-tight">₹{sel.price}</span>
              <span className="text-[13px] text-ink-muted">/month</span>
            </div>
          </div>
          <button type="button" onClick={() => navigate("/declaration")} className={`${btn} h-12 w-full bg-cobalt-deep text-base text-white hover:bg-cobalt-ink`}>
            Continue to Medical Declaration
            <ArrowRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {sheet && <Explanation id={sheet} onClose={closeSheet} />}
    </MobileScreen>
  );
}
