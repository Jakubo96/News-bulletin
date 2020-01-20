import { Route } from '@angular/router';
import { Role } from '@app/auth/services/role.enum';

export interface AuthorizedRoute extends Route {
  accessAllowedTo?: Role;
  permitAll?: boolean;
  thisUserOrAdmin?: boolean;
}

export type AuthorizedRoutes = AuthorizedRoute[];
