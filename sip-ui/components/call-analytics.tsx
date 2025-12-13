'use client';

import { useEffect, useState } from 'react';

interface AnalyticsSummary {
  totalCalls: number;
  totalDuration: number;
  averageDuration: number;
  successRate: number;
  data: Array<{ date: string; calls: number; duration: number }>;
}

interface PerformanceMetrics {
  averageMOS: number;
  averageJitter: number;
  averagePacketLoss: number;
  callsWithIssues: number;
  totalCalls: number;
}

export function CallAnalytics() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [summaryRes, performanceRes] = await Promise.all([
          fetch('/api/telephony/analytics/summary'),
          fetch('/api/telephony/analytics/performance'),
        ]);
        
        const summaryData = await summaryRes.json();
        const performanceData = await performanceRes.json();
        
        setSummary(summaryData);
        setPerformance(performanceData);
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Call Analytics</h3>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {summary.totalCalls}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Calls</div>
          </div>
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {(summary.successRate * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
          </div>
          <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {formatDuration(summary.totalDuration)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Duration</div>
          </div>
          <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {formatDuration(summary.averageDuration)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Duration</div>
          </div>
        </div>
      )}

      {/* Performance Metrics */}
      {performance && (
        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
          <h4 className="font-medium mb-3">Quality Metrics</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">MOS Score</span>
              <span className={performance.averageMOS >= 4 ? 'text-green-600' : 'text-yellow-600'}>
                {performance.averageMOS.toFixed(1)} / 5.0
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Avg Jitter</span>
              <span className={performance.averageJitter < 30 ? 'text-green-600' : 'text-yellow-600'}>
                {performance.averageJitter.toFixed(0)} ms
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Packet Loss</span>
              <span className={performance.averagePacketLoss < 0.02 ? 'text-green-600' : 'text-yellow-600'}>
                {(performance.averagePacketLoss * 100).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Calls with Issues</span>
              <span>{performance.callsWithIssues} / {performance.totalCalls}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

