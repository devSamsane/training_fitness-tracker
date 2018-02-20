import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  CanLoad,
  Route
} from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromRoot from '../app.reducer';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private store: Store<fromRoot.State>
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select(fromRoot.getIsAuth);
    //  if (this.authService.isAuth()) {
    //    return true;
    //  } else {
    //   this.router.navigate(['/login']);
    //  }
  }

  canLoad(route: Route) {
    console.log('canLoad: ', this.store.select(fromRoot.getIsAuth));
    return this.store.select(fromRoot.getIsAuth);
    // if (this.authService.isAuth()) {
    //   return true;
    // } else {
    //  this.router.navigate(['/login']);
    // }
  }
}
