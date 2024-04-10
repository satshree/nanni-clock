import {
  collection,
  doc,
  // getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { firestore } from "./index";
import { loadAuthStateFromLocalStorage } from "@/utils/storage";
import { DataType, HomeType } from "@/types";

const auth = loadAuthStateFromLocalStorage();

export async function getHome(): Promise<HomeType[]> {
  try {
    const familyQuery = query(
      collection(firestore, "family"),
      where("user", "==", auth.user.uid)
    );

    const homeIDList = (await getDocs(familyQuery)).docs.map(
      (f) => f.data().home.id
    );

    const home = (await getDocs(collection(firestore, "home"))).docs.filter(
      (h) => homeIDList.includes(h.id)
    );

    return home.map((h) => ({
      id: h.id,
      name: h.data().name,
      hourlyRate: h.data().hourlyRate,
      description: h.data().description,
    }));
  } catch (error) {
    console.log("ERROR", error);
  }

  return [];
}

export async function getData(homeID: string): Promise<DataType[]> {
  try {
    // let startOfWeek = moment().startOf('week').toDate();
    // let endOfWeek   = moment().endOf('week').toDate();

    const home = doc(firestore, "home", homeID);
    const dataQuery = query(
      collection(firestore, "clock"),
      where("home", "==", home)
    );

    return (await getDocs(dataQuery)).docs.map((d) => ({
      id: d.id,
      clockIn: new Date(d.data().clockIn.seconds * 1000),
      clockOut: new Date(d.data().clockOut.seconds * 1000),
      home: d.data().home.id,
    }));
  } catch (error) {
    console.log("ERROR", error);
  }

  return [];
}
