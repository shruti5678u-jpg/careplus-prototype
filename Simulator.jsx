import { useNavigate } from "react-router-dom";
import { ChevronLeft, User, Check, TrendingUp, TriangleAlert, ShieldCheck, ArrowRight } from "lucide-react";
import { useAppState } from "../state";
import { MobileScreen, Pill, btn, ring, useBack, usePage } from "../components/ui";
import {
  BILL_MAX, BILL_MIN, BILL_PRESETS, BILL_STEP, PERSONAS, consumablesFor, futureCost, inr,
} from "../data";

export default function Simulator() {
  const navigate = useNavigate();
  const back = useBack("/");
  const headingRef = usePage("Financial Safety");
  const { bill, setBill, persona, setPersona } = useAppState();

  const insured = consumablesFor(bill);
  const pct = ((bill - BILL_MIN) / (BILL_MAX - BILL_MIN)) * 100;
  const personaNote = PERSONAS.find((p) => p.id === persona)?.note;

  return (
    <MobileScreen>
      <header className="flex items-center justify-between gap-2 px-4 py-3">
        <button type="button" aria-label="Go back" onClick={back} className={`flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white ${ring}`}>
          <ChevronLeft size={22} aria-hidden="true" />
        </button>
        <h1 ref={headingRef} tabIndex={-1} className="text-lg font-bold tracking-tight outline-none">Financial Safety</h1>
        <button
          type="button"
          aria-label="Your account and policies"
          onClick={() => navigate("/dashboard")}
          className={`relative flex h-11 w-11 items-center justify-center rounded-full bg-navy text-white ${ring}`}
        >
          <User size={22} aria-hidden="true" />
          <span aria-hidden="true" className="absolute -bottom-0.5 -right-0.5 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-[#F8FAFC] bg-safe">
            <Check size={11} strokeWidth={3.5} />
          </span>
        </button>
      </header>

      <main className="flex flex-1 flex-col gap-5 px-4 pb-6 pt-1">
        <section aria-labelledby="hero-title" className="flex flex-col gap-3 pt-1">
          <h2 id="hero-title" className="text-[27px] font-extrabold leading-tight tracking-tight">
            What does a health emergency really cost?
          </h2>
          <p className="flex items-start gap-2.5 rounded-xl bg-cobalt-tint px-3 py-2.5 text-sm leading-relaxed">
            <TrendingUp size={18} className="mt-0.5 shrink-0 text-cobalt-ink" aria-hidden="true" />
            <span>
              Private hospital costs are rising <strong className="text-cobalt-ink">14% every year</strong>, faster than most savings grow.
            </span>
          </p>
        </section>

        <section aria-labelledby="sim-title" className="flex flex-col gap-3.5 rounded-[20px] border border-slate-200 bg-white px-4 py-[18px] shadow-sm">
          <div className="flex flex-col gap-0.5">
            <h3 id="sim-title" className="text-[15px] font-bold">Bill simulator</h3>
            <label htmlFor="bill-range" className="text-[13px] text-ink-muted">Estimated hospital bill</label>
          </div>
          <output htmlFor="bill-range" data-testid="bill-amount" className="text-[34px] font-extrabold leading-none tracking-tight tabular-nums">
            {inr(bill)}
          </output>

          <div className="flex flex-col gap-1">
            <input
              id="bill-range"
              type="range"
              min={BILL_MIN}
              max={BILL_MAX}
              step={BILL_STEP}
              value={bill}
              aria-valuetext={inr(bill)}
              onChange={(e) => setBill(Number(e.target.value))}
              className={`cp-range rounded-full ${ring}`}
              style={{ background: `linear-gradient(to right,#0066F5 ${pct}%,#8391A5 ${pct}%) center / 100% 6px no-repeat` }}
            />
            <div aria-hidden="true" className="flex justify-between text-xs tabular-nums text-ink-muted">
              <span>{inr(BILL_MIN)}</span>
              <span>{inr(BILL_MAX)}</span>
            </div>
          </div>

          <div role="group" aria-label="Quick bill presets" className="grid grid-cols-4 gap-2">
            {BILL_PRESETS.map((p) => (
              <Pill key={p.value} pressed={bill === p.value} onClick={() => setBill(p.value)} className="px-1.5">
                {p.label}
              </Pill>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2.5" aria-live="polite">
            <div className="flex flex-col gap-1.5 rounded-[14px] border border-red-300 bg-danger-tint p-3">
              <div className="flex items-center gap-1.5 text-[13px] font-bold text-danger-ink">
                <TriangleAlert size={16} aria-hidden="true" /> Uninsured
              </div>
              <div className="text-xs text-danger-ink">You Pay</div>
              <div data-testid="uninsured-pay" className="text-[22px] font-extrabold leading-tight tracking-tight tabular-nums text-danger">{inr(bill)}</div>
              <div className="text-xs leading-snug text-danger-ink">Entire bill from your savings</div>
            </div>
            <div className="flex flex-col gap-1.5 rounded-[14px] border border-emerald-300 bg-safe-tint p-3">
              <div className="flex items-start gap-1.5 text-[13px] font-bold leading-tight text-safe-ink">
                <ShieldCheck size={16} className="shrink-0" aria-hidden="true" /> With CarePlus Pro
              </div>
              <div className="text-xs text-safe-ink">You Pay</div>
              <div data-testid="insured-pay" className="text-[22px] font-extrabold leading-tight tracking-tight tabular-nums text-safe">{inr(insured)}</div>
              <div className="text-xs leading-snug text-safe-ink">Consumables only</div>
            </div>
          </div>

          <dl className="flex flex-col gap-2 border-t border-slate-200 pt-3 text-sm">
            <div className="flex items-baseline justify-between gap-2">
              <dt className="text-ink-muted">CarePlus covers</dt>
              <dd className="font-extrabold tabular-nums text-safe-ink">{inr(bill - insured)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <dt className="text-ink-muted">Same bill in 5 years (14%/yr)</dt>
              <dd className="font-extrabold tabular-nums text-danger-ink">{inr(futureCost(bill))}</dd>
            </div>
          </dl>
        </section>

        <section aria-labelledby="persona-title" className="flex flex-col gap-2.5">
          <h3 id="persona-title" className="text-[15px] font-bold">Who needs cover?</h3>
          <div role="group" aria-labelledby="persona-title" className="grid grid-cols-3 gap-2">
            {PERSONAS.map((p) => (
              <Pill key={p.id} pressed={persona === p.id} onClick={() => setPersona(p.id)} className="px-1.5">
                {p.label}
              </Pill>
            ))}
          </div>
          <p aria-live="polite" className="text-[13px] text-ink-muted">{personaNote}</p>
        </section>
      </main>

      <footer className="sticky bottom-0 border-t border-slate-200 bg-white px-4 pb-6 pt-3 shadow-[0_-4px_16px_rgba(10,37,64,0.06)]">
        <button type="button" onClick={() => navigate("/plans")} className={`${btn} h-12 w-full bg-cobalt text-[19px] tracking-tight text-white hover:bg-[#0052CC]`}>
          Calculate My Tailored Plan
          <ArrowRight size={20} aria-hidden="true" />
        </button>
      </footer>
    </MobileScreen>
  );
}
