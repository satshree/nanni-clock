"use client";

import { AuthType, HomeType } from "@/types";

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

export function saveActiveHomeToLocalStore(home: HomeType) {
  localStorage.setItem("activeHome", JSON.stringify(home));
}

export function loadActiveHomeFromLocalStorage(): HomeType {
  const defaultReturn = JSON.stringify({
    id: "",
    name: "",
    hourlyRate: 0.0,
    description: "",
    uniqueCode: "",
  });
  try {
    return JSON.parse(localStorage.getItem("activeHome") || `${defaultReturn}`);
  } catch {
    return JSON.parse(defaultReturn);
  }
}

export function removeActiveHomeFromLocalStorage() {
  localStorage.removeItem("activeHome");
}
