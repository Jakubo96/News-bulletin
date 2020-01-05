import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { News } from '@app/news/news';
import { Observable } from 'rxjs';
import { FirestoreService } from '@app/services/firestore/firestore.service';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit {

  public newsItem$: Observable<News>;

  constructor(private route: ActivatedRoute,
              private firestoreService: FirestoreService) {
  }

  ngOnInit() {
    this.loadProductDetails();
  }

  private loadProductDetails(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.newsItem$ = this.firestoreService.getNewsItem(id);
  }
}
