import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { News } from '@app/news/news';
import { FirestoreService } from '@app/services/firestore/firestore.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit {

  public newsList$: Observable<News[]>;

  constructor(private firestoreService: FirestoreService) {
  }

  ngOnInit() {
    this.loadNewsList();
  }

  private loadNewsList(): void {
    this.newsList$ = this.firestoreService.newsList$;
  }
}
