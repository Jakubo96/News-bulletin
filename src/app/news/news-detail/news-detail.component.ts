import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { News } from '@app/news/news';
import { Observable } from 'rxjs';
import { FirestoreService } from '@app/services/firestore/firestore.service';
import { WindowService } from '@app/auth/login/phone-login/window.service';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit, AfterViewChecked {

  private newsId: string;
  public newsItem$: Observable<News>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private firestoreService: FirestoreService,
              private windowService: WindowService) {
  }

  ngOnInit() {
    this.loadProductDetails();
  }

  private loadProductDetails(): void {
    this.newsId = this.route.snapshot.paramMap.get('id');
    this.newsItem$ = this.firestoreService.getNewsItem(this.newsId);
  }

  public deleteDocument(): void {
    this.firestoreService.removeNews(this.newsId);

    this.router.navigate(['/news']);
  }

  editDocument(): void {
    this.router.navigate(['/create', this.newsId]);
  }

  ngAfterViewChecked(): void {
    this.windowService.windowRef.FB.XFBML.parse();
  }
}
