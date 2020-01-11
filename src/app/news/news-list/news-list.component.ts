import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { News } from '@app/news/news';
import { FirestoreService } from '@app/services/firestore/firestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/auth/user';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit {

  public newsList$: Observable<News[]>;
  public user$: Observable<User>;

  constructor(private firestoreService: FirestoreService, private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.loadNewsList();
  }

  private loadNewsList(): void {
    const userId = this.route.snapshot.queryParamMap.get('userId');

    if (userId) {
      this.newsList$ = this.firestoreService.getNewsForGivenUser(userId);
      this.user$ = this.firestoreService.getUser(userId);
    } else {
      this.newsList$ = this.firestoreService.newsList$;
    }
  }
}
