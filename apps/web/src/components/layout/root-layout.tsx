import { Outlet } from "react-router-dom";
import { Sidebar } from "./sidebar";

export function RootLayout() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Sidebar />
      <main className="ml-60 p-6">
        <Outlet />
      </main>
    </div>
  );
}
