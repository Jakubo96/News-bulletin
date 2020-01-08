import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PasswordValidation } from '@app/auth/register/password-validation';
import { FirebaseAuthService } from '@app/auth/firebase-auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public get email(): AbstractControl {
    return this.registerForm.get('email');
  }

  public get password(): AbstractControl {
    return this.registerForm.get('password');
  }

  public registerForm: FormGroup;

  constructor(private fb: FormBuilder, private firebaseAuth: FirebaseAuthService, private router: Router) {
  }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatedPassword: ['']
    }, {
      validator: PasswordValidation.matchPassword
    });
  }

  public async onSubmit(): Promise<void> {
    await this.firebaseAuth.createUser(this.email.value, this.password.value);
    this.router.navigate(['/news']);
  }
}
