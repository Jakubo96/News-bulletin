import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FirestoreService } from '@app/services/firestore/firestore.service';
import { User } from '@app/auth/user';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FirebaseAuthService } from '@app/auth/services/firebase-auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {

  public editedUser: User;
  public userGroup: FormGroup;
  public userId: string;

  private unsubscribe$ = new Subject();

  get isThisUser(): boolean {
    return this.firebaseAuth.userValue.id === this.editedUser.id;
  }

  get name(): AbstractControl {
    return this.userGroup.get('name');
  }

  get email(): AbstractControl {
    return this.userGroup.get('email');
  }

  get author(): AbstractControl {
    return this.userGroup.get('author');
  }

  get admin(): AbstractControl {
    return this.userGroup.get('admin');
  }

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private toastr: ToastrService,
              private firestoreService: FirestoreService, private firebaseAuth: FirebaseAuthService,
              private router: Router) {
  }

  ngOnInit() {
    this.loadEditedUser();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private loadEditedUser(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.firestoreService.getUser(this.userId)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(user => {
        this.editedUser = user;
        this.buildForm();
      });
  }

  private buildForm(): void {
    this.userGroup = this.fb.group({
      name: this.editedUser.name || '',
      email: [this.editedUser.email || '', Validators.email],
      author: this.editedUser.roles.author,
      admin: this.editedUser.roles.admin,
    });
  }

  public onSubmit(): void {
    if (this.firebaseAuth.userValue.roles.admin) {
      this.firestoreService.updateUser({
        name: this.name.value,
        email: this.email.value,
        id: this.userId,
        roles: {author: this.author.value, admin: this.admin.value}
      });
    } else {
      this.firestoreService.updateUser({name: this.name.value, email: this.email.value, id: this.userId});
    }

    this.toastr.success(null, 'User updated');
  }

  public removeUser(): void {
    this.firestoreService.removeUser(this.userId);

    this.toastr.error(null, 'User removed');
    this.router.navigate(['/users']);
  }
}
