import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  ShieldPlus, RotateCcw, User, Check, Map as MapIcon, List, Navigation, Phone, FileText, Download,
  Copy, Wallet, Activity, Zap, Headset, MessageCircle, Info,
} from "lucide-react";
import { useAppState } from "../state";
import { useToast } from "../components/Toast";
import { btn, ring, usePage } from "../components/ui";
import { buildPdf, downloadBlob } from "../pdf";
import {
  HOSPITALS, HOSPITAL_TAGS, PERSONAS, createPolicy, formatDate, getPlan, newPreAuthRef,
} from "../data";

const card = "rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_1px_3px_rgba(10,37,64,0.06)] sm:p-6";
const smallBtn = `${btn} h-11 px-4 text-sm`;

function Tag({ id }) {
  const t = HOSPITAL_TAGS[id];
  return <span className={`rounded-lg border px-2 py-1 text-xs font-bold ${t.cls}`}>{t.label}</span>;
}

function HospitalRadar({ selected, setSelected }) {
  const toast = useToast();
  const [view, setView] = useState("map");
  const h = HOSPITALS[selected];
  const seg = (on) => `${btn} h-10 rounded-lg px-4 text-sm ${on ? "bg-white text-navy shadow" : "text-ink-muted"}`;

  return (
    <section aria-labelledby="radar-title" className={`${card} flex flex-col gap-4`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h2 id="radar-title" className="text-lg font-extrabold">Hospital Network Radar</h2>
          <p className="text-[13px] text-ink-muted">3 cashless hospitals within 5 km of you</p>
        </div>
        <div role="group" aria-label="View as" className="flex gap-1 rounded-xl border border-[#E2E8F0] bg-slate-100 p-1">
          <button type="button" aria-pressed={view === "map"} onClick={() => setView("map")} className={seg(view === "map")}>
            <MapIcon size={16} aria-hidden="true" /> Map
          </button>
          <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")} className={seg(view === "list")}>
            <List size={16} aria-hidden="true" /> List
          </button>
        </div>
      </div>

      {view === "map" ? (
        <>
          <div className="relative h-60 overflow-hidden rounded-xl border border-[#E2E8F0] bg-[#EEF2F6]">
            <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 800 240" preserveAspectRatio="xMidYMid slice">
              <rect x="470" y="20" width="150" height="80" rx="10" fill="#DCEFE3" />
              <rect x="120" y="150" width="110" height="70" rx="10" fill="#DCEFE3" />
              <path d="M0 200 C 160 170, 260 230, 420 190 S 700 150, 800 180" fill="none" stroke="#CFE3F5" strokeWidth="22" />
              <path d="M0 60 H800 M0 130 H800 M150 0 V240 M300 0 V240 M450 0 V240 M650 0 V240" fill="none" stroke="#fff" strokeWidth="10" />
              <path d="M0 20 L800 230" fill="none" stroke="#fff" strokeWidth="14" />
            </svg>
            <div aria-hidden="true" className="absolute left-1/2 top-1/2 -ml-[100px] -mt-[100px] h-[200px] w-[200px] rounded-full border-2 border-dashed border-cobalt bg-cobalt/5" />
            <span aria-hidden="true" className="absolute left-1/2 top-1/2 -ml-[18px] mt-[72px] rounded-md bg-white px-1.5 py-0.5 text-[11px] font-bold text-cobalt-ink">5 km</span>
            <span aria-hidden="true" className="absolute left-1/2 top-1/2 -ml-2 -mt-2 h-4 w-4 rounded-full border-[3px] border-white bg-cobalt shadow-[0_0_0_6px_rgba(0,102,245,0.2)]" />
            {HOSPITALS.map((p, i) => (
              <button
                key={p.name}
                type="button"
                aria-label={`${i + 1}: ${p.name}, ${p.distance}`}
                aria-pressed={selected === i}
                onClick={() => setSelected(i)}
                style={{ left: `calc(50% + ${p.dx}px)`, top: `calc(50% + ${p.dy}px)` }}
                className={`absolute -ml-[22px] -mt-[22px] flex h-11 w-11 items-center justify-center rounded-full ${ring}`}
              >
                <span className={`flex h-8 w-8 -rotate-45 items-center justify-center rounded-[50%_50%_50%_4px] border-2 border-white shadow-md transition-colors ${selected === i ? "bg-cobalt" : "bg-navy"}`}>
                  <span className="rotate-45 text-[13px] font-extrabold text-white">{i + 1}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3 rounded-xl border-2 border-cobalt bg-cobalt-wash p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <span data-testid="selected-hospital" className="text-base font-extrabold">{h.name}</span>
                <span className="text-[13px] text-ink-muted">{h.distance} away · {h.area}</span>
              </div>
              <span className="shrink-0 text-[13px] font-extrabold text-cobalt-ink">{selected + 1} of 3</span>
            </div>
            <div className="flex flex-wrap gap-2">{h.tags.map((t) => <Tag key={t} id={t} />)}</div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => toast(`Prototype: this would open directions to ${h.name}.`)} className={`${smallBtn} bg-navy text-white`}>
                <Navigation size={16} aria-hidden="true" /> Directions
              </button>
              <button type="button" onClick={() => toast(`Prototype: this would call the ${h.name} ER desk.`)} className={`${smallBtn} border border-slate-400 bg-white text-navy`}>
                <Phone size={16} aria-hidden="true" /> Call ER desk
              </button>
            </div>
          </div>
        </>
      ) : (
        <ul className="flex flex-col gap-2">
          {HOSPITALS.map((p, i) => {
            const on = selected === i;
            return (
              <li key={p.name}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSelected(i)}
                  className={`flex w-full items-start gap-4 rounded-xl p-4 text-left ${ring} ${on ? "border-2 border-cobalt bg-cobalt-wash" : "border border-[#E2E8F0] bg-white hover:bg-slate-50"}`}
                >
                  <span aria-hidden="true" className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-extrabold text-white ${on ? "bg-cobalt" : "bg-navy"}`}>{i + 1}</span>
                  <span className="flex min-w-0 flex-1 flex-col gap-2">
                    <span className="flex justify-between gap-2">
                      <span className="text-[15px] font-extrabold">{p.name}</span>
                      <span className="shrink-0 text-[13px] font-bold text-ink-muted">{p.distance}</span>
                    </span>
                    <span className="flex flex-wrap gap-2">{p.tags.map((t) => <Tag key={t} id={t} />)}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function PolicyDocument({ policy, plan, personaLabel }) {
  const [copied, setCopied] = useState(false);
  const summary = `${plan.name} health policy ${policy.number} (${personaLabel}), valid ${formatDate(policy.start)} to ${formatDate(policy.end)}. Member ID ${policy.memberId}. Sum insured ${plan.sumInsuredLong}.`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
    } catch {
      /* clipboard blocked: still confirm so the flow can be tested */
    }
    setCopied(true);
  };

  const download = () => {
    const rs = (s) => s.replace(/₹/g, "Rs. ");
    const blob = buildPdf([
      { text: "CarePlus Health", size: 20, bold: true, gap: 4 },
      { text: "Policy Schedule (prototype document, not a real policy)", size: 10, gap: 24 },
      { text: `Plan: ${plan.name}`, bold: true },
      `Policy number: ${policy.number}`,
      `Member ID: ${policy.memberId}`,
      `Covered: ${personaLabel}`,
      `Valid from: ${formatDate(policy.start)}`,
      `Valid till: ${formatDate(policy.end)}`,
      rs(`Sum insured: ${plan.sumInsuredLong}`),
      { text: rs(`Premium: ₹${plan.price} per month`), gap: 24 },
      { text: "Generated by the CarePlus clickable prototype.", size: 9 },
    ]);
    downloadBlob(blob, `CarePlus-${policy.number}.pdf`);
  };

  return (
    <section aria-labelledby="doc-title" className={`${card} flex flex-col gap-4`}>
      <div className="flex items-start gap-4">
        <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cobalt-tint text-cobalt-ink"><FileText size={24} /></span>
        <div className="flex flex-col gap-1">
          <h2 id="doc-title" className="text-lg font-extrabold">Policy Document</h2>
          <p className="text-[13px] leading-normal text-ink-muted">Schedule and benefit summary for {policy.number} · Issued {formatDate(policy.start)}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={download} className={`${smallBtn} bg-cobalt-deep text-white hover:bg-cobalt-ink`}>
          <Download size={18} aria-hidden="true" /> Download PDF
        </button>
        <button type="button" onClick={copy} className={`${smallBtn} border border-slate-400 bg-white text-navy`}>
          <Copy size={18} aria-hidden="true" /> {copied ? "Copied" : "Copy for WhatsApp"}
        </button>
      </div>
      <p aria-live="polite" className="min-h-5 text-[13px] font-semibold text-safe-ink">
        {copied && "Policy summary copied. Paste it into any WhatsApp chat."}
      </p>
    </section>
  );
}

function CashlessCard({ policy, plan }) {
  const toast = useToast();
  return (
    <section aria-labelledby="card-title" className={`${card} flex flex-col gap-4`}>
      <h2 id="card-title" className="text-lg font-extrabold">Digital Cashless Card</h2>
      <div className="relative flex flex-col gap-5 overflow-hidden rounded-2xl bg-navy p-5 text-white shadow-[0_12px_24px_rgba(10,37,64,0.25)]">
        <div aria-hidden="true" className="absolute -right-[60px] -top-[60px] h-[200px] w-[200px] rounded-full border-[28px] border-white/5" />
        <div aria-hidden="true" className="absolute inset-x-0 top-0 h-1.5 bg-cobalt" />
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="text-base font-extrabold">CarePlus</span>
            <span className="text-xs text-[#C7D2E0]">Cashless Health Card</span>
          </div>
          <span className="rounded-lg bg-safe-mint px-2 py-1 text-[11px] font-extrabold uppercase tracking-wide text-safe-ink">Active</span>
        </div>
        <div className="flex items-end justify-between gap-4">
          <dl className="flex flex-col gap-3">
            <div className="flex flex-col gap-0.5">
              <dt className="text-[11px] uppercase tracking-wide text-[#C7D2E0]">Member ID</dt>
              <dd data-testid="member-id" className="text-lg font-extrabold tracking-wide tabular-nums">{policy.memberId}</dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-[11px] uppercase tracking-wide text-[#C7D2E0]">Plan · Valid till</dt>
              <dd className="text-[13px] font-bold">{plan.name.replace("CarePlus ", "")} {plan.sumInsured.split(" ")[0]} · {formatDate(policy.end)}</dd>
            </div>
          </dl>
          <div className="h-[104px] w-[104px] shrink-0 rounded-xl bg-white p-2">
            <QRCodeSVG
              value={`CAREPLUS|${policy.memberId}|${policy.number}`}
              size={88}
              fgColor="#0A2540"
              role="img"
              aria-label="Member QR code for hospital insurance desks"
              title="Member QR code"
            />
          </div>
        </div>
      </div>
      {/* Production: replace with Apple's and Google's official "Add to Wallet" badges. */}
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => toast("Prototype: this would add your card to Apple Wallet.")} className={`${btn} h-12 bg-[#0A0A0A] text-sm text-white`}>
          <Wallet size={18} aria-hidden="true" /> Apple Wallet
        </button>
        <button type="button" onClick={() => toast("Prototype: this would add your card to Google Wallet.")} className={`${btn} h-12 border border-navy bg-white text-sm text-navy`}>
          <Wallet size={18} aria-hidden="true" /> Google Wallet
        </button>
      </div>
    </section>
  );
}

function EmergencyDesk({ hospital, memberId }) {
  const [step, setStep] = useState("idle"); // idle | confirm | sent
  const [ref, setRef] = useState("");

  const send = () => {
    setRef(newPreAuthRef());
    setStep("sent");
  };

  return (
    <section aria-labelledby="sos-title" className="flex flex-col gap-4 rounded-2xl border-2 border-danger-strong bg-[#FFF5F5] p-4 shadow-[0_1px_3px_rgba(10,37,64,0.06)] sm:p-6">
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-danger-strong text-white"><Activity size={22} /></span>
        <div className="flex flex-col gap-1">
          <h2 id="sos-title" className="text-lg font-extrabold text-danger-ink">One-Tap Emergency Adjudication</h2>
          <p className="text-[13px] leading-normal text-danger-ink">Sudden admission? Start cashless pre-authorisation now and we alert the hospital’s insurance desk.</p>
        </div>
      </div>

      {step === "idle" && (
        <>
          <p className="text-[13px]"><strong>Hospital:</strong> {hospital.name} · {hospital.distance}</p>
          <button type="button" onClick={() => setStep("confirm")} className={`${btn} h-14 bg-danger-strong text-lg font-extrabold text-white shadow-[0_4px_12px_rgba(153,27,27,0.3)] hover:bg-danger-ink`}>
            <Zap size={20} aria-hidden="true" /> Start Emergency Pre-Auth
          </button>
        </>
      )}

      {step === "confirm" && (
        <div role="alertdialog" aria-labelledby="sos-confirm" className="flex flex-col gap-3 rounded-xl border border-red-300 bg-white p-4">
          <p id="sos-confirm" className="text-sm leading-normal">
            Send a cashless request for <strong>{hospital.name}</strong> using member ID {memberId}?
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" autoFocus onClick={() => setStep("idle")} className={`${btn} h-12 border border-slate-400 bg-white text-[15px]`}>Cancel</button>
            <button type="button" onClick={send} className={`${btn} h-12 bg-danger-strong text-[15px] font-extrabold text-white`}>Yes, send now</button>
          </div>
        </div>
      )}

      {step === "sent" && (
        <div role="status" className="flex flex-col gap-2 rounded-xl border border-emerald-300 bg-safe-tint p-4 text-safe-ink">
          <strong className="text-[15px]">Request sent to {hospital.name}</strong>
          <span className="text-[13px] leading-normal">
            Reference <strong data-testid="preauth-ref">{ref}</strong>. Show your cashless card at admission. Our concierge will call your registered number with updates.
          </span>
          <button type="button" onClick={() => setStep("idle")} className={`${smallBtn} self-start border border-safe-strong bg-white text-safe-ink`}>Done</button>
        </div>
      )}
    </section>
  );
}

function Concierge() {
  const toast = useToast();
  return (
    <section aria-labelledby="concierge-title" className={`${card} flex flex-col gap-4`}>
      <div className="flex items-start gap-3">
        <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cobalt-tint text-cobalt-ink"><Headset size={22} /></span>
        <div className="flex flex-col gap-1">
          <h2 id="concierge-title" className="text-lg font-extrabold">Your Claim Concierge</h2>
          <p className="text-[13px] leading-normal text-ink-muted">A real person for admissions, paperwork and claim follow-ups. Available 24×7.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={() => toast("Prototype: this would open a WhatsApp chat with your concierge.")} className={`${btn} h-12 bg-safe-strong text-[15px] text-white hover:bg-safe-ink`}>
          <MessageCircle size={18} aria-hidden="true" /> WhatsApp
        </button>
        <button type="button" onClick={() => toast("Prototype: this would call the 24×7 concierge helpline.")} className={`${btn} h-12 border border-navy bg-white text-[15px] text-navy`}>
          <Phone size={18} aria-hidden="true" /> Call
        </button>
      </div>
    </section>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const headingRef = usePage("Command Center");
  const { policy: savedPolicy, reset } = useAppState();
  const [selected, setSelected] = useState(0);

  // Opened directly without buying? Show a sample policy so the screen is still testable.
  const samplePolicy = useMemo(() => createPolicy("ultra", "me"), []);
  const isSample = !savedPolicy;
  const policy = savedPolicy ?? samplePolicy;
  const plan = getPlan(policy.planId);
  const personaLabel = PERSONAS.find((p) => p.id === policy.persona)?.label ?? "Just Me";

  const restart = () => {
    reset();
    navigate("/");
  };

  return (
    <div className="min-h-dvh bg-[#F8FAFC]">
      <header className="flex items-center justify-between gap-4 border-b border-[#E2E8F0] bg-white px-4 py-3 md:px-8">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy text-white"><ShieldPlus size={22} /></span>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight">CarePlus Health</span>
            <span className="text-xs text-ink-muted">Command Center</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={restart} className={`${smallBtn} border border-[#E2E8F0] bg-white text-navy`}>
            <RotateCcw size={18} aria-hidden="true" /> <span className="hidden sm:inline">Restart demo</span><span className="sr-only sm:hidden">Restart demo</span>
          </button>
          <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-cobalt-tint text-cobalt-ink">
            <User size={20} />
          </span>
        </div>
      </header>

      {isSample && (
        <div className="mx-auto mt-4 flex max-w-[1280px] items-start gap-3 px-4 md:px-8">
          <p className="flex flex-1 items-start gap-3 rounded-2xl border border-[#BFD6FF] bg-cobalt-wash p-4 text-sm leading-normal">
            <Info size={18} className="mt-0.5 shrink-0 text-cobalt-ink" aria-hidden="true" />
            <span>
              You’re looking at a sample policy.{" "}
              <button type="button" onClick={() => navigate("/")} className={`rounded font-bold text-cobalt-deep underline underline-offset-2 ${ring}`}>
                Start from the simulator
              </button>{" "}
              to buy one and see your own details here.
            </span>
          </p>
        </div>
      )}

      <main className="mx-auto grid max-w-[1280px] grid-cols-1 items-start gap-4 p-4 md:grid-cols-5 md:gap-6 md:p-8">
        <div className="flex min-w-0 flex-col gap-4 md:col-span-3 md:gap-6">
          <section aria-labelledby="active-title" className={`${card} flex flex-col gap-6`}>
            <div className="flex items-start gap-4">
              <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-emerald-300 bg-safe-tint text-safe"><Check size={26} /></span>
              <div className="flex flex-col gap-1">
                <h1 id="active-title" ref={headingRef} tabIndex={-1} className="text-2xl font-extrabold leading-tight tracking-tight outline-none">Your Policy is Active</h1>
                <p className="text-sm leading-normal text-ink-muted">{plan.name} is protecting you ({personaLabel}) from today. Cashless treatment works at any network hospital.</p>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-4">
              {[
                ["Policy number", policy.number, "policy-number"],
                ["Valid from", formatDate(policy.start)],
                ["Valid till", formatDate(policy.end)],
                ["Sum insured", plan.sumInsured],
              ].map(([k, v, testId]) => (
                <div key={k} className="flex flex-col gap-1 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
                  <dt className="text-xs text-ink-muted">{k}</dt>
                  <dd data-testid={testId} className="whitespace-nowrap text-sm font-bold tabular-nums sm:text-[15px]">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <HospitalRadar selected={selected} setSelected={setSelected} />
          <PolicyDocument policy={policy} plan={plan} personaLabel={personaLabel} />
        </div>

        <aside aria-label="Emergency desk" className="flex min-w-0 flex-col gap-4 md:sticky md:top-6 md:col-span-2 md:gap-6">
          <CashlessCard policy={policy} plan={plan} />
          <EmergencyDesk hospital={HOSPITALS[selected]} memberId={policy.memberId} />
          <Concierge />
        </aside>
      </main>
    </div>
  );
}
