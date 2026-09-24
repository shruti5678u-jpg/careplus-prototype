import { describe, it, expect, vi } from "vitest";
import { render, screen, within, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AppStateProvider } from "../state";
import { ToastProvider } from "../components/Toast";
import { AppRoutes } from "../App";
import { consumablesFor, futureCost, inr } from "../data";
import { buildPdf } from "../pdf";

function renderAt(path = "/", initialState) {
  const user = userEvent.setup();
  render(
    <AppStateProvider initialState={initialState}>
      <ToastProvider>
        <MemoryRouter initialEntries={[path]}>
          <AppRoutes />
        </MemoryRouter>
      </ToastProvider>
    </AppStateProvider>
  );
  return { user };
}

describe("helpers", () => {
  it("formats rupees in the Indian system", () => {
    expect(inr(250000)).toBe("₹2,50,000");
    expect(inr(1000000)).toBe("₹10,00,000");
  });
  it("prices consumables at ₹2,400 on the default bill", () => {
    expect(consumablesFor(250000)).toBe(2400);
  });
  it("projects 14% medical inflation over 5 years", () => {
    expect(futureCost(250000)).toBe(481000);
  });
  it("builds a valid-looking PDF", async () => {
    const blob = buildPdf(["Hello"]);
    expect(blob.type).toBe("application/pdf");
    const text = await blob.text();
    expect(text.startsWith("%PDF-1.4")).toBe(true);
    expect(text).toContain("%%EOF");
  });
});

describe("Step 1 · Risk & Bill Simulator", () => {
  it("updates both comparison boxes when the slider moves", () => {
    renderAt("/");
    expect(screen.getByTestId("uninsured-pay")).toHaveTextContent("₹2,50,000");
    expect(screen.getByTestId("insured-pay")).toHaveTextContent("₹2,400");

    fireEvent.change(screen.getByLabelText("Estimated hospital bill"), { target: { value: "500000" } });
    expect(screen.getByTestId("uninsured-pay")).toHaveTextContent("₹5,00,000");
    expect(screen.getByTestId("insured-pay")).toHaveTextContent("₹4,800");
  });

  it("applies a preset and marks it pressed", async () => {
    const { user } = renderAt("/");
    const preset = screen.getByRole("button", { name: "₹10L" });
    await user.click(preset);
    expect(preset).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByTestId("bill-amount")).toHaveTextContent("₹10,00,000");
  });

  it("switches persona and continues to plan comparison", async () => {
    const { user } = renderAt("/");
    await user.click(screen.getByRole("button", { name: "Family" }));
    expect(screen.getByText(/2 adults and your children/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Calculate My Tailored Plan/ }));
    expect(screen.getByRole("heading", { name: /Compare plans/ })).toBeInTheDocument();
    expect(screen.getByText("Family")).toBeInTheDocument();
  });
});

