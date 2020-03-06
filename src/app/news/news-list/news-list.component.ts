import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { News } from '@app/news/news';
import { FirestoreService } from '@app/services/firestore/firestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@app/auth/user';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit, OnDestroy {

  public newsList$: Observable<News[]>;
  public newsListPage: News[];
  public user$: Observable<User>;

  private _page = 1;
  private page$ = new BehaviorSubject<number>(this._page);

  get page(): number {
    return this._page;
  }

  set page(value: number) {
    this._page = value;
    this.page$.next(value);
  }

  public pageSize = 12;

  constructor(private firestoreService: FirestoreService, private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

    this.loadNewsList();
  }

  ngOnDestroy() {
  }

  private loadNewsList(): void {
    const userId = this.route.snapshot.queryParamMap.get('userId');

    if (userId) {
      this.newsList$ = this.firestoreService.getNewsForGivenUser(userId);
      this.user$ = this.firestoreService.getUser(userId);
    } else {
      this.newsList$ = this.firestoreService.newsList$;
    }

    combineLatest([
      this.newsList$, this.page$])
      .subscribe(([news, page]) =>
        this.newsListPage = news.slice(this.pageSize * (page - 1), this.pageSize * page));
  }
}
