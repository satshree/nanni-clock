"use client";

import { auth } from "@/firebase";
import { removeAuthStateFromLocalStorage } from "./storage";

export async function endSession() {
  try {
    await auth.signOut();
  } catch (error) {
    console.log("ERROR", error);
  }

  removeAuthStateFromLocalStorage();
  window.location.href = "/";
}
