import { AbstractControl } from '@angular/forms';

export class PasswordValidator {

  public static matchPasswords(control: AbstractControl): { isEqual: boolean } {
    if (control.get('password').value === control.get('repeatedPassword').value) {
      return null;
    } else {
      control.get('repeatedPassword').setErrors({MatchPassword: true});
    }
  }
}
