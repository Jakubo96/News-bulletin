import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '@app/services/firestore/firestore.service';
import { User } from '@app/auth/user';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {

  public user: User;
  public userGroup: FormGroup;
  public userId: string;

  private unsubscribe$ = new Subject();

  get name(): AbstractControl {
    return this.userGroup.get('name');
  }

  get email(): AbstractControl {
    return this.userGroup.get('email');
  }

  constructor(private fb: FormBuilder, private route: ActivatedRoute,
              private firestoreService: FirestoreService) {
  }

  ngOnInit() {
    this.loadUser();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private loadUser(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.firestoreService.getUser(this.userId)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(user => {
        this.user = user;
        this.buildForm();
      });
  }

  private buildForm(): void {
    this.userGroup = this.fb.group({
      name: [this.user.name || '', Validators.required],
      email: [this.user.email || '', [Validators.required, Validators.email]],
    });
  }

  public onSubmit(): void {
    this.firestoreService.updateUser({name: this.name.value, email: this.email.value, id: this.userId});
  }
}
