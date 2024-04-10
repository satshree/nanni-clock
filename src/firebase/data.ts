import {
  collection,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  and,
  addDoc,
} from "firebase/firestore";

import { firestore } from "./index";
import { loadAuthStateFromLocalStorage } from "@/utils/storage";
import { DataType, HomeType } from "@/types";
import moment from "moment";

const auth = loadAuthStateFromLocalStorage();

export async function getHome(): Promise<HomeType[]> {
  try {
    const familyQuery = query(
      collection(firestore, "family"),
      where("user", "==", auth.user.uid)
    );

    const homeIDList = (await getDocs(familyQuery)).docs.map(
      (f) => f.data().home
    );

    const home = (await getDocs(collection(firestore, "home"))).docs.filter(
      (h) => homeIDList.includes(h.id)
    );

    return home.map((h) => ({
      id: h.id,
      name: h.data().name,
      hourlyRate: h.data().hourlyRate,
      description: h.data().description,
      uniqueCode: h.data().uniqueCode,
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

    const dataQuery = query(
      collection(firestore, "clock"),
      where("home", "==", homeID)
    );

    return (await getDocs(dataQuery)).docs.map((d) => ({
      id: d.id,
      clockIn: new Date(d.data().clockIn.seconds * 1000),
      clockOut: new Date(d.data().clockOut.seconds * 1000),
      home: d.data().home,
      notes: d.data().notes,
    }));
  } catch (error) {
    console.log("ERROR", error);
  }

  return [];
}

export async function dataExists(homeID: string, date: Date): Promise<boolean> {
  try {
    const dateGreater = moment(date).hour(0).minute(0).toDate();
    const dateLesser = moment(date).hour(23).minute(59).toDate();

    const clockQuery = query(
      collection(firestore, "clock"),
      and(
        where("home", "==", homeID),
        where("clockIn", ">=", dateGreater),
        where("clockOut", "<=", dateLesser)
      )
    );

    return (await getDocs(clockQuery)).docs.length > 0;
  } catch (error) {
    console.log("ERROR", error);
  }

  return false;
}

export async function setData(data: DataType): Promise<void> {
  if (await dataExists(data.home, data.clockIn)) {
    throw new Error("The log for that day already exists");
  }

  await addDoc(collection(firestore, "clock"), data);
}

export async function updateData(id: string, data: DataType): Promise<void> {
  const dataRef = doc(firestore, "clock", id);
  await updateDoc(dataRef, data);
}
