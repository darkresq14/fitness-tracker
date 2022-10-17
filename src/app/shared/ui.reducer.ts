import { UIActions, uiActionTypes } from "./ui.actions";

export interface State {
  isLoading: boolean;
}

const INITIAL_STATE: State = {
  isLoading: false,
};

export function uiReducer(state = INITIAL_STATE, action: UIActions) {
  switch (action.type) {
    case uiActionTypes.startLoading:
      return { ...state, isLoading: true };
    case uiActionTypes.stopLoading:
      return { ...state, isLoading: false };
    default:
      return state;
  }
}

export const getIsLoading = (state: State) => state.isLoading;