describe("Step 2 · Plan comparison", () => {
  it("defaults to CarePlus Ultra and updates the bottom bar on selection", async () => {
    const { user } = renderAt("/plans");
    expect(screen.getByTestId("selected-plan")).toHaveTextContent("CarePlus Ultra");
    await user.click(screen.getByRole("radio", { name: /Standard Shield/ }));
    expect(screen.getByTestId("selected-plan")).toHaveTextContent("Standard Shield");
    expect(screen.getByTestId("selected-price")).toHaveTextContent("₹499");
  });

  it("filters to zero-copay plans and shows the parent-cover empty state", async () => {
    const { user } = renderAt("/plans");
    await user.click(screen.getByRole("button", { name: "Zero Copay" }));
    expect(screen.getAllByRole("radio")).toHaveLength(1);
    await user.click(screen.getByRole("button", { name: "Parent Cover" }));
    expect(screen.getByText(/No plans here include parent cover/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Show all plans" }));
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("opens and closes the room-rent explanation", async () => {
    const { user } = renderAt("/plans");
    await user.click(screen.getByRole("button", { name: /Room Rent:/ }));
    const dialog = screen.getByRole("dialog", { name: /proportional billing/ });
    expect(within(dialog).getByText(/you pay ₹1,00,000 yourself/)).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Close explanation" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("Step 3 · Medical declaration", () => {
  it("blocks submission until every question and the consent are answered", async () => {
    const { user } = renderAt("/declaration");
    await user.click(screen.getByRole("button", { name: /Activate Policy/ }));
    expect(screen.getByRole("alert")).toHaveTextContent("5 answers need attention");
  });

  it("asks for details when any answer is Yes", async () => {
    const { user } = renderAt("/declaration");
    const q1 = screen.getByRole("group", { name: /medicines every day/ });
    await user.click(within(q1).getByLabelText("Yes"));
    expect(screen.getByLabelText(/Tell us more/)).toBeInTheDocument();
  });

  it("activates the policy and lands on the dashboard", async () => {
    const { user } = renderAt("/declaration", { planId: "standard", persona: "spouse" });
    for (const group of screen.getAllByRole("group")) {
      await user.click(within(group).getByLabelText("No"));
    }
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /Pay ₹499 & Activate Policy/ }));
    expect(await screen.findByRole("heading", { name: "Your Policy is Active" }, { timeout: 3000 })).toBeInTheDocument();
    expect(screen.getByTestId("policy-number").textContent).toMatch(/^CP-\d{4}-\d{5}$/);
    expect(screen.getByText(/Standard Shield is protecting you \(Me \+ Spouse\)/)).toBeInTheDocument();
    expect(screen.queryByText(/sample policy/)).not.toBeInTheDocument();
  });
});

describe("Dashboard · Command Center", () => {
  it("shows a sample policy when opened directly", () => {
    renderAt("/dashboard");
    expect(screen.getByText(/looking at a sample policy/)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Member QR code/ })).toBeInTheDocument();
  });

  it("lets you pick a hospital on the map and in the list", async () => {
    const { user } = renderAt("/dashboard");
    await user.click(screen.getByRole("button", { name: /^2: Riverside/ }));
    expect(screen.getByTestId("selected-hospital")).toHaveTextContent("Riverside Care Institute");
    await user.click(screen.getByRole("button", { name: "List" }));
    await user.click(screen.getByRole("button", { name: /Lakeview Heart/ }));
    await user.click(screen.getByRole("button", { name: "Map" }));
    expect(screen.getByTestId("selected-hospital")).toHaveTextContent("Lakeview Heart & Trauma Centre");
  });

  it("runs the emergency pre-auth flow for the selected hospital", async () => {
    const { user } = renderAt("/dashboard");
    await user.click(screen.getByRole("button", { name: /Start Emergency Pre-Auth/ }));
    const confirm = screen.getByRole("alertdialog");
    expect(within(confirm).getByText("Northgate Multispeciality Hospital")).toBeInTheDocument();
    await user.click(within(confirm).getByRole("button", { name: "Yes, send now" }));
    expect(screen.getByTestId("preauth-ref").textContent).toMatch(/^PA-\d{6}$/);
  });

  it("copies the policy summary and downloads the PDF", async () => {
    const { user } = renderAt("/dashboard");
    const createUrl = vi.fn(() => "blob:mock");
    URL.createObjectURL = createUrl;
    URL.revokeObjectURL = vi.fn();
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    await user.click(screen.getByRole("button", { name: /Copy for WhatsApp/ }));
    expect(screen.getByText(/Policy summary copied/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Download PDF/ }));
    expect(createUrl).toHaveBeenCalledOnce();
    expect(click).toHaveBeenCalledOnce();
  });

  it("shows a prototype notice for actions that would leave the app", async () => {
    const { user } = renderAt("/dashboard");
    await user.click(screen.getByRole("button", { name: "WhatsApp" }));
    expect(screen.getByText(/would open a WhatsApp chat/)).toBeInTheDocument();
  });

  it("restarts the demo", async () => {
    const { user } = renderAt("/dashboard", { bill: 1000000 });
    await user.click(screen.getByRole("button", { name: /Restart demo/ }));
    expect(screen.getByTestId("bill-amount")).toHaveTextContent("₹2,50,000");
  });
});
