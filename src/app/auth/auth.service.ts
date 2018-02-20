import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Store } from '@ngrx/store';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';

import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as AUTH from './auth.actions';

@Injectable()
export class AuthService {
  // authChange = new Subject<boolean>();
  // private isAuthenticated = false;

  constructor(
    private router: Router,
    private afauth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  initAuthListener() {
    this.afauth.authState.subscribe(
      user => {
        if (user) {
          this.store.dispatch(new AUTH.SetAuthenticated());
          this.router.navigate(['/training']);
          // this.isAuthenticated = true;
          // this.authChange.next(true);
        } else {
          this.trainingService.cancelSubscriptions();
          this.store.dispatch(new AUTH.SetUnauthenticated());
          // this.authChange.next(false);
          this.router.navigate(['/login']);
          // this.isAuthenticated = false;
        }
      }
    );
  }

  registerUser(authData: AuthData) {
    // this.uiService.loadingStateChange.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.afauth.auth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(result => {
      // this.uiService.loadingStateChange.next(false);
      this.store.dispatch(new UI.StopLoading());
      console.log(result);
    })
    .catch(error => {
      // this.uiService.loadingStateChange.next(false);
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar(error.message, null, 3000);
    });
  }

  login(authData: AuthData) {
    // this.uiService.loadingStateChange.next(true);
    this.store.dispatch(new UI.StartLoading());
    this.afauth.auth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(result => {
      // this.uiService.loadingStateChange.next(false);
      this.store.dispatch(new UI.StopLoading());
      console.log(result);
    })
    .catch(error => {
      // this.uiService.loadingStateChange.next(false);
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackbar(error.message, null, 3000);
    });
  }

  logout() {
    this.afauth.auth.signOut();
  }

}
