import { DataType } from "@/types";

export function isTodayLogged(data: DataType[]): boolean {
  if (data.length > 0) {
    const today = new Date();
    const latestData = data[data.length - 1].clockIn;

    return (
      today.getFullYear() === latestData.getFullYear() &&
      today.getMonth() === latestData.getMonth() &&
      today.getDate() === latestData.getDate()
    );
  }

  return false;
}
