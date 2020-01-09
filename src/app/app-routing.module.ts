import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewsListComponent } from './news/news-list/news-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NewsDetailComponent } from '@app/news/news-detail/news-detail.component';
import { CreateNewsComponent } from '@app/news/create-news/create-news.component';
import { LoginComponent } from '@app/auth/login/login.component';
import { RegisterComponent } from '@app/auth/register/register.component';
import { NotAuthorizedComponent } from '@app/auth/not-authorized/not-authorized.component';
import { AuthGuard } from '@app/auth/auth-guard.service';
import { AuthorizedRoutes } from '@app/auth/authorized-route';
import { Role } from '@app/auth/role.enum';

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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
