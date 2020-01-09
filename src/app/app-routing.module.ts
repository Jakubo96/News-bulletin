import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsListComponent } from './news/news-list/news-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NewsDetailComponent } from '@app/news/news-detail/news-detail.component';
import { CreateNewsComponent } from '@app/news/create-news/create-news.component';
import { LoginComponent } from '@app/auth/login/login.component';
import { RegisterComponent } from '@app/auth/register/register.component';
import { AngularFireAuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { NotAuthorizedComponent } from '@app/auth/not-authorized/not-authorized.component';

const redirectUnauthorizedToUnauthorized = () => redirectUnauthorizedTo(['unauthorized']);

const routes: Routes = [
  {path: 'news', component: NewsListComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {
    path: 'create',
    component: CreateNewsComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToUnauthorized}
  },
  {
    path: 'create/:id',
    component: CreateNewsComponent,
    canActivate: [AngularFireAuthGuard],
    data: {authGuardPipe: redirectUnauthorizedToUnauthorized}
  },
  {path: 'news/:id', component: NewsDetailComponent},
  {path: 'unauthorized', component: NotAuthorizedComponent},
  {path: '', redirectTo: '/news', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
