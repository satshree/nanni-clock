"use client";

import { auth } from "@/firebase";
import {
  removeActiveHomeFromLocalStorage,
  removeAuthStateFromLocalStorage,
} from "./storage";
import moment, { Moment } from "moment";
import { DataType } from "@/types";

export async function endSession() {
  try {
    await auth.signOut();
  } catch (error) {
    console.log("ERROR", error);
  }

  removeAuthStateFromLocalStorage();
  removeActiveHomeFromLocalStorage();

  if (typeof window !== "undefined") window.location.href = "/";
}

export function toDateTime(seconds: number): Date {
  let t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(seconds);
  return t;
}

export function getDate(date: Date) {
  return moment(date).format("MMM. DD, YYYY");
}

export function getDateWithDay(date: Date) {
  return moment(date).format("dddd, MMM. DD");
}

export function getTime(date: Date) {
  return moment(date).format("hh:mm a");
}

export function getDateWithShortDay(date: Date) {
  return moment(date).format("ddd, MMM. DD");
}

export function getCurrentWeek() {
  let startOfWeek = moment().startOf("week").add(1, "days");

  // let endOfWeek = moment().endOf("week").toDate();

  let week: Moment[] = [startOfWeek];

  for (let i = 0; i < 6; i++) {
    const tomorrow = moment(week[i]).add(1, "days");
    week.push(tomorrow);
  }

  return week;
}

export function hourDifference(start: Date, end: Date) {
  const startDate = moment(start);
  const endDate = moment(end);

  return (endDate.diff(startDate, "seconds") / (60 * 60)).toFixed(1);
}

export function countHours(data: DataType[]): number {
  let sum = 0;

  for (let d of data) {
    sum += parseFloat(hourDifference(d.clockIn, d.clockOut));
  }

  return sum;
}

export function firstAndLastDayOfWeek(week: Moment[]): string {
  const firstDay = moment(week[0]).format("MMM. DD");
  const lastDay = moment(week[week.length - 1]).format("MMM. DD");

  return `${firstDay} – ${lastDay}`;
}
