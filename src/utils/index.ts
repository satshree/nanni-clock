"use client";

import { auth } from "@/firebase";
import { removeAuthStateFromLocalStorage } from "./storage";
import moment from "moment";

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
