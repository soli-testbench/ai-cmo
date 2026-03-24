import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { path: '/dashboard', label: 'Command Center' },
  { path: '/projects/new', label: 'New Project' },
  { path: '/opportunities', label: 'Opportunities' },
];

export function Layout({ children }: LayoutProps): React.ReactElement {
  const location = useLocation();

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-brand">
          <h1>Chief MOG Officer</h1>
        </div>
        <nav className="header-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="app-main">{children}</main>
      <footer className="app-footer">
        <p>Chief MOG Officer v0.1.0</p>
      </footer>
    </div>
  );
}
