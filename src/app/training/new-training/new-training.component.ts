import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { UIService } from "../../shared/ui.service";
import { Exercise } from "../exercise.model";
import { TrainingService } from "../training.service";

@Component({
  selector: "app-new-training",
  templateUrl: "./new-training.component.html",
  styleUrls: ["./new-training.component.css"],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[] = [];
  exercisesChangedSub: Subscription;
  loadingSub: Subscription;
  isLoading = true;

  constructor(
    private trainingService: TrainingService,
    private uiService: UIService
  ) {}

  ngOnInit() {
    this.loadingSub = this.uiService.loadingStateChanged.subscribe(
      (res) => (this.isLoading = res)
    );
    this.exercisesChangedSub =
      this.trainingService.availableExercisesChanged.subscribe(
        (exercises) => (this.exercises = exercises)
      );
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStart(f: NgForm) {
    this.trainingService.startExercise(f.value.exercise);
  }

  ngOnDestroy(): void {
    if (this.exercisesChangedSub) {
      this.exercisesChangedSub.unsubscribe();
    }
    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
  }
}
