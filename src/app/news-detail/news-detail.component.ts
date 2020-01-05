import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { News } from '@app/news-list/news';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit {

  private newsDoc: AngularFirestoreDocument<News>;
  public newsItem: Observable<News>;

  constructor(private route: ActivatedRoute,
              private afs: AngularFirestore) {
  }

  ngOnInit() {
    this.loadProductDetails();
  }

  private loadProductDetails() {
    const id = this.route.snapshot.paramMap.get('id');
    this.newsDoc = this.afs.doc<News>(`news/${id}`);
    this.newsItem = this.newsDoc.valueChanges();
  }
}
