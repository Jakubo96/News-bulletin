import { Component, OnInit } from '@angular/core';

import { auth } from 'firebase';
import { WindowService } from '@app/auth/login/phone-login/window.service';
import { FirebaseAuthService } from '@app/auth/firebase-auth.service';
import { Router } from '@angular/router';

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

  windowRef: any;

  phoneNumber = new PhoneNumber();

  verificationCode: string;

  confirmationResult: auth.ConfirmationResult;

  constructor(private win: WindowService, private firebaseAuth: FirebaseAuthService, private router: Router) {
  }

  ngOnInit() {
    this.setupRecaptchaVerifier();
  }


  public async sendLoginCode(): Promise<void> {
    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = this.phoneNumber.e164;

    this.confirmationResult = await this.firebaseAuth.loginWithPhoneNumber(num, appVerifier);
  }

  public async verifyLoginCode(): Promise<void> {
    const credential = auth.PhoneAuthProvider
      .credential(this.confirmationResult.verificationId, this.verificationCode);

    await this.firebaseAuth.loginWithCredentials(credential);

    this.router.navigate(['/news']);
  }

  private async setupRecaptchaVerifier(): Promise<void> {
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = this.firebaseAuth.getRecaptchaVerifier('recaptcha-container');

    this.windowRef.recaptchaWidgetId = await this.windowRef.recaptchaVerifier.render();
  }
}
