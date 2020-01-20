import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FirebaseAuthService } from '@app/auth/services/firebase-auth.service';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private fb: FormBuilder, private firebaseAuth: FirebaseAuthService, private router: Router,
              private toastr: ToastrService) {
  }

  ngOnInit() {
    this.buildForm();
  }

  public async signInWithEmailAndPassword(): Promise<void> {
    await this.firebaseAuth.loginWithEmailAndPassword(this.email.value, this.password.value);

    this.toastr.success(null, 'Logged in with email');
    this.router.navigate(['/news']);
  }

  public async loginWithGoogle(): Promise<void> {
    await this.firebaseAuth.loginWithGoogle();

    this.toastr.success(null, 'Logged in with Google');
    this.router.navigate(['/news']);
  }

  public async loginWithFacebook(): Promise<void> {
    await this.firebaseAuth.loginWithFacebook();

    this.toastr.success(null, 'Logged in with Facebook');
    this.router.navigate(['/news']);
  }

  public async loginWithGithub(): Promise<void> {
    await this.firebaseAuth.loginWithGithub();

    this.toastr.success(null, 'Logged in with Github');
    this.router.navigate(['/news']);
  }

  private buildForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }
}
