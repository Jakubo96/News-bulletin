import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '@app/services/firestore/firestore.service';
import { Router } from '@angular/router';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.scss']
})
export class CreateNewsComponent implements OnInit {

  get title(): AbstractControl {
    return this.newsForm.get('title');
  }

  get content(): AbstractControl {
    return this.newsForm.get('content');
  }

  constructor(private fb: FormBuilder,
              private firestoreService: FirestoreService,
              private router: Router) {
  }

  public newsForm: FormGroup;
  public files: NgxFileDropEntry[] = [];
  public allowedFormats = ['.jpg', '.png', '.jpeg'];

  ngOnInit() {
    this.buildForm();
  }

  public dropped(files: NgxFileDropEntry[]): void {
    for (const droppedFile of files) {
      if (this.isFileAllowed(droppedFile)) {
        this.files.push(droppedFile);

        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          console.log(droppedFile.relativePath, file);
        });
      }
    }
  }

  private isFileAllowed(droppedFile: NgxFileDropEntry): boolean {
    return droppedFile.fileEntry.isFile &&
      this.allowedFormats.some(format => droppedFile.relativePath.endsWith(format)) &&
      !this.files.some(file => file.relativePath === droppedFile.relativePath);
  }

  public async onSubmit(): Promise<void> {
    const docId = await this.firestoreService.createNewsDoc({content: this.content.value, title: this.title.value});

    this.router.navigate(['/news', docId]);
  }

  private buildForm(): void {
    this.newsForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }
}
