import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockOpportunities } from "@/lib/api-client";
import { cn } from "@/lib/utils";

const agentLabels: Record<string, string> = {
  "search-mog": "SearchMog",
  "competitor-intel": "CompetitorIntel",
  "reddit-mog": "RedditMog",
  geo: "Geo",
  "content-foundry": "ContentFoundry",
};

function scoreColor(score: number): string {
  if (score >= 85) return "text-accent-green";
  if (score >= 70) return "text-accent-blue";
  if (score >= 50) return "text-accent-amber";
  return "text-accent-red";
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function Opportunities() {
  return (
    <div>
      <PageHeader
        title="Opportunities"
        subtitle="Intelligence findings from all agents"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Filter
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        }
      />

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Agent</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockOpportunities.map((opp) => (
                <TableRow key={opp.id}>
                  <TableCell className="max-w-[300px]">
                    <p className="font-medium text-sm truncate">{opp.title}</p>
                    <p className="text-xs text-text-tertiary truncate mt-0.5">{opp.description}</p>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-accent-purple">
                      {agentLabels[opp.agentId] ?? opp.agentId}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-text-secondary uppercase">
                      {opp.type}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={cn("font-mono text-sm font-semibold", scoreColor(opp.score))}>
                      {opp.score}
                    </span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={opp.status} />
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs text-text-secondary">
                      {formatDate(opp.createdAt)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
