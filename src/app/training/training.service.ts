import { Injectable, OnDestroy } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Subscription } from 'rxjs/Subscription';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';

import * as UI from '../shared/ui.actions';
import * as TRAINING from './training.actions';
import * as fromTraining from './training.reducer';

@Injectable()
export class TrainingService {
  // exerciseChanged = new Subject<Exercise>();
  // exercisesChanged = new Subject<Exercise[]>();
  // finishedExercisesChanged = new Subject<Exercise[]>();

  private fireBaseSubscription: Subscription[] = [];
  // private availableExercises: Exercise[] = [];
  // private runningExercise: Exercise;

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {}

  fetchAvailableExercises() {
    this.store.dispatch(new UI.StartLoading());
    // this.uiService.loadingStateChange.next(true);
    this.fireBaseSubscription.push(this.db
      .collection('availableExercises')
      .snapshotChanges()
      .map(docData => {
        return docData.map(doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data().name,
            duration: doc.payload.doc.data().duration,
            calories: doc.payload.doc.data().calories
          };
        });
      })
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new UI.StopLoading());
        this.store.dispatch(new TRAINING.SetAvailableTrainings(exercises));
        // this.uiService.loadingStateChange.next(false);
        // this.availableExercises = exercises;
        // this.exercisesChanged.next([...this.availableExercises]);
      }, error => {
        this.store.dispatch(new UI.StopLoading());
        // this.uiService.loadingStateChange.next(false);
        this.uiService.showSnackbar('Fetching Exercises failed, please try again', null, 3000);
        // this.exercisesChanged.next(null);
      })
    );
  }

  startExercise(selectedId: string) {
    this.store.dispatch(new TRAINING.StartTraining(selectedId));
    // this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    // this.exerciseChanged.next({...this.runningExercise});
  }

  completeExercise() {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(exercise => {
      console.log('complete duration: ', exercise.duration);
      this.addDataToDatabase({
        ...exercise,
        date: new Date(),
        state: 'completed'
      });
    this.store.dispatch(new TRAINING.StopTraining());
    });

    // this.runningExercise = null;
    // this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.store.select(fromTraining.getActiveTraining).pipe(take(1)).subscribe(exercise => {
      console.log('cancelled duration: ', exercise.duration);
      this.addDataToDatabase({
        ...exercise,
        duration: exercise.duration * (progress / 100),
        calories: exercise.calories * (progress / 100),
        date: new Date(),
        state: 'cancelled'
      });
      this.store.dispatch(new TRAINING.StopTraining());
    });

    // this.runningExercise = null;
    // this.exerciseChanged.next(null);
  }

  // getRunningExercise() {
  //   return { ...this.runningExercise };
  // }

  fetchCompletedOrCancelledExercises() {
    this.fireBaseSubscription.push(this.db
      .collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        this.store.dispatch(new TRAINING.SetFinishedTrainings(exercises));
        // this.finishedExercisesChanged.next(exercises);
      }, error => {
        console.log(error);
      })
    );
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }

  cancelSubscriptions() {
    this.fireBaseSubscription.forEach(sub => sub.unsubscribe());
  }
}
