"use client";

import { Toolbar } from "@/components/layout/Toolbar";
import { analyticsData } from "@/data/analytics";
import { ArrowUpRightIcon, ArrowDownRightIcon } from "@/components/icons";

export function AnalyticsView() {
  const formatChange = (change: number | string, direction: "up" | "down" | "neutral") => {
    const changeValue = typeof change === "string" ? change : change > 0 ? `+${change}` : change.toString();
    const isPositive = direction === "up";
    const isNeutral = direction === "neutral";
    
    return (
      <span className={`text-sm flex items-center gap-1 ${isNeutral ? "text-text-muted" : isPositive ? "text-green-500" : "text-red-500"}`}>
        {!isNeutral && (isPositive ? <ArrowUpRightIcon /> : <ArrowDownRightIcon />)}
        {changeValue}
      </span>
    );
  };

  const formatLabel = (key: string) => {
    return key.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Toolbar title="Analytics" count={0} />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Key Numbers */}
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Key Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(analyticsData.key_numbers).map(([key, data]) => (
                <div
                  key={key}
                  className="bg-sidebar-bg border border-border rounded-lg p-4 hover:bg-sidebar-hover transition-colors"
                >
                  <div className="text-text-muted text-sm mb-1">{formatLabel(key)}</div>
                  <div className="text-2xl font-semibold text-text-primary mb-1">
                    {data.value.toLocaleString()}
                  </div>
                  {formatChange(data.change, data.change_direction)}
                </div>
              ))}
            </div>
          </div>

          {/* Outbound Health Indicators */}
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Outbound Health Indicators</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(analyticsData.outbound_health_indicators).map(([key, data]) => (
                <div
                  key={key}
                  className="bg-sidebar-bg border border-border rounded-lg p-4 hover:bg-sidebar-hover transition-colors"
                >
                  <div className="text-text-muted text-sm mb-1">{formatLabel(key)}</div>
                  <div className="text-2xl font-semibold text-text-primary mb-1">
                    {data.value}
                  </div>
                  {formatChange(data.change, data.change_direction)}
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div>
            <h2 className="text-lg font-semibold text-text-primary mb-4">Filters</h2>
            <div className="flex flex-wrap gap-2">
              {Object.entries(analyticsData.filters).map(([key, value]) => (
                <div
                  key={key}
                  className="px-3 py-1.5 bg-tag-bg border border-border rounded text-sm text-text-secondary"
                >
                  <span className="text-text-muted capitalize">{key}:</span>{" "}
                  <span className="text-text-primary">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
