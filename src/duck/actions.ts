import * as constants from "constants/index";
import * as types from "types/index";

export interface SetLoading {
  type: constants.SET_LOADING;
  name: string;
  status: types.LoadingStatusTypes;
}

export function setLoading(
  name: string,
  status: types.LoadingStatusTypes
): SetLoading {
  return {
    type: constants.SET_LOADING,
    name,
    status
  };
}

export type Locality = SetLoading;
