// All content in this prototype is mock data. Nothing here is real policy, pricing or hospital information.

export const BILL_MIN = 50000;
export const BILL_MAX = 1000000;
export const BILL_STEP = 10000;
export const BILL_DEFAULT = 250000;
export const MEDICAL_INFLATION = 0.14; // 14% a year in private hospitals (design brief)
export const CONSUMABLES_SHARE = 0.0096; // ≈ ₹2,400 on a ₹2,50,000 bill

export const BILL_PRESETS = [
  { value: 50000, label: "₹50K" },
  { value: 250000, label: "₹2.5L" },
  { value: 500000, label: "₹5L" },
  { value: 1000000, label: "₹10L" },
];

export const PERSONAS = [
  { id: "me", label: "Just Me", note: "Individual cover for 1 adult." },
  { id: "spouse", label: "Me + Spouse", note: "Shared cover for 2 adults." },
  { id: "family", label: "Family", note: "Shared cover for 2 adults and your children." },
];

export const PLANS = [
  {
    id: "standard",
    name: "Standard Shield",
    price: 499,
    zeroCopay: false,
    parentCover: false,
    featured: false,
    sumInsured: "₹10L",
    sumInsuredLong: "₹10 lakh a year",
  },
  {
    id: "ultra",
    name: "CarePlus Ultra",
    price: 840,
    zeroCopay: true,
    parentCover: false,
    featured: true,
    sumInsured: "₹25L + refill",
    sumInsuredLong: "₹25 lakh a year + free refill",
  },
];

export const getPlan = (id) => PLANS.find((p) => p.id === id) ?? PLANS[1];

export const COMPARE_ROWS = [
  { id: "sum", label: "Sum Insured", plain: "Most the plan pays in a year" },
  { id: "room", label: "Room Rent", plain: "Limit on your daily hospital room" },
  { id: "wait", label: "Waiting Period", plain: "Wait before existing illnesses are covered" },
  { id: "copay", label: "Co-pay", plain: "Your share of every claim" },
];

export const COMPARE_CELLS = {
  sum: {
    standard: { value: "₹10L", note: "Up to ₹10 lakh of hospital bills a year" },
    ultra: { value: "₹25L", good: true, note: "+ free annual refill if a claim uses it up" },
  },
  room: {
    standard: { value: "1% per day", warn: true, note: "Max ₹10,000/day. A pricier room cuts your whole claim" },
    ultra: { value: "No Cap", good: true, note: "Any room. No cuts to your claim" },
  },
  wait: {
    standard: { value: "36 months", note: "Existing illnesses covered after 3 years" },
    ultra: { value: "12 months", good: true, note: "Existing illnesses covered after 1 year" },
  },
  copay: {
    standard: { value: "10%", note: "You pay ₹10 of every ₹100 claimed" },
    ultra: { value: "0%", good: true, note: "Insurer pays the full approved claim" },
  },
};

export const GLOSSARY = {
  sum: {
    title: "Sum Insured, in plain English",
    points: [
      "This is the most the insurer will pay for your hospital bills in one policy year.",
      "A free annual refill tops your cover back up once if a big claim uses it up, so a second hospital stay that year is still covered.",
    ],
    a: "₹10 lakh a year, no refill.",
    b: "₹25 lakh a year, plus one free refill.",
  },
  room: {
    title: "Room Rent limits & proportional billing",
    points: [
      "Some plans cap the room rent they pay each day. On Standard Shield the cap is 1% of your sum insured: ₹10,000 a day on ₹10 lakh.",
      "If you choose a costlier room, the insurer doesn’t just skip the extra rent. It cuts your other room-linked charges (doctor visits, nursing, surgery fees) by the same ratio. This is called proportional billing.",
    ],
    steps: [
      "Room allowed: ₹10,000 a day",
      "Room you choose: ₹15,000 a day",
      "Insurer pays 10,000 ÷ 15,000 = two-thirds of room-linked charges",
    ],
    result: "On ₹3,00,000 of room-linked charges, you pay ₹1,00,000 yourself.",
    a: "Room cap applies, so proportional billing can cut your claim.",
    b: "No room cap. Pick any room and nothing is cut.",
  },
  wait: {
    title: "Waiting Period, in plain English",
    points: [
      "Illnesses you already have when you buy the plan, like diabetes or high blood pressure, are covered only after this waiting time.",
      "A shorter waiting period means you are protected for those conditions sooner.",
    ],
    a: "Covered after 36 months (3 years).",
    b: "Covered after 12 months (1 year).",
  },
  copay: {
    title: "Co-pay, in plain English",
    points: ["Co-pay is a fixed share of every approved claim that you pay yourself, however big the bill."],
    steps: ["Approved hospital claim: ₹2,00,000", "Co-pay on Standard Shield: 10%"],
    result: "You pay ₹20,000. With 0% co-pay you pay ₹0 of the approved amount.",
    a: "You pay 10% of every claim.",
    b: "You pay 0%. The insurer pays the full approved claim.",
  },
};

export const DECLARATION_QUESTIONS = [
  {
    id: "medicines",
    text: "Does anyone being covered take medicines every day for an ongoing illness?",
    hint: "For example diabetes, blood pressure or thyroid.",
  },
  {
    id: "admitted",
    text: "Has anyone been admitted to a hospital in the last 4 years?",
    hint: "Include day-care procedures. Leave out childbirth.",
  },
  {
    id: "surgery",
    text: "Has a doctor advised anyone to have a surgery or procedure that hasn’t happened yet?",
  },
  {
    id: "tobacco",
    text: "Does anyone smoke or use tobacco in any form?",
  },
];

export const HOSPITAL_TAGS = {
  cashless: { label: "Cashless Pre-Approved", cls: "bg-safe-tint text-safe-ink border-emerald-300" },
  er: { label: "ER Open", cls: "bg-danger-tint text-danger-ink border-red-300" },
  cardiac: { label: "Cardiac Care", cls: "bg-cobalt-tint text-cobalt-ink border-[#BFD6FF]" },
  icu: { label: "ICU Beds", cls: "bg-cobalt-tint text-cobalt-ink border-[#BFD6FF]" },
};

// dx/dy = pin offset in px from "you" on the mock map (≈ 20px per km).
export const HOSPITALS = [
  { name: "Northgate Multispeciality Hospital", distance: "1.2 km", area: "Sector 18", dx: 28, dy: -12, tags: ["cashless", "er", "icu"] },
  { name: "Riverside Care Institute", distance: "2.8 km", area: "Sector 27", dx: -44, dy: 34, tags: ["cashless", "er"] },
  { name: "Lakeview Heart & Trauma Centre", distance: "4.6 km", area: "Sector 50", dx: 74, dy: 55, tags: ["cashless", "er", "cardiac"] },
];

/* ---------- helpers ---------- */

export const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

export const consumablesFor = (bill) => Math.round((bill * CONSUMABLES_SHARE) / 100) * 100;

export const futureCost = (bill, years = 5) =>
  Math.round((bill * Math.pow(1 + MEDICAL_INFLATION, years)) / 1000) * 1000;

export const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const rand = (digits) =>
  String(Math.floor(Math.random() * 10 ** digits)).padStart(digits, "0");

export function createPolicy(planId, persona) {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setFullYear(end.getFullYear() + 1);
  end.setDate(end.getDate() - 1);
  return {
    number: `CP-${start.getFullYear()}-${rand(5)}`,
    memberId: `CPU-${rand(4)}-${rand(3)}`,
    planId,
    persona,
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

export const newPreAuthRef = () => `PA-${rand(6)}`;
