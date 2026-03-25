import { type FormEvent, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "E-Commerce",
  "Education",
  "Manufacturing",
  "Media & Entertainment",
  "Other",
];

export function ProjectCreate() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="New Project" subtitle="Set up a new competitive intelligence project" />

      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input id="name" placeholder="e.g., Acme Corp AI Strategy" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Briefly describe the goals of this competitive intelligence project..."
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company">Company Name *</Label>
                <Input id="company" placeholder="e.g., Acme Corp" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <Select id="industry" required defaultValue="">
                  <option value="" disabled>
                    Select industry
                  </option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry.toLowerCase()}>
                      {industry}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <Input id="website" type="url" placeholder="https://example.com" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                placeholder="AI, machine learning, automation (comma-separated)"
              />
              <p className="text-xs text-text-tertiary">
                Enter keywords separated by commas to track across intelligence sources
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit">Create Project</Button>
              {submitted && (
                <span className="text-sm text-accent-green">Project created (mock)</span>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
