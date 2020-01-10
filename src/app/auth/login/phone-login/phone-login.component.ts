import { Component, OnInit } from '@angular/core';

import { auth } from 'firebase';
import { WindowService } from '@app/auth/login/phone-login/window.service';
import { FirebaseAuthService } from '@app/auth/firebase-auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

export class PhoneNumber {
  country: string;
  area: string;
  prefix: string;
  line: string;

  // format phone numbers as E.164
  get e164() {
    const num = this.country + this.area + this.prefix + this.line;
    return `+${num}`;
  }

}

@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.component.html',
  styleUrls: ['./phone-login.component.scss']
})
export class PhoneLoginComponent implements OnInit {

  public windowRef: any;

  public phoneNumberControl: FormControl;
  public verificationCodeControl: FormControl;

  public confirmationResult: auth.ConfirmationResult;

  constructor(private win: WindowService, private firebaseAuth: FirebaseAuthService,
              private router: Router, private fb: FormBuilder) {
  }

  ngOnInit() {
    this.setupRecaptchaVerifier();
    this.buildForm();
  }


  public async sendLoginCode(): Promise<void> {
    this.confirmationResult = await this.firebaseAuth.loginWithPhoneNumber(this.phoneNumberControl.value,
      this.windowRef.recaptchaVerifier);
  }

  public async verifyLoginCode(): Promise<void> {
    const credential = auth.PhoneAuthProvider
      .credential(this.confirmationResult.verificationId, this.verificationCodeControl.value);

    await this.firebaseAuth.loginWithCredentials(credential);

    this.router.navigate(['/news']);
  }

  private async setupRecaptchaVerifier(): Promise<void> {
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = this.firebaseAuth.getRecaptchaVerifier('recaptcha-container');

    this.windowRef.recaptchaWidgetId = await this.windowRef.recaptchaVerifier.render();
  }

  private buildForm() {
    this.phoneNumberControl = this.fb.control('', Validators.required);
    this.verificationCodeControl = this.fb.control('', Validators.required);
  }
}
