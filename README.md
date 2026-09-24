# CarePlus Health: clickable prototype

A working front-end prototype of a health-insurance journey, from "why do I need cover?" to "I'm in hospital, help me now". It's built for usability testing and portfolio review.

**Stack:** React 19 · Vite · Tailwind CSS 3 · React Router (hash routing) · lucide-react icons · Vitest + Testing Library

> ⚠️ Prototype only. All plans, prices, hospitals and policy numbers are **mock data**. No payment is taken, no data leaves the browser, and nothing here is insurance advice.

## The flow

| Route | Screen | What works |
|---|---|---|
| `#/` | **Step 1: Risk & Bill Simulator** | Slider and presets (₹50K–₹10L) update the uninsured vs. insured amounts. Shows 5-year cost at 14% medical inflation. Persona pills (Just Me / Me + Spouse / Family). |
| `#/plans` | **Step 2: Plan Comparison** | Standard Shield vs. CarePlus Ultra. Filter chips, plan selection, plain-English rows. Each term opens an explanation sheet (focus-trapped, Esc to close), including a worked proportional-billing example. Floating price bar. |
| `#/declaration` | **Step 3: Medical Declaration** | Yes/No health questions, a details box when anything is "Yes", consent, and an error summary. "Pay & Activate" creates a mock policy. |
| `#/dashboard` | **Command Center & Emergency Desk** | 60/40 layout on screens ≥768px, single column on phones. Policy status, hospital radar (map/list), a real downloadable PDF, copy-for-WhatsApp, a cashless card with a real QR code, one-tap emergency pre-auth (confirm → reference number), and a concierge. |

Your progress (bill, persona, plan, policy) is saved in `localStorage`, so a refresh keeps your place. **Restart demo** on the dashboard clears it. Opening `#/dashboard` directly shows a sample policy.

## Run it locally

Needs **Node 20+** (22 recommended).

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 19 interaction tests (Vitest + Testing Library)
npm run build      # production build in dist/
npm run preview    # serve the build
```

## Put it on GitHub (and get a live link)

```bash
git init
git add .
git commit -m "CarePlus prototype"
git branch -M main
git remote add origin https://github.com/<your-username>/careplus-prototype.git
git push -u origin main
```

Then on GitHub go to **Settings → Pages → Build and deployment → Source: GitHub Actions**. On every push to `main`, the included workflow (`.github/workflows/deploy.yml`) runs the tests, builds, and publishes to:

```
https://<your-username>.github.io/careplus-prototype/
```

Pull requests run the tests but don't deploy. The app uses hash routes and a relative base path, so it works from any sub-folder with no extra config.

## Accessibility notes

- Contrast targets **WCAG AAA** (7:1) for normal text. Brand colours that fall short (Cobalt `#0066F5`, Red `#B91C1C`, Emerald `#047857`) are used only for large text (≥18.66px bold) or non-text UI. Smaller text uses darker shades from the same families.
- Touch targets are at least 44×44px. Every control is a real `<button>`, `<a>`, `<input>` or `<label>`.
- Focus moves to each page's heading on navigation. The explanation sheet traps focus, closes on Esc, and returns focus when closed.
- Selected states use `aria-pressed` / `role="radio"` + `aria-checked`. Live values are announced with `aria-live`.
- Motion is disabled for `prefers-reduced-motion`.

## Project structure

```
src/
  App.jsx              routes + providers
  state.jsx            app state (Context + localStorage)
  data.js              all mock content and helpers (plans, glossary, hospitals, formatting)
  pdf.js               tiny dependency-free PDF writer for "Download PDF"
  components/          UI helpers, bottom sheet, toast
  pages/               Simulator, PlanCompare, Declaration, Dashboard
  test/                Vitest interaction tests
```

To change the content (plans, prices, questions, hospitals), edit `src/data.js`.

## Known prototype limits

- Prices don't change with the persona or add-ons.
- Map, calls, WhatsApp and Wallet buttons show a "prototype" notice instead of opening external apps.
- Use Apple's and Google's official "Add to Wallet" badges before any real release.
