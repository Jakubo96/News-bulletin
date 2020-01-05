import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { News } from '@app/news/news';
import { FirestoreCollections } from '@app/services/firestore/firestore-collections';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private _newsCollection: AngularFirestoreCollection<News>;
  private _newsList: Observable<News[]>;

  public get newsList() {
    return this._newsList;
  }

  constructor(private afs: AngularFirestore) {
    this.initializeNews();
  }

  private initializeNews() {
    this._newsCollection = this.afs.collection<News>(FirestoreCollections.NEWS);
    this._newsList = this._newsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as News;
        const id = a.payload.doc.id;

        return {id, ...data};
      }))
    );
  }

  public getNewsItem(id: string): Observable<News> {
    const newsDoc = this.afs.doc<News>(`${FirestoreCollections.NEWS}/${id}`);
    return newsDoc.snapshotChanges().pipe(
      map(source => {
          const data = source.payload.data() as News;

          return {id, ...data};
        }
      ));
  }
}
