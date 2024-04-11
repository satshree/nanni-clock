"use client";

import { auth } from "@/firebase";
import { removeAuthStateFromLocalStorage } from "./storage";
import moment, { Moment } from "moment";
import { DataType } from "@/types";

export async function endSession() {
  try {
    await auth.signOut();
  } catch (error) {
    console.log("ERROR", error);
  }

  removeAuthStateFromLocalStorage();
  window.location.href = "/";
}

export function toDateTime(seconds: number): Date {
  var t = new Date(1970, 0, 1); // Epoch
  t.setSeconds(seconds);
  return t;
}

export function getDate(date: Date) {
  return moment(date).format("MMM. DD, YYYY");
}

export function getTime(date: Date) {
  return moment(date).format("hh:mm a");
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
