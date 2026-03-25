import { Activity, BarChart3, Play, Plus, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";

const metrics = [
  { label: "Opportunities", value: "24", change: "+5 today", icon: Zap },
  { label: "Active Campaigns", value: "3", change: "1 pending", icon: BarChart3 },
  { label: "Agent Runs Today", value: "12", change: "2 running", icon: Activity },
  { label: "Health Score", value: "87%", change: "Stable", icon: Play },
];

const recentActivity = [
  {
    agent: "SearchMogAgent",
    action: "Completed analysis — found 3 new opportunities",
    time: "12 min ago",
    status: "completed",
  },
  {
    agent: "CompetitorIntelAgent",
    action: "Detected pricing change from TechRival Inc.",
    time: "45 min ago",
    status: "completed",
  },
  {
    agent: "RedditMogAgent",
    action: "Monitoring 4 active threads",
    time: "1 hr ago",
    status: "running",
  },
  {
    agent: "GeoAgent",
    action: "Scheduled daily scan — DACH region",
    time: "2 hr ago",
    status: "pending",
  },
  {
    agent: "ContentFoundryAgent",
    action: "Failed to generate content brief",
    time: "3 hr ago",
    status: "failed",
  },
];

export function CommandCenter() {
  return (
    <div>
      <PageHeader
        title="Command Center"
        subtitle="Acme Corp AI Strategy"
        actions={
          <Button size="sm" variant="outline">
            <Play className="h-3.5 w-3.5" />
            Run Analysis
          </Button>
        }
      />

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {metrics.map((metric) => (
          <Card key={metric.label}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{metric.label}</CardTitle>
                <metric.icon className="h-4 w-4 text-text-tertiary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-display font-bold text-text-primary">
                {metric.value}
              </div>
              <p className="text-xs text-text-tertiary mt-1">{metric.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-3 gap-4">
        {/* Recent Activity */}
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-2 border-b border-border-muted last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-accent-purple">
                          {item.agent}
                        </span>
                        <StatusBadge status={item.status} />
                      </div>
                      <p className="text-sm text-text-secondary mt-0.5 truncate">
                        {item.action}
                      </p>
                    </div>
                    <span className="text-xs text-text-tertiary ml-4 shrink-0">
                      {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button className="w-full justify-start" size="sm">
                  <Play className="h-3.5 w-3.5" />
                  Run Analysis
                </Button>
                <Link to="/opportunities" className="block">
                  <Button
                    className="w-full justify-start"
                    variant="secondary"
                    size="sm"
                  >
                    <Zap className="h-3.5 w-3.5" />
                    View Opportunities
                  </Button>
                </Link>
                <Link to="/projects/new" className="block">
                  <Button
                    className="w-full justify-start"
                    variant="secondary"
                    size="sm"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Create Project
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
