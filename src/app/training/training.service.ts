import { Injectable } from "@angular/core";
import { Exercise } from "./exercise.model";
import { Subject } from "rxjs";
import { AngularFirestore } from "angularfire2/firestore";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root",
})
export class TrainingService {
  private runningExercise: Exercise;
  private availableExercises: Exercise[] = [];

  runningExerciseChanged = new Subject<Exercise>();
  availableExercisesChanged = new Subject<Exercise[]>();
  pastExercisesChanged = new Subject<Exercise[]>();

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
        this.availableExercisesChanged.next([...this.availableExercises]);
      });
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  fetchPastExercises() {
    this.db
      .collection("pastExercises")
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.pastExercisesChanged.next(exercises);
      });
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    );
    this.runningExerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: "completed",
    });
    this.runningExercise = null;
    this.runningExerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: (this.runningExercise.duration * progress) / 100,
      calories: (this.runningExercise.calories * progress) / 100,
      date: new Date(),
      state: "cancelled",
    });
    this.runningExercise = null;
    this.runningExerciseChanged.next(null);
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection("pastExercises").add(exercise);
  }
}
