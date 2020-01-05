import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { News } from '@app/news/news';
import { FirestoreCollections } from '@app/services/firestore/firestore-collections';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  private _newsCollection: AngularFirestoreCollection<News>;
  private _newsList$: Observable<News[]>;

  private _newsDocs = new Map<string, AngularFirestoreDocument<News>>();
  private _newsItems$ = new Map<string, Observable<News>>();

  public get newsList$(): Observable<News[]> {
    return this._newsList$;
  }

  constructor(private afs: AngularFirestore, private storage: AngularFireStorage) {
    this.initializeNews();
  }

  private initializeNews() {
    this._newsCollection = this.afs.collection<News>(FirestoreCollections.NEWS);
    this._newsList$ = this._newsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as News;
        const id = a.payload.doc.id;

        return {id, ...data};
      }))
    );
  }

  public getNewsItem(id: string): Observable<News> {
    if (this._newsItems$.has(id)) {
      return this._newsItems$.get(id);
    }

    const {newsItem} = this.loadNewNews(id);


    return newsItem;
  }

  public async createNewsDoc(item: News): Promise<string> {
    const res = await this._newsCollection.add(item);

    return res.id;
  }

  public updateDoc(item: News): void {
    this.getNewsDoc(item.id).update(item);

    this.initializeNews();
  }

  public removeDoc(id: string): void {
    this.getNewsDoc(id).delete();

    this._newsDocs.delete(id);
    this._newsItems$.delete(id);

    this.initializeNews();
  }

  public uploadFile(filePath: string, file: Blob): Observable<any> {
    const ref = this.storage.ref(filePath);

    return ref.put(file).snapshotChanges();
  }

  public getFileUrl(filePath: string): Observable<string> {
    return this.storage.ref(filePath).getDownloadURL();
  }

  private getNewsDoc(id: string): AngularFirestoreDocument<News> {
    if (this._newsDocs.has(id)) {
      return this._newsDocs.get(id);
    }

    const {newsDoc} = this.loadNewNews(id);

    return newsDoc;
  }

  private loadNewNews(id: string): { newsDoc: AngularFirestoreDocument<News>, newsItem: Observable<News> } {
    const newsDoc = this.afs.doc<News>(`${FirestoreCollections.NEWS}/${id}`);

    const newsItem = newsDoc.snapshotChanges().pipe(
      map(source => {
          const data = source.payload.data() as News;

          return {id, ...data};
        }
      ));

    this._newsDocs.set(id, newsDoc);
    this._newsItems$.set(id, newsItem);

    return {newsDoc, newsItem};
  }
}
