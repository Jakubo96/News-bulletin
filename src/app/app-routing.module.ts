import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsListComponent } from './news-list/news-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NewsDetailComponent } from '@app/news-detail/news-detail.component';


const routes: Routes = [
  {path: 'news', component: NewsListComponent},
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
