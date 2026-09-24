import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ShieldCheck, Lock, TriangleAlert } from "lucide-react";
import { useAppState } from "../state";
import { MobileScreen, StepBar, btn, ring, useBack, usePage } from "../components/ui";
import { DECLARATION_QUESTIONS, PERSONAS, getPlan } from "../data";

export default function Declaration() {
  const navigate = useNavigate();
  const back = useBack("/plans");
  const headingRef = usePage("Medical declaration");
  const { planId, persona, activatePolicy } = useAppState();
  const plan = getPlan(planId);
  const personaLabel = PERSONAS.find((p) => p.id === persona)?.label;

  const [answers, setAnswers] = useState({});
  const [details, setDetails] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const summaryRef = useRef(null);

  const anyYes = Object.values(answers).includes("yes");

  const validate = () => {
    const e = {};
    DECLARATION_QUESTIONS.forEach((q) => {
      if (!answers[q.id]) e[q.id] = "Choose Yes or No.";
    });
    if (anyYes && !details.trim()) e.details = "Tell us briefly about the Yes answers.";
    if (!consent) e.consent = "Confirm that your answers are true.";
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setErrors(null);
    setSubmitting(true);
    // Mock payment + underwriting
    setTimeout(() => {
      activatePolicy({ answers, details: details.trim() });
      navigate("/dashboard", { replace: true });
    }, 900);
  };

  const errCount = errors ? Object.keys(errors).length : 0;

  return (
    <MobileScreen>
      <header className="flex flex-col gap-4 border-b border-slate-200 bg-white p-4">
        <div className="flex items-center gap-4">
          <button type="button" aria-label="Back to step 2" onClick={back} className={`flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 ${ring}`}>
            <ChevronLeft size={22} aria-hidden="true" />
          </button>
          <StepBar step={3} label="Medical Declaration" />
        </div>
        <div className="flex flex-col gap-1">
          <h1 ref={headingRef} tabIndex={-1} className="text-2xl font-extrabold leading-tight tracking-tight outline-none">A few health questions</h1>
          <p className="text-sm leading-normal text-ink-muted">
            Answer for everyone on the policy ({personaLabel}). Honest answers keep your future claims safe.
          </p>
        </div>
      </header>

      <form noValidate onSubmit={submit} className="flex flex-1 flex-col">
        <main className="flex flex-1 flex-col gap-4 px-4 pb-6 pt-4">
          {errCount > 0 && (
            <div ref={summaryRef} tabIndex={-1} role="alert" className="flex items-start gap-3 rounded-2xl border-2 border-danger-strong bg-danger-tint p-4 text-danger-ink outline-none">
              <TriangleAlert size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
              <div className="flex flex-col gap-1 text-sm">
                <strong>{errCount === 1 ? "1 answer needs attention" : `${errCount} answers need attention`}</strong>
                <span>Check the questions marked below.</span>
              </div>
            </div>
          )}

          {DECLARATION_QUESTIONS.map((q, i) => {
            const err = errors?.[q.id];
            return (
              <fieldset
                key={q.id}
                aria-describedby={err ? `${q.id}-err` : undefined}
                className={`flex flex-col gap-3 rounded-2xl border bg-white p-4 ${err ? "border-2 border-danger-strong" : "border-slate-200"}`}
              >
                <legend className="sr-only">{q.text}</legend>
                <p aria-hidden="true" className="text-[15px] font-bold leading-snug">
                  <span className="text-ink-muted">{i + 1}. </span>{q.text}
                </p>
                {q.hint && <p className="-mt-2 text-[13px] text-ink-muted">{q.hint}</p>}
                <div className="grid grid-cols-2 gap-2">
                  {["no", "yes"].map((v) => {
                    const on = answers[q.id] === v;
                    return (
                      <label
                        key={v}
                        className={`flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl text-sm has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-[3px] has-[:focus-visible]:outline-cobalt ${
                          on ? "border-2 border-cobalt bg-cobalt-tint font-bold text-cobalt-ink" : "border border-slate-400 bg-white font-semibold"
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          value={v}
                          checked={on}
                          onChange={() => setAnswers((a) => ({ ...a, [q.id]: v }))}
                          className="sr-only"
                        />
                        {v === "yes" ? "Yes" : "No"}
                      </label>
                    );
                  })}
                </div>
                {err && <p id={`${q.id}-err`} className="text-[13px] font-bold text-danger-ink">{err}</p>}
              </fieldset>
            );
          })}

          {anyYes && (
            <div className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-4">
              <label htmlFor="details" className="text-[15px] font-bold">Tell us more about the Yes answers</label>
              <p id="details-hint" className="text-[13px] text-ink-muted">Who, what condition or treatment, and roughly when.</p>
              <textarea
                id="details"
                rows={3}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                aria-invalid={!!errors?.details}
                aria-describedby={`details-hint${errors?.details ? " details-err" : ""}`}
                className={`rounded-xl border p-3 text-sm ${ring} ${errors?.details ? "border-2 border-danger-strong" : "border-slate-400"}`}
              />
              {errors?.details && <p id="details-err" className="text-[13px] font-bold text-danger-ink">{errors.details}</p>}
            </div>
          )}

          <div className={`flex flex-col gap-2 rounded-2xl border bg-white p-4 ${errors?.consent ? "border-2 border-danger-strong" : "border-slate-200"}`}>
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-normal">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                aria-invalid={!!errors?.consent}
                aria-describedby={errors?.consent ? "consent-err" : undefined}
                className={`mt-0.5 h-6 w-6 shrink-0 accent-cobalt ${ring}`}
              />
              <span>I confirm these answers are true. I understand that wrong answers can lead to a claim being rejected.</span>
            </label>
            {errors?.consent && <p id="consent-err" className="text-[13px] font-bold text-danger-ink">{errors.consent}</p>}
          </div>

          <p className="flex items-center gap-2 text-xs text-ink-muted">
            <Lock size={14} aria-hidden="true" /> Prototype only. No payment is taken and no data leaves your browser.
          </p>
        </main>

        <footer className="sticky bottom-0 flex flex-col gap-3 border-t border-slate-200 bg-white px-4 pb-6 pt-3 shadow-[0_-4px_16px_rgba(10,37,64,0.06)]">
          <div className="flex items-baseline justify-between text-sm">
            <span className="text-ink-muted">{plan.name}</span>
            <span className="tabular-nums"><strong className="text-lg">₹{plan.price}</strong> /month</span>
          </div>
          <button
            type="submit"
            disabled={submitting}
            aria-disabled={submitting}
            className={`${btn} h-12 w-full bg-cobalt-deep text-base text-white hover:bg-cobalt-ink disabled:cursor-wait disabled:opacity-80`}
          >
            <ShieldCheck size={20} aria-hidden="true" />
            {submitting ? "Activating your policy…" : `Pay ₹${plan.price} & Activate Policy`}
          </button>
        </footer>
      </form>
    </MobileScreen>
  );
}
