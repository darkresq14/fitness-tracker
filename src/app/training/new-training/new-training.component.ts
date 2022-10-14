import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
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

  constructor(private trainingService: TrainingService) {}

  ngOnInit() {
    this.exercisesChangedSub =
      this.trainingService.availableExercisesChanged.subscribe(
        (exercises) => (this.exercises = exercises)
      );
    this.trainingService.fetchAvailableExercises();
  }

  onStart(f: NgForm) {
    this.trainingService.startExercise(f.value.exercise);
  }

  ngOnDestroy(): void {
    this.exercisesChangedSub.unsubscribe();
  }
}
