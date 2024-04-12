import { HomeType } from "@/types";
import { saveActiveHomeToLocalStore } from "@/utils/storage";

export enum ActionTypes {
  ActiveHome = "ACTIVE_HOME",
}

export type ActiveHomeType = {
  type: ActionTypes.ActiveHome;
  payload: HomeType;
};

export const setActiveHome = (activeHome: HomeType): ActiveHomeType => {
  saveActiveHomeToLocalStore(activeHome);
  return {
    type: ActionTypes.ActiveHome,
    payload: activeHome,
  };
};
