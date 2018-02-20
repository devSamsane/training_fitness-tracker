import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { UIService } from '../../shared/ui.service';

import * as fromTraining from '../training.reducer';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  // exercises: Exercise[];
  // private exercisesSubscription: Subscription;
  // private loadingSubscription: Subscription;
  exercises$: Observable<Exercise[]>;
  isLoading$: Observable<boolean>;

  // isLoading = true;

  constructor(
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) { }

  ngOnInit() {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exercises$ = this.store.select(fromTraining.getAvailableExercises);
    // this.loadingSubscription = this.uiService.loadingStateChange.subscribe(
    //   isLoading => {
    //     this.isLoading = isLoading;
    //   }
    // );
    // this.exercisesSubscription = this.trainingService.exercisesChanged.subscribe(
    //   exercises => {
    //     this.exercises = exercises;
    //   }
    // );
    this.fetchExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  // ngOnDestroy() {
  //   if (this.loadingSubscription) {
  //     this.loadingSubscription.unsubscribe();
  //   }
  //   if (this.exercisesSubscription) {
  //     this.exercisesSubscription.unsubscribe();
  //   }
  // }

}
