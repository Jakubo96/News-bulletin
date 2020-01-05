import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsListComponent } from './news/news-list/news-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NewsDetailComponent } from '@app/news/news-detail/news-detail.component';
import { CreateNewsComponent } from '@app/news/create-news/create-news.component';
import { LoginComponent } from '@app/login/login.component';


const routes: Routes = [
  {path: 'news', component: NewsListComponent},
  {path: 'login', component: LoginComponent},
  {path: 'create', component: CreateNewsComponent},
  {path: 'create/:id', component: CreateNewsComponent},
  {path: 'news/:id', component: NewsDetailComponent},
  {path: '', redirectTo: '/news', pathMatch: 'full'},
  {path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
