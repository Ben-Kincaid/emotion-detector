import { Action, Reducer, createStore, combineReducers } from "redux";
import { StoreState } from "types";
import { global } from "duck/index";

const reducers: Reducer<StoreState> = combineReducers<StoreState>({
  global
});

export const store = createStore<StoreState, Action<any>, unknown, unknown>(
  reducers,
  (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
    (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);
