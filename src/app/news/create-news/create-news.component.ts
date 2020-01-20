import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '@app/services/firestore/firestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { Subject } from 'rxjs';
import { finalize, takeUntil, tap } from 'rxjs/operators';
import { FirebaseAuthService } from '@app/auth/services/firebase-auth.service';
import { User } from '@app/auth/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.scss']
})
export class CreateNewsComponent implements OnInit, OnDestroy {

  get title(): AbstractControl {
    return this.newsForm.get('title');
  }

  get content(): AbstractControl {
    return this.newsForm.get('content');
  }

  private unsubscribe$ = new Subject();
  private newsId: string;

  public newsForm: FormGroup;
  public allowedFormats = ['.jpg', '.png', '.jpeg'];
  public imagesUrls: string[] = [];
  public imagesDuringUpload = 0;

  constructor(private fb: FormBuilder,
              private firestoreService: FirestoreService,
              private firebaseAuth: FirebaseAuthService,
              private router: Router, private toastr: ToastrService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.buildForm();
    this.loadNewsData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public dropped(files: NgxFileDropEntry[]): void {
    for (const droppedFile of files) {
      if (this.isFileAllowed(droppedFile)) {
        ++this.imagesDuringUpload;

        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) =>
          this.firestoreService.uploadFile(droppedFile.relativePath, file)
            .pipe(finalize(() => --this.imagesDuringUpload), takeUntil(this.unsubscribe$))
            .subscribe(() => undefined, () => undefined,
              () => this.firestoreService.getFileUrl(droppedFile.relativePath)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(url => {
                  this.imagesUrls.push(url);
                  this.toastr.success(null, 'Image uploaded');
                })));
      }
    }
  }

  private isFileAllowed(droppedFile: NgxFileDropEntry): boolean {
    return droppedFile.fileEntry.isFile &&
      this.allowedFormats.some(format => droppedFile.relativePath.toLowerCase().endsWith(format));
  }

  public async onSubmit(): Promise<void> {
    if (!this.newsId) {
      const docId = await this.firestoreService
        .createNews({
          content: this.content.value,
          title: this.title.value,
          imagesUrls: this.imagesUrls,
          author: {
            id: this.firebaseAuth.user.value.id,
            name: this.firebaseAuth.user.value.name,
            email: this.firebaseAuth.user.value.email
          },
          modified: Date.now(),
          created: Date.now()
        });

      this.toastr.success('News created');
      this.router.navigate(['/news', docId]);
    } else {
      await this.firestoreService
        .updateNews({
          content: this.content.value,
          title: this.title.value,
          imagesUrls: this.imagesUrls,
          id: this.newsId,
          modified: Date.now()
        });

      this.toastr.warning('News edited');
      this.router.navigate(['/news', this.newsId]);
    }
  }

  public onImageRemoved(urlId: number): void {
    this.imagesUrls.splice(urlId, 1);
    this.toastr.error(null, 'Image removed');
  }

  private buildForm(): void {
    this.newsForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  private loadNewsData(): void {
    this.newsId = this.route.snapshot.paramMap.get('id');
    if (!this.newsId) {
      return;
    }

    this.firestoreService.getNews(this.newsId)
      .pipe(
        tap(news => {
          if (!this.canUserModifyThisNews(news.author)) {
            this.router.navigate(['/unauthorized']);
          }
        }),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(newsItem => {
        this.title.setValue(newsItem.title);
        this.content.setValue(newsItem.content);
        this.imagesUrls = newsItem.imagesUrls;
      });
  }

  private canUserModifyThisNews(author: Partial<User>): boolean {
    const loggedInUser = this.firebaseAuth.user.value;

    return loggedInUser.roles.author && author.id === loggedInUser.id || loggedInUser.roles.admin;
  }
}
