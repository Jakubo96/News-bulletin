import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { News } from '@app/news/news';
import { Observable } from 'rxjs';
import { FirestoreService } from '@app/services/firestore/firestore.service';
import { WindowService } from '@app/auth/login/phone-login/window.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-news-detail',
  templateUrl: './news-detail.component.html',
  styleUrls: ['./news-detail.component.scss']
})
export class NewsDetailComponent implements OnInit, AfterViewChecked {

  private newsId: string;
  public newsItem$: Observable<News>;

  constructor(private route: ActivatedRoute,
              private router: Router, private toastr: ToastrService,
              private firestoreService: FirestoreService,
              private windowService: WindowService) {
  }

  ngOnInit() {
    this.loadProductDetails();
  }

  ngAfterViewChecked(): void {
    this.windowService.windowRef.FB.XFBML.parse();
  }

  private loadProductDetails(): void {
    this.newsId = this.route.snapshot.paramMap.get('id');
    this.newsItem$ = this.firestoreService.getNews(this.newsId);
  }

  public deleteDocument(): void {
    this.firestoreService.removeNews(this.newsId);

    this.toastr.error(null, 'News removed');
    this.router.navigate(['/news']);
  }

  public editDocument(): void {
    this.router.navigate(['/create', this.newsId]);
  }

  public getDate(created: number): Date {
    return new Date(created);
  }
}
