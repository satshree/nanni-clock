export type AnalyticsTotalApiResponse = {
  totalCost: number;
  totalDays: number;
  totalHours: number;
};

export type AnalyticsMonthlyApiResponse = {
  [key: string]: {
    totalCost: number;
    totalDays: number;
    totalHours: number;
  };
};

export type AnalyticsDailyApiResponse = {
  [key: string]: {
    totalCost: number;
    totalHour: number;
  };
};
