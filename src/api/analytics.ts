import { API_ROOT } from ".";
import {
  AnalyticsDailyApiResponse,
  AnalyticsMonthlyApiResponse,
  AnalyticsTotalApiResponse,
} from "@/types/api";

export async function getAnalyticsTotal(
  access: string,
  homeID: string
): Promise<AnalyticsTotalApiResponse> {
  const response = await fetch(API_ROOT + `/api/analytics/total/${homeID}/`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });

  return await response.json();
}

export async function getAnalyticsMonthly(
  access: string,
  homeID: string
): Promise<AnalyticsMonthlyApiResponse> {
  const response = await fetch(API_ROOT + `/api/analytics/monthly/${homeID}/`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });

  return await response.json();
}

export async function getAnalyticsDaily(
  access: string,
  homeID: string
): Promise<AnalyticsDailyApiResponse> {
  const response = await fetch(API_ROOT + `/api/analytics/daily/${homeID}/`, {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });

  return await response.json();
}
