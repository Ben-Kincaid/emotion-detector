import { Locality as GlobalRootAction } from "duck/actions";

export interface GlobalState {
  loading: Object;
}

export interface StoreState {
  global: GlobalState;
}

export type LoadingStatusTypes = "REQUEST" | "SUCCESS" | "FAILED";

export type RootAction = GlobalRootAction;
