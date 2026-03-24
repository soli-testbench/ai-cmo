import React, { useEffect, useState } from 'react';
import type { Project, Opportunity } from '@ai-cmo/types';
import { Card } from '@ai-cmo/ui';
import { Link } from 'react-router-dom';

export function CommandCenter(): React.ReactElement {
  const [projects, setProjects] = useState<Project[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, oppRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/analysis/opportunities'),
        ]);
        const projData = await projRes.json();
        const oppData = await oppRes.json();
        setProjects(projData.data ?? []);
        setOpportunities(oppData.data ?? []);
      } catch {
        console.error('Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    }
    void fetchData();
  }, []);

  if (loading) {
    return <div className="page-loading">Loading...</div>;
  }

  return (
    <div className="page command-center">
      <h2>Command Center</h2>

      <section className="dashboard-stats">
        <Card title="Projects">
          <p className="stat-number">{projects.length}</p>
        </Card>
        <Card title="Opportunities">
          <p className="stat-number">{opportunities.length}</p>
        </Card>
        <Card title="New Opportunities">
          <p className="stat-number">
            {opportunities.filter((o) => o.status === 'new').length}
          </p>
        </Card>
      </section>

      <section className="dashboard-projects">
        <h3>Projects</h3>
        {projects.length === 0 ? (
          <p>
            No projects yet. <Link to="/projects/new">Create one</Link>
          </p>
        ) : (
          <ul className="project-list">
            {projects.map((p) => (
              <li key={p.id}>
                <Card>
                  <h4>{p.name}</h4>
                  <p>{p.description}</p>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="dashboard-opportunities">
        <h3>Recent Opportunities</h3>
        {opportunities.length === 0 ? (
          <p>No opportunities found yet.</p>
        ) : (
          <ul className="opportunity-list">
            {opportunities.slice(0, 5).map((o) => (
              <li key={o.id}>
                <Card>
                  <h4>{o.title}</h4>
                  <p>{o.description}</p>
                  <span className={`badge badge-${o.priority}`}>{o.priority}</span>
                  <span className={`badge badge-${o.status}`}>{o.status}</span>
                </Card>
              </li>
            ))}
          </ul>
        )}
        {opportunities.length > 5 && (
          <Link to="/opportunities">View all opportunities</Link>
        )}
      </section>
    </div>
  );
}
