import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirestoreService } from '@app/services/firestore/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-news',
  templateUrl: './create-news.component.html',
  styleUrls: ['./create-news.component.scss']
})
export class CreateNewsComponent implements OnInit {

  public newsForm: FormGroup;

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

  ngOnInit() {
    this.buildForm();
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
