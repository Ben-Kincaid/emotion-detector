import { Reducer } from "redux";

import { Locality } from "duck/actions";
import { GlobalState } from "types/index";
import { SET_LOADING } from "constants/index";

export function global(
  state: GlobalState = { loading: {} },
  action: Locality
): GlobalState {
  switch (action.type) {
    case SET_LOADING: {
      return {
        ...state,
        loading: {
          [action.name]: {
            loading: action.status === "REQUEST",
            status: action.status
          }
        }
      };
    }
    default:
      return state;
  }
}
