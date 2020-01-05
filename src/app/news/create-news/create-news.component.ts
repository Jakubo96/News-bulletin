import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '@app/services/firestore/firestore.service';
import { Router } from '@angular/router';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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

  public newsForm: FormGroup;
  private unsubscribe$ = new Subject();

  public images: NgxFileDropEntry[] = [];
  public allowedFormats = ['.jpg', '.png', '.jpeg'];
  public imagesUrls: string[] = [];

  constructor(private fb: FormBuilder,
              private firestoreService: FirestoreService,
              private router: Router) {
  }

  ngOnInit() {
    this.buildForm();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  public dropped(files: NgxFileDropEntry[]): void {
    for (const droppedFile of files) {
      if (this.isFileAllowed(droppedFile)) {
        this.images.push(droppedFile);

        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) =>
          this.firestoreService.uploadFile(droppedFile.relativePath, file)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(() => undefined, () => undefined,
              () => this.firestoreService.getFileUrl(droppedFile.relativePath)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe(url => this.imagesUrls.push(url))));
      }
    }
  }

  private isFileAllowed(droppedFile: NgxFileDropEntry): boolean {
    return droppedFile.fileEntry.isFile &&
      this.allowedFormats.some(format => droppedFile.relativePath.endsWith(format)) &&
      !this.images.some(file => file.relativePath === droppedFile.relativePath);
  }

  public async onSubmit(): Promise<void> {
    const docId = await this.firestoreService
      .createNewsDoc({content: this.content.value, title: this.title.value, imagesUrls: this.imagesUrls});

    this.router.navigate(['/news', docId]);
  }

  private buildForm(): void {
    this.newsForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }
}
