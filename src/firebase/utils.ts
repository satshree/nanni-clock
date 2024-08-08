import { getData } from "./data";

export async function isTodayLogged(homeID: string): Promise<boolean> {
  const data = await getData(homeID);

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
