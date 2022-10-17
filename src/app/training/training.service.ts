import { Injectable } from "@angular/core";
import { Exercise } from "./exercise.model";
import { Subscription } from "rxjs/Subscription";
import { AngularFirestore } from "angularfire2/firestore";
import "rxjs/add/operator/map";
import { take } from "rxjs/operators";
import { UIService } from "../shared/ui.service";
import { Store } from "@ngrx/store";
import * as fromTraining from "./training.reducer";
import * as UI from "../shared/ui.actions";
import * as Training from "./training.actions";

@Injectable({
  providedIn: "root",
})
export class TrainingService {
  private fbSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {}

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
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
          (exercises: Exercise[]) => {
            this.store.dispatch(new UI.StopLoading());
            this.store.dispatch(new Training.SetAvailableExercises(exercises));
          },
          (err) => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar(
              `Fetching exercises failed, please try again later`,
              null,
              3000
            );
            this.store.dispatch(new Training.SetAvailableExercises([]));
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
          this.store.dispatch(new Training.SetPastExercises(exercises));
        })
    );
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new Training.StartExercise(selectedId));
  }

  completeExercise() {
    this.store
      .select(fromTraining.getActiveExercise)
      .pipe(take(1))
      .subscribe((ex) => {
        this.addDataToDatabase({
          ...ex,
          date: new Date(),
          state: "completed",
        });
      });

    this.store.dispatch(new Training.StopExercise());
  }

  cancelExercise(progress: number) {
    this.store
      .select(fromTraining.getActiveExercise)
      .pipe(take(1))
      .subscribe((ex) => {
        this.addDataToDatabase({
          ...ex,
          duration: (ex.duration * progress) / 100,
          calories: (ex.calories * progress) / 100,
          date: new Date(),
          state: "cancelled",
        });
      });

    this.store.dispatch(new Training.StopExercise());
  }

  cancelSubscriptions() {
    this.fbSubs.forEach((sub) => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection("pastExercises").add(exercise);
  }
}
