import { Action } from "@ngrx/store";

export enum uiActionTypes {
  startLoading = "[UI] Start Loading",
  stopLoading = "[UI] Stop Loading",
}

export class StartLoading implements Action {
  readonly type = uiActionTypes.startLoading;
}

export class StopLoading implements Action {
  readonly type = uiActionTypes.stopLoading;
}

export type UIActions = StartLoading | StopLoading;
