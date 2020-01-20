import { Component, OnInit } from '@angular/core';

import { auth } from 'firebase';
import { WindowService } from '@app/auth/login/phone-login/window.service';
import { FirebaseAuthService } from '@app/auth/services/firebase-auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-phone-login',
  templateUrl: './phone-login.component.html',
  styleUrls: ['./phone-login.component.scss']
})
export class PhoneLoginComponent implements OnInit {

  public windowRef: any;

  public phoneGroup: FormGroup;
  public verificationCodeControl: FormControl;

  public confirmationResult: auth.ConfirmationResult;

  constructor(private win: WindowService, private firebaseAuth: FirebaseAuthService,
              private router: Router, private fb: FormBuilder, private toastr: ToastrService) {
  }

  ngOnInit() {
    this.setupRecaptchaVerifier();
    this.buildForm();
  }


  public async sendLoginCode(): Promise<void> {
    const phoneNumber = this.obtainPhoneNumber();

    this.confirmationResult = await this.firebaseAuth.loginWithPhoneNumber(phoneNumber,
      this.windowRef.recaptchaVerifier);

    this.toastr.success(null, 'Confirmation code sent');
  }

  public async verifyLoginCode(): Promise<void> {
    const credential = auth.PhoneAuthProvider
      .credential(this.confirmationResult.verificationId, this.verificationCodeControl.value);

    await this.firebaseAuth.loginWithCredentials(credential);

    this.toastr.success(null, 'Logged in with phone');
    this.router.navigate(['/news']);
  }

  private async setupRecaptchaVerifier(): Promise<void> {
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = this.firebaseAuth.getRecaptchaVerifier('recaptcha-container');

    this.windowRef.recaptchaWidgetId = await this.windowRef.recaptchaVerifier.render();
  }

  private buildForm() {
    this.phoneGroup = this.fb.group({
      prefix: ['+48', [Validators.required, Validators.minLength(3), Validators.maxLength(3),
        Validators.pattern('[0-9+]*')]],
      first: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3),
        Validators.pattern('[0-9]*')]],
      second: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3),
        Validators.pattern('[0-9]*')]],
      third: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3),
        Validators.pattern('[0-9]*')]]
    });

    this.verificationCodeControl = this.fb.control('',
      [Validators.required, Validators.minLength(6), Validators.maxLength(6)]);
  }

  private obtainPhoneNumber(): string {
    return this.phoneGroup.get('prefix').value + this.phoneGroup.get('first').value +
      this.phoneGroup.get('second').value + this.phoneGroup.get('third').value;
  }
}
