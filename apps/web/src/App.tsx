import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout.js';
import { ErrorBoundary } from './components/ErrorBoundary.js';
import { CommandCenter } from './pages/CommandCenter.js';
import { ProjectCreate } from './pages/ProjectCreate.js';
import { OpportunityList } from './pages/OpportunityList.js';

export function App(): React.ReactElement {
  return (
    <ErrorBoundary>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<CommandCenter />} />
          <Route path="/projects/new" element={<ProjectCreate />} />
          <Route path="/opportunities" element={<OpportunityList />} />
        </Routes>
      </Layout>
    </ErrorBoundary>
  );
}
