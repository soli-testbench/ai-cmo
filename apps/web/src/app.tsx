import { BrowserRouter, Route, Routes } from "react-router-dom";
import { RootLayout } from "@/components/layout/root-layout";
import { CommandCenter } from "@/pages/command-center";
import { Opportunities } from "@/pages/opportunities";
import { ProjectCreate } from "@/pages/project-create";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<CommandCenter />} />
          <Route path="/projects" element={<CommandCenter />} />
          <Route path="/projects/new" element={<ProjectCreate />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/agents" element={<PlaceholderPage title="Agents" />} />
          <Route path="/settings" element={<PlaceholderPage title="Settings" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-xl font-display font-semibold text-text-primary mb-2">
        {title}
      </h1>
      <p className="text-sm text-text-secondary">This page is coming soon.</p>
    </div>
  );
}
