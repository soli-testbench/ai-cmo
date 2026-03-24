import React, { useEffect, useState } from 'react';
import type { Opportunity } from '@ai-cmo/types';
import { Card, StatusBadge } from '@ai-cmo/ui';

export function OpportunityList(): React.ReactElement {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOpportunities() {
      try {
        const res = await fetch('/api/analysis/opportunities');
        const data = await res.json();
        setOpportunities(data.data ?? []);
      } catch {
        console.error('Failed to fetch opportunities');
      } finally {
        setLoading(false);
      }
    }
    void fetchOpportunities();
  }, []);

  if (loading) {
    return <div className="page-loading">Loading...</div>;
  }

  return (
    <div className="page opportunity-list">
      <h2>Opportunities</h2>
      <p className="page-subtitle">{opportunities.length} opportunities found</p>

      {opportunities.length === 0 ? (
        <p>No opportunities yet. Run an analysis to discover opportunities.</p>
      ) : (
        <div className="opportunities-grid">
          {opportunities.map((opp) => (
            <Card key={opp.id} title={opp.title}>
              <p>{opp.description}</p>
              <div className="opportunity-meta">
                <StatusBadge status={opp.status} />
                <span className={`badge badge-${opp.priority}`}>{opp.priority}</span>
                <span className="badge">{opp.category}</span>
                <span className="source">via {opp.sourceAgent}</span>
              </div>
              {opp.sourceUrl && (
                <a href={opp.sourceUrl} target="_blank" rel="noopener noreferrer">
                  View source
                </a>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
