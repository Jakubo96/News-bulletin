import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from '@angular/fire';
import { environment } from '@environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AppRoutingModule } from '@app/app-routing.module';
import { AppComponent } from '@app/app.component';
import { HeaderComponent } from '@app/header/header.component';
import { NewsListComponent } from '@app/news/news-list/news-list.component';
import { PageNotFoundComponent } from '@app/page-not-found/page-not-found.component';
import { NewsDetailComponent } from './news/news-detail/news-detail.component';
import { CreateNewsComponent } from './news/create-news/create-news.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { ImagesCarouselComponent } from './images-carousel/images-carousel.component';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NewsListComponent,
    PageNotFoundComponent,
    NewsDetailComponent,
    CreateNewsComponent,
    ImagesCarouselComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    ReactiveFormsModule,
    NgxFileDropModule,
    AngularFireStorageModule,
    AngularFireAuthModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
