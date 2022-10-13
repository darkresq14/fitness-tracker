import { Injectable } from "@angular/core";
import { Exercise } from "./exercise.model";
import { Subject } from "rxjs";
import { AngularFirestore } from "angularfire2/firestore";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root",
})
export class TrainingService {
  private availableExercises: Exercise[] = [];

  private runningExercise: Exercise;

  private pastExercises: Exercise[] = [];

  exerciseChanged = new Subject<Exercise>();

  exercisesChanged = new Subject<Exercise[]>();

  constructor(private db: AngularFirestore) {}

  fetchAvailableExercises() {
    this.db
      .collection("availableExercises")
      .snapshotChanges()
      .map((docArray) =>
        docArray.map((doc) => {
          return {
            id: doc.payload.doc.id,
            ...(doc.payload.doc.data() as Exercise),
          };
        })
      )
      .subscribe((res) => {
        this.availableExercises = res;
        this.exercisesChanged.next([...this.availableExercises]);
      });
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  getPastExercises() {
    return this.pastExercises.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.pastExercises.push({
      ...this.runningExercise,
      date: new Date(),
      state: "completed",
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.pastExercises.push({
      ...this.runningExercise,
      duration: (this.runningExercise.duration * progress) / 100,
      calories: (this.runningExercise.calories * progress) / 100,
      date: new Date(),
      state: "cancelled",
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }
}
