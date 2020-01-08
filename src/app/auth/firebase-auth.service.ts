import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {

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
}
