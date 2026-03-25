import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { CommandCenter } from "../pages/command-center";
import { Opportunities } from "../pages/opportunities";
import { ProjectCreate } from "../pages/project-create";

function renderWithRouter(ui: React.ReactElement, { route = "/" } = {}) {
  return render(<MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>);
}

describe("CommandCenter", () => {
  it("renders metric cards", () => {
    renderWithRouter(<CommandCenter />);
    expect(screen.getByText("Command Center")).toBeInTheDocument();
    expect(screen.getByText("Opportunities")).toBeInTheDocument();
    expect(screen.getByText("Active Campaigns")).toBeInTheDocument();
    expect(screen.getByText("Agent Runs Today")).toBeInTheDocument();
    expect(screen.getByText("Health Score")).toBeInTheDocument();
  });

  it("renders recent activity section", () => {
    renderWithRouter(<CommandCenter />);
    expect(screen.getByText("Recent Activity")).toBeInTheDocument();
    expect(screen.getByText("SearchMogAgent")).toBeInTheDocument();
  });

  it("renders quick actions", () => {
    renderWithRouter(<CommandCenter />);
    expect(screen.getByText("Quick Actions")).toBeInTheDocument();
    expect(screen.getByText("Create Project")).toBeInTheDocument();
  });
});

describe("ProjectCreate", () => {
  it("renders form fields", () => {
    renderWithRouter(<ProjectCreate />);
    expect(screen.getByText("New Project")).toBeInTheDocument();
    expect(screen.getByLabelText("Project Name *")).toBeInTheDocument();
    expect(screen.getByLabelText("Description *")).toBeInTheDocument();
    expect(screen.getByLabelText("Company Name *")).toBeInTheDocument();
    expect(screen.getByLabelText("Industry *")).toBeInTheDocument();
    expect(screen.getByLabelText("Website URL")).toBeInTheDocument();
    expect(screen.getByLabelText("Keywords")).toBeInTheDocument();
  });

  it("renders submit button", () => {
    renderWithRouter(<ProjectCreate />);
    expect(screen.getByRole("button", { name: "Create Project" })).toBeInTheDocument();
  });
});

describe("Opportunities", () => {
  it("renders table with columns", () => {
    renderWithRouter(<Opportunities />);
    expect(screen.getByText("Opportunities")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Agent")).toBeInTheDocument();
    expect(screen.getByText("Type")).toBeInTheDocument();
    expect(screen.getByText("Score")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
    expect(screen.getByText("Date")).toBeInTheDocument();
  });

  it("renders mock opportunity rows", () => {
    renderWithRouter(<Opportunities />);
    expect(
      screen.getByText("Rising search interest in 'AI workflow automation'"),
    ).toBeInTheDocument();
    expect(screen.getByText("Competitor launched new pricing tier")).toBeInTheDocument();
  });

  it("renders status badges", () => {
    renderWithRouter(<Opportunities />);
    const badges = screen.getAllByText(/^(new|reviewed|acted|dismissed)$/);
    expect(badges.length).toBeGreaterThanOrEqual(4);
  });
});
