import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Observable } from 'rxjs';
import { FirebaseAuthService } from '@app/auth/services/firebase-auth.service';
import { map } from 'rxjs/operators';

@Directive({
  selector: '[appIsCreatorOrAdmin]'
})
export class IsCreatorOrAdminDirective implements OnInit, OnDestroy {

  @Input() public appIsCreatorOrAdmin: string;

  public isVisible = false;

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
      map(user => user && (user.roles.author && this.appIsCreatorOrAdmin === user.id || user.roles.admin))
    );
  }
}
