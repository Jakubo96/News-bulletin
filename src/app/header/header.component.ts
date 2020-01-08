import { Component } from '@angular/core';
import { FirebaseAuthService } from '@app/auth/firebase-auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  constructor(public firebaseAuth: FirebaseAuthService, private router: Router) {
  }

  public async logout(): Promise<void> {
    await this.firebaseAuth.logout();
    this.router.navigate(['/news']);
  }
}
