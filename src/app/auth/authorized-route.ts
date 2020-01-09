import { Route } from '@angular/router';

export interface AuthorizedRoute extends Route {
  permitAll?: boolean;
}

export type AuthorizedRoutes = AuthorizedRoute[];
