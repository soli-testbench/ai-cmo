import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@ai-cmo/ui';

export function ProjectCreate(): React.ReactElement {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get('name') as string,
      description: form.get('description') as string,
      companyName: form.get('companyName') as string,
      industry: form.get('industry') as string,
      companyDescription: form.get('companyDescription') as string,
      website: (form.get('website') as string) || undefined,
      targetAudience: (form.get('targetAudience') as string) || undefined,
    };

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Failed to create project');
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page project-create">
      <h2>Create New Project</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="name">Project Name</label>
          <input id="name" name="name" type="text" required />
        </div>

        <div className="form-group">
          <label htmlFor="description">Project Description</label>
          <textarea id="description" name="description" required rows={3} />
        </div>

        <div className="form-group">
          <label htmlFor="companyName">Company Name</label>
          <input id="companyName" name="companyName" type="text" required />
        </div>

        <div className="form-group">
          <label htmlFor="industry">Industry</label>
          <input id="industry" name="industry" type="text" required />
        </div>

        <div className="form-group">
          <label htmlFor="companyDescription">Company Description</label>
          <textarea id="companyDescription" name="companyDescription" required rows={3} />
        </div>

        <div className="form-group">
          <label htmlFor="website">Website (optional)</label>
          <input id="website" name="website" type="url" />
        </div>

        <div className="form-group">
          <label htmlFor="targetAudience">Target Audience (optional)</label>
          <input id="targetAudience" name="targetAudience" type="text" />
        </div>

        <Button type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Project'}
        </Button>
      </form>
    </div>
  );
}
