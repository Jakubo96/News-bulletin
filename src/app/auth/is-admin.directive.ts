import { Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FirebaseAuthService } from '@app/auth/firebase-auth.service';
import { map, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[appIsAdmin]'
})
export class IsAdminDirective implements OnInit, OnDestroy {

  public isVisible = false;

  private unsubscribe$ = new Subject();

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private firebaseAuth: FirebaseAuthService
  ) {
  }

  public ngOnInit() {
    this.updateTemplateState();
  }

  public ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private updateTemplateState(): void {
    this.checkPermissions().subscribe(isPermitted => {
      if (isPermitted && !this.isVisible) {
        this.isVisible = true;
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else if (!isPermitted) {
        this.isVisible = false;
        this.viewContainerRef.clear();
      }
    });
  }

  private checkPermissions(): Observable<boolean> {
    return this.firebaseAuth.user.pipe(
      takeUntil(this.unsubscribe$),
      map(user => user && user.roles.admin)
    );
  }
}
