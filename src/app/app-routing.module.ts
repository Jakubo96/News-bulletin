import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NewsDetailComponent } from '@app/news/news-detail/news-detail.component';
import { CreateNewsComponent } from '@app/news/create-news/create-news.component';
import { LoginComponent } from '@app/auth/login/login.component';
import { RegisterComponent } from '@app/auth/login/register/register.component';
import { NotAuthorizedComponent } from '@app/auth/not-authorized/not-authorized.component';
import { AuthGuard } from '@app/auth/services/auth-guard.service';
import { AuthorizedRoutes } from '@app/auth/services/authorized-route';
import { Role } from '@app/auth/services/role.enum';
import { PhoneLoginComponent } from '@app/auth/login/phone-login/phone-login.component';
import { ManageUsersComponent } from '@app/users/manage-users/manage-users.component';
import { EditUserComponent } from '@app/users/edit-user/edit-user.component';
import { NewsListComponent } from '@app/news/news-list/news-list.component';

const routes: AuthorizedRoutes = [
  {
    path: 'news', component: NewsListComponent,
    canActivate: [AuthGuard],
    permitAll: true
  },
  {
    path: 'login', component: LoginComponent,
    canActivate: [AuthGuard],
    permitAll: true
  },
  {
    path: 'phone-login', component: PhoneLoginComponent,
    canActivate: [AuthGuard],
    permitAll: true
  },
  {
    path: 'register', component: RegisterComponent,
    canActivate: [AuthGuard],
    permitAll: true
  },
  {
    path: 'create',
    component: CreateNewsComponent,
    canActivate: [AuthGuard],
    accessAllowedTo: Role.AUTHOR
  },
  {
    path: 'create/:id',
    component: CreateNewsComponent,
    canActivate: [AuthGuard],
    accessAllowedTo: Role.AUTHOR
  },
  {
    path: 'users',
    component: ManageUsersComponent,
    canActivate: [AuthGuard],
    accessAllowedTo: Role.ADMIN
  },
  {
    path: 'users/:id',
    component: EditUserComponent,
    canActivate: [AuthGuard],
    thisUserOrAdmin: true
  },
  {
    path: 'news/:id', component: NewsDetailComponent,
    canActivate: [AuthGuard],
    permitAll: true
  },
  {
    path: 'unauthorized', component: NotAuthorizedComponent,
    canActivate: [AuthGuard],
    permitAll: true
  },
  {path: '', redirectTo: '/news', pathMatch: 'full'},
  {
    path: '**', component: PageNotFoundComponent,
    canActivate: [AuthGuard],
    permitAll: true
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
