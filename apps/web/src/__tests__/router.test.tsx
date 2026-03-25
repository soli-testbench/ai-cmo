import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { RootLayout } from "../components/layout/root-layout";
import { CommandCenter } from "../pages/command-center";
import { Opportunities } from "../pages/opportunities";
import { ProjectCreate } from "../pages/project-create";

function renderApp(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<CommandCenter />} />
          <Route path="/projects/new" element={<ProjectCreate />} />
          <Route path="/opportunities" element={<Opportunities />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("Router", () => {
  it("renders Command Center at /", () => {
    renderApp("/");
    expect(screen.getByRole("heading", { name: "Command Center" })).toBeInTheDocument();
  });

  it("renders Project Creation at /projects/new", () => {
    renderApp("/projects/new");
    expect(screen.getByRole("heading", { name: "New Project" })).toBeInTheDocument();
  });

  it("renders Opportunities at /opportunities", () => {
    renderApp("/opportunities");
    expect(screen.getByRole("heading", { name: "Opportunities" })).toBeInTheDocument();
  });

  it("renders sidebar navigation on all pages", () => {
    renderApp("/");
    expect(screen.getByText("CHIEF MOG OFFICER")).toBeInTheDocument();
    expect(screen.getByText("Chief MOG Officer v0.1.0")).toBeInTheDocument();
  });
});
