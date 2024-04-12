import { combineReducers } from "@reduxjs/toolkit";

import { HomeType } from "@/types";
import { ActionTypes, ActiveHomeType } from "./actions";
import { loadActiveHomeFromLocalStorage } from "@/utils/storage";

const localActiveHome = loadActiveHomeFromLocalStorage();

const activeHomeReducer = (
  state: HomeType = localActiveHome,
  action: ActiveHomeType
) => {
  switch (action.type) {
    case ActionTypes.ActiveHome:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default combineReducers({
  activeHome: activeHomeReducer,
});
