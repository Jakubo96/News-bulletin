import { AbstractControl } from '@angular/forms';

export class PasswordValidation {

  public static matchPassword(control: AbstractControl): { isEqual: boolean } {
    if (control.get('password').value === control.get('repeatedPassword').value) {
      return null;
    } else {
      control.get('repeatedPassword').setErrors({MatchPassword: true});
    }
  }
}
