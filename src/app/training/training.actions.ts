import { Action } from "@ngrx/store";
import { Exercise } from "./exercise.model";

export enum trainingActionTypes {
  setAvailableExercises = "[Training] Set Available Exercises",
  setPastExercises = "[Training] Set Past Exercises",
  startExercise = "[Training] Start Exercise",
  stopExercise = "[Training] Stop Exercise",
}

export class SetAvailableExercises implements Action {
  readonly type = trainingActionTypes.setAvailableExercises;
  constructor(public payload: Exercise[]) {}
}

export class SetPastExercises implements Action {
  readonly type = trainingActionTypes.setPastExercises;
  constructor(public payload: Exercise[]) {}
}

export class StartExercise implements Action {
  readonly type = trainingActionTypes.startExercise;
  constructor(public payload: string) {}
}

export class StopExercise implements Action {
  readonly type = trainingActionTypes.stopExercise;
}

export type TrainingActions =
  | SetAvailableExercises
  | SetPastExercises
  | StartExercise
  | StopExercise;
