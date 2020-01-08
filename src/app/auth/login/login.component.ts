import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '@app/auth/firebase-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public get email(): AbstractControl {
    return this.loginForm.get('email');
  }

  public get password(): AbstractControl {
    return this.loginForm.get('password');
  }

  public loginForm: FormGroup;

  constructor(private fb: FormBuilder, private firebaseAuth: FirebaseAuthService, private router: Router) {
  }

  ngOnInit() {
    this.buildForm();
  }

  public async signInWithEmailAndPassword(): Promise<void> {
    await this.firebaseAuth.loginWithEmailAndPassword(this.email.value, this.password.value);
    this.router.navigate(['/news']);
  }

  public async loginWithGoogle(): Promise<void> {
    await this.firebaseAuth.loginWithGoogle();
    this.router.navigate(['/news']);
  }

  public async loginWithFacebook(): Promise<void> {
    await this.firebaseAuth.loginWithFacebook();
    this.router.navigate(['/news']);
  }

  private buildForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
}
