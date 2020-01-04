import { Component, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { News } from '@app/news-list/news';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent implements OnInit {

  private newsCollection: AngularFirestoreCollection<News>;
  public newsList: Observable<News[]>;

  constructor(private afs: AngularFirestore) {
    this.newsCollection = afs.collection<News>('news');
    this.newsList = this.newsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as News;
        const id = a.payload.doc.id;

        return {id, ...data};
      }))
    );
  }

  ngOnInit() {
  }

}
