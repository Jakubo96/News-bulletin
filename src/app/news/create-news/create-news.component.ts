import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '@app/services/firestore/firestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

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
              private router: Router,
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
                .subscribe(url => this.imagesUrls.push(url))));
      }
    }
  }

  private isFileAllowed(droppedFile: NgxFileDropEntry): boolean {
    return droppedFile.fileEntry.isFile &&
      this.allowedFormats.some(format => droppedFile.relativePath.endsWith(format));
  }

  public async onSubmit(): Promise<void> {
    if (!this.newsId) {
      const docId = await this.firestoreService
        .createNewsDoc({content: this.content.value, title: this.title.value, imagesUrls: this.imagesUrls});

      this.router.navigate(['/news', docId]);
    } else {
      await this.firestoreService
        .updateDoc({
          content: this.content.value,
          title: this.title.value,
          imagesUrls: this.imagesUrls,
          id: this.newsId
        });

      this.router.navigate(['/news', this.newsId]);
    }
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

    this.firestoreService.getNewsItem(this.newsId)
      .pipe(
        takeUntil(this.unsubscribe$)
      )
      .subscribe(newsItem => {
        this.title.setValue(newsItem.title);
        this.content.setValue(newsItem.content);
        this.imagesUrls = newsItem.imagesUrls;
      });
  }
}
