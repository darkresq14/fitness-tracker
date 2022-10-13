import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Exercise } from "../exercise.model";
import { TrainingService } from "../training.service";

@Component({
  selector: "app-new-training",
  templateUrl: "./new-training.component.html",
  styleUrls: ["./new-training.component.css"],
})
export class NewTrainingComponent implements OnInit {
  exercises: Exercise[] = [];

  constructor(private trainingService: TrainingService) {}

  ngOnInit() {
    this.exercises = this.trainingService.getAvailableExercises();
  }

  onStart(f: NgForm) {
    this.trainingService.startExercise(f.value.exercise);
  }
}
