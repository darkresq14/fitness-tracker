import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Exercise } from "./exercise.model";
import { TrainingActions, trainingActionTypes } from "./training.actions";
import * as fromRoot from "../app.reducer";

export interface TrainingState {
  availableExercises: Exercise[];
  pastExercises: Exercise[];
  activeExercise: Exercise;
}

export interface State extends fromRoot.State {
  training: TrainingState;
}

const INITIAL_STATE: TrainingState = {
  availableExercises: [],
  pastExercises: [],
  activeExercise: null,
};

export function trainingReducer(
  state = INITIAL_STATE,
  action: TrainingActions
) {
  switch (action.type) {
    case trainingActionTypes.setAvailableExercises:
      return { ...state, availableExercises: action.payload };
    case trainingActionTypes.setPastExercises:
      return { ...state, pastExercises: action.payload };
    case trainingActionTypes.startExercise:
      return {
        ...state,
        activeExercise: {
          ...state.availableExercises.find((ex) => ex.id === action.payload),
        },
      };
    case trainingActionTypes.stopExercise:
      return { ...state, activeExercise: null };
    default:
      return state;
  }
}

export const getTrainingState =
  createFeatureSelector<TrainingState>("training");

export const getAvailableExercises = createSelector(
  getTrainingState,
  (state: TrainingState) => state.availableExercises
);
export const getPastExercises = createSelector(
  getTrainingState,
  (state: TrainingState) => state.pastExercises
);
export const getActiveExercise = createSelector(
  getTrainingState,
  (state: TrainingState) => state.activeExercise
);
export const getIsExercise = createSelector(
  getTrainingState,
  (state: TrainingState) => state.activeExercise !== null
);
