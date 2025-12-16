export interface AnalyticsData {
  dashboard_date: string;
  key_numbers: {
    total_leads: { value: number; change: number; change_direction: "up" | "down" | "neutral" };
    new_leads: { value: number; change: number; change_direction: "up" | "down" | "neutral" };
    exhaustions: { value: number; change: number; change_direction: "up" | "down" | "neutral" };
    dial_attempts: { value: number; change: number; change_direction: "up" | "down" | "neutral" };
    pickups: { value: number; change: number; change_direction: "up" | "down" | "neutral" };
    conversions: { value: number; change: number; change_direction: "up" | "down" | "neutral" };
  };
  outbound_health_indicators: {
    unique_dial_rate: { value: string; change: string; change_direction: "up" | "down" | "neutral" };
    contact_rate: { value: string; change: string; change_direction: "up" | "down" | "neutral" };
    number_health: { value: string; change: string; change_direction: "up" | "down" | "neutral" };
  };
  filters: {
    agent: string;
    campaign: string;
    date: string;
  };
}

export const analyticsData: AnalyticsData = {
  dashboard_date: "2025-01-23",
  key_numbers: {
    total_leads: {
      value: 2974,
      change: 178,
      change_direction: "up"
    },
    new_leads: {
      value: 92,
      change: -19,
      change_direction: "down"
    },
    exhaustions: {
      value: 89,
      change: 25,
      change_direction: "up"
    },
    dial_attempts: {
      value: 232,
      change: 14,
      change_direction: "up"
    },
    pickups: {
      value: 89,
      change: 25,
      change_direction: "up"
    },
    conversions: {
      value: 0,
      change: 0,
      change_direction: "neutral"
    }
  },
  outbound_health_indicators: {
    unique_dial_rate: {
      value: "59.48%",
      change: "3.98%",
      change_direction: "up"
    },
    contact_rate: {
      value: "64.49%",
      change: "11.60%",
      change_direction: "up"
    },
    number_health: {
      value: "85.28%",
      change: "-1.34%",
      change_direction: "down"
    }
  },
  filters: {
    agent: "available",
    campaign: "available",
    date: "2025-01-23"
  }
};