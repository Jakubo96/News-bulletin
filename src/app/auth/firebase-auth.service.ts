import { Injectable, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { switchMap, take, takeUntil } from 'rxjs/operators';
import { User } from '@app/auth/user';
import { auth } from 'firebase';
import { FirestoreService } from '@app/services/firestore/firestore.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService implements OnDestroy {

  private _user: BehaviorSubject<User> = new BehaviorSubject(null);
  private unsubscribe$ = new Subject();

  get user(): Observable<User> {
    return this._user;
  }

  constructor(private afAuth: AngularFireAuth,
              private firestoreService: FirestoreService) {
    this.afAuth.user
      .pipe(
        switchMap(user => user ?
          this.firestoreService.getUserDoc(user.uid) :
          of(null)),
        takeUntil(this.unsubscribe$))
      .subscribe(user => this._user.next(user));
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


  public async createUser(email: string, password: string): Promise<void> {
    const credentials = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);

    this.createUserDoc(credentials.user);
  }

  public async loginWithEmailAndPassword(email: string, password: string): Promise<void> {
    const credentials = await this.afAuth.auth.signInWithEmailAndPassword(email, password);

    this.createUserDoc(credentials.user);
  }

  public async loginWithGoogle(): Promise<void> {
    const credentials = await this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());

    this.createUserDoc(credentials.user);
  }

  public async loginWithFacebook(): Promise<void> {
    const credentials = await this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());

    this.createUserDoc(credentials.user);
  }

  public async logout(): Promise<void> {
    await this.afAuth.auth.signOut();
  }

  private createUserDoc(authData: firebase.User): void {
    const userData = {...new User(authData)};
    const doc = this.firestoreService.getUserDoc(authData.uid);

    doc
      .pipe(take(1), takeUntil(this.unsubscribe$))
      .subscribe(user => {
        if (!user) {
          this.firestoreService.createUsersDoc(authData.uid, userData);
        }
      });
  }
}
