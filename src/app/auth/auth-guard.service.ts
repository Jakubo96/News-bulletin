import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { FirebaseAuthService } from '@app/auth/firebase-auth.service';
import { map } from 'rxjs/operators';
import { AuthorizedRoute } from '@app/auth/authorized-route';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private readonly accessDeniedUrlTree;

  constructor(public router: Router, private firebaseAuth: FirebaseAuthService) {
    this.accessDeniedUrlTree = router.parseUrl('/unauthorized');
  }

  public canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const routeConfig = route.routeConfig as AuthorizedRoute;
    if (routeConfig.permitAll) {
      return true;
    }

    if (routeConfig.accessAllowedTo) {
      return this.firebaseAuth.user.pipe(
        map(user => (user && user.roles[routeConfig.accessAllowedTo] ? true : this.accessDeniedUrlTree))
      );
    }

    if (routeConfig.thisUserOrAdmin) {
      return this.firebaseAuth.user.pipe(
        map(user => (user && (user.id === route.paramMap.get('id') || user.roles.admin) ?
          true : this.accessDeniedUrlTree))
      );
    }

    return this.accessDeniedUrlTree;
  }
}

