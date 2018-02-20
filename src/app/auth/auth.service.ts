import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { AngularFireAuth } from 'angularfire2/auth';
import { Store } from '@ngrx/store';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';

import * as fromApp from '../app.reducer';

@Injectable()
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afauth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<{ui: fromApp.State}>
  ) {}

  initAuthListener() {
    this.afauth.authState.subscribe(
      user => {
        if (user) {
          this.isAuthenticated = true;
          this.authChange.next(true);
          this.router.navigate(['/training']);
        } else {
          this.trainingService.cancelSubscriptions();
          this.authChange.next(false);
          this.router.navigate(['/login']);
          this.isAuthenticated = false;
        }
      }
    );
  }

  registerUser(authData: AuthData) {
    // this.uiService.loadingStateChange.next(true);
    this.store.dispatch({ type: 'START_LOADING' });
    this.afauth.auth.createUserWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(result => {
      // this.uiService.loadingStateChange.next(false);
      this.store.dispatch({ type: 'STOP_LOADING' });
      console.log(result);
    })
    .catch(error => {
      // this.uiService.loadingStateChange.next(false);
      this.store.dispatch({ type: 'STOP_LOADING' });
      this.uiService.showSnackbar(error.message, null, 3000);
    });
  }

  login(authData: AuthData) {
    // this.uiService.loadingStateChange.next(true);
    this.store.dispatch({ type: 'START_LOADING' });
    this.afauth.auth.signInWithEmailAndPassword(
      authData.email,
      authData.password
    ).then(result => {
      // this.uiService.loadingStateChange.next(false);
      this.store.dispatch({ type: 'STOP_LOADING' });
      console.log(result);
    })
    .catch(error => {
      // this.uiService.loadingStateChange.next(false);
      this.store.dispatch({ type: 'STOP_LOADING' });
      this.uiService.showSnackbar(error.message, null, 3000);
    });
  }

  logout() {
    this.afauth.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }

}
