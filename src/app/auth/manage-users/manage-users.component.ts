import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '@app/services/firestore/firestore.service';
import { User } from '@app/auth/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {

  public users$: Observable<User[]>;

  constructor(private firestoreService: FirestoreService) {
  }

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.users$ = this.firestoreService.usersList$;
  }
}
