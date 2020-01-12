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
import { NgxFileDropModule } from 'ngx-file-drop';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { IsCreatorOrAdminDirective } from '@app/auth/is-creator-or-admin.directive';
import { NewsDetailComponent } from '@app/news/news-detail/news-detail.component';
import { CreateNewsComponent } from '@app/news/create-news/create-news.component';
import { ImagesCarouselComponent } from '@app/images-carousel/images-carousel.component';
import { LoginComponent } from '@app/auth/login/login.component';
import { RegisterComponent } from '@app/auth/login/register/register.component';
import { NotAuthorizedComponent } from '@app/auth/not-authorized/not-authorized.component';
import { PhoneLoginComponent } from './auth/login/phone-login/phone-login.component';
import { ManageUsersComponent } from './auth/manage-users/manage-users.component';
import { IsAdminDirective } from './auth/is-admin.directive';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    NewsListComponent,
    PageNotFoundComponent,
    NewsDetailComponent,
    CreateNewsComponent,
    ImagesCarouselComponent,
    LoginComponent,
    RegisterComponent,
    NotAuthorizedComponent,
    IsCreatorOrAdminDirective,
    PhoneLoginComponent,
    ManageUsersComponent,
    IsAdminDirective
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
  bootstrap: [AppComponent]
})
export class AppModule {
}
