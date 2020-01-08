import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

  get user(): Observable<User> {
    return this.afAuth.user;
  }

  constructor(private afAuth: AngularFireAuth,) {
  }


  public async createUser(email: string, password: string): Promise<void> {
    await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  public async loginWithEmailAndPassword(email: string, password: string): Promise<void> {
    await this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  public async loginWithGoogle(): Promise<void> {
    await this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

  public async logout(): Promise<void> {
    await this.afAuth.auth.signOut();
  }
}
