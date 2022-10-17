import { Action } from "@ngrx/store";

export enum authActionTypes {
  setAuthenticated = "[Auth] Set Authenticated",
  setUnauthenticated = "[Auth] Set Unauthenticated",
}

export class SetAuthenticated implements Action {
  readonly type = authActionTypes.setAuthenticated;
}

export class SetUnauthenticated implements Action {
  readonly type = authActionTypes.setUnauthenticated;
}

export type AuthActions = SetAuthenticated | SetUnauthenticated;
