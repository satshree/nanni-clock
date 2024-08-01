import {
  collection,
  doc,
  updateDoc,
  getDocs,
  query,
  where,
  and,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

import { firestore } from "./index";
import { loadAuthStateFromLocalStorage } from "@/utils/storage";
import { AutoClockType, DataType, FamilyType, HomeType } from "@/types";
import moment, { Moment } from "moment";

const auth = loadAuthStateFromLocalStorage();

export async function getHome(): Promise<HomeType[]> {
  try {
    const familyQuery = query(
      collection(firestore, "family"),
      where("user", "==", auth.user.email)
    );

    const homeIDList = (await getDocs(familyQuery)).docs.map(
      (f) => f.data().home
    );

    const home = (await getDocs(collection(firestore, "home"))).docs.filter(
      (h) => homeIDList.includes(h.id)
    );

    return home
      .map((hme) => {
        const h: any = hme;
        return {
          id: h.id,
          name: h.data().name,
          hourlyRate: h.data().hourlyRate,
          description: h.data().description,
          uniqueCode: h.data().uniqueCode,
          created: h._document.createTime.timestamp.seconds,
        };
      })
      .sort((pH, nH) => (pH.created < nH.created ? -1 : 1));
  } catch (error) {
    console.log("ERROR", error);
  }

  return [];
}

export async function addHome(data: HomeType): Promise<void> {
  const homeCollection = collection(firestore, "home");
  const newHome = await addDoc(homeCollection, data);
  await addFamily(newHome.id, auth.user.email || "");
}

export async function setHome(homeID: string, data: HomeType): Promise<void> {
  const homeRef = doc(firestore, "home", homeID);
  await updateDoc(homeRef, data);
}

export async function deleteHome(homeID: string): Promise<void> {
  (await getFamily(homeID)).forEach(async (f) => {
    try {
      await removeFamily(f.id || "");
    } catch (error) {
      console.log("ERROR", error);
    }
  });

  (await getData(homeID, [])).forEach(async (d) => {
    try {
      await deleteData(d.id || "");
    } catch (error) {
      console.log("ERROR", error);
    }
  });

  try {
    const homeRef = doc(firestore, "home", homeID);
    await deleteDoc(homeRef);
  } catch (error) {
    console.log("ERROR", error);
  }
}

export async function getAutoClockSettings(
  homeID: string
): Promise<AutoClockType> {
  let clockSettings: AutoClockType = {
    id: "",
    autoClockEnd: "",
    autoClockStart: "",
    autoDailyClock: [],
    home: "",
  };

  try {
    const autoClockSettingsQuery = query(
      collection(firestore, "homeSettings"),
      where("home", "==", homeID)
    );

    (await getDocs(autoClockSettingsQuery)).forEach((settings) => {
      clockSettings = {
        id: settings.id,
        autoClockEnd: settings.data().autoClockEnd,
        autoClockStart: settings.data().autoClockStart,
        autoDailyClock: settings.data().autoDailyClock,
        home: settings.data().home,
      };
    });
  } catch (error) {
    console.log("ERROR", error);
  }

  return clockSettings;
}

export async function setAutoClockSettings(
  autoClockData: AutoClockType
): Promise<void> {
  const autoClockSettingsRef = doc(
    firestore,
    "homeSettings",
    autoClockData.id || ""
  );
  await updateDoc(autoClockSettingsRef, autoClockData);
}

export async function getFamily(homeID: string): Promise<FamilyType[]> {
  try {
    const familyQuery = query(
      collection(firestore, "family"),
      where("home", "==", homeID)
    );

    return (await getDocs(familyQuery)).docs.map((f) => ({
      id: f.id,
      home: f.data().home,
      user: f.data().user,
    }));
  } catch (error) {
    console.log("ERROR", error);
  }

  return [];
}

export async function addFamily(home: string, user: string): Promise<void> {
  const familyRef = collection(firestore, "family");
  await addDoc(familyRef, { home, user });
}

export async function removeFamily(familyID: string): Promise<void> {
  const familyRef = doc(firestore, "family", familyID);
  await deleteDoc(familyRef);
}

export async function getData(
  homeID: string,
  filterDate: Moment[] = []
): Promise<DataType[]> {
  try {
    let dataQuery = query(
      collection(firestore, "clock"),
      where("home", "==", homeID)
    );

    if (filterDate.length > 0) {
      const dateGreater = moment(filterDate[0]).hour(0).minute(0).toDate();
      const dateLesser = moment(filterDate[filterDate.length - 1])
        .hour(23)
        .minute(59)
        .toDate();

      dataQuery = query(
        collection(firestore, "clock"),
        and(
          where("home", "==", homeID),
          where("clockIn", ">=", dateGreater),
          where("clockOut", "<=", dateLesser)
        )
      );
    }

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

export async function deleteData(id: string): Promise<void> {
  const dataRef = doc(firestore, "clock", id);
  await deleteDoc(dataRef);
}
