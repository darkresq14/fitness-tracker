import { AuthActions, authActionTypes } from "./auth.actions";

export interface State {
  isAuthenticated: boolean;
}

const INITIAL_STATE: State = {
  isAuthenticated: false,
};

export function authReducer(state = INITIAL_STATE, action: AuthActions) {
  switch (action.type) {
    case authActionTypes.setAuthenticated:
      return { ...state, isAuthenticated: true };
    case authActionTypes.setUnauthenticated:
      return { ...state, isAuthenticated: false };
    default:
      return state;
  }
}

export const getIsAuth = (state: State) => state.isAuthenticated;
