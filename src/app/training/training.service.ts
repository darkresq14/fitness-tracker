import { Injectable } from "@angular/core";
import { Exercise } from "./exercise.model";
import { Subject, Subscription } from "rxjs";
import { AngularFirestore } from "angularfire2/firestore";
import "rxjs/add/operator/map";
import { UIService } from "../shared/ui.service";

@Injectable({
  providedIn: "root",
})
export class TrainingService {
  private runningExercise: Exercise;
  private availableExercises: Exercise[] = [];

  runningExerciseChanged = new Subject<Exercise>();
  availableExercisesChanged = new Subject<Exercise[]>();
  pastExercisesChanged = new Subject<Exercise[]>();

  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore, private uiService: UIService) {}

  fetchAvailableExercises() {
    this.uiService.loadingStateChanged.next(true);
    this.fbSubs.push(
      this.db
        .collection("availableExercises")
        .snapshotChanges()
        .map((docArray) => {
          {
            // throw new Error("Test");
            return docArray.map((doc) => {
              return {
                id: doc.payload.doc.id,
                ...(doc.payload.doc.data() as Exercise),
              };
            });
          }
        })
        .subscribe(
          (res) => {
            this.uiService.loadingStateChanged.next(false);
            this.availableExercises = res;
            this.availableExercisesChanged.next([...this.availableExercises]);
          },
          (err) => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackbar(
              `Fetching exercises failed, please try again later`,
              null,
              3000
            );
            this.availableExercisesChanged.next(null);
          }
        )
    );
  }

  fetchPastExercises() {
    this.fbSubs.push(
      this.db
        .collection("pastExercises")
        .valueChanges()
        .subscribe((exercises: Exercise[]) => {
          this.pastExercisesChanged.next(exercises);
        })
    );
  }

  getRunningExercise() {
    return { ...this.runningExercise };
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

  cancelSubscriptions() {
    this.fbSubs.forEach((sub) => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection("pastExercises").add(exercise);
  }
}
