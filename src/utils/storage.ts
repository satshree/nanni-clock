"use client";

import { AuthType } from "@/types";

export function loadAuthStateFromLocalStorage(): AuthType {
  const defaultReturn = JSON.stringify({
    token: "",
    user: {},
  });

  try {
    return JSON.parse(localStorage.getItem("auth") || `${defaultReturn}`);
  } catch {
    return JSON.parse(defaultReturn);
  }
}

export function saveAuthStateToLocalStorage(auth: AuthType) {
  localStorage.setItem("auth", JSON.stringify(auth));
}

export function removeAuthStateFromLocalStorage() {
  localStorage.removeItem("auth");
}
