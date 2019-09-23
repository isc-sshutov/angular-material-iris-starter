import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from './books.model';

const endpoint = 'http://localhost:52773/rest/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json; charset=utf-8'
  })
};

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  constructor(private http: HttpClient) {}

  private extractData(res: Response) {
    const body = res;
    return body || {};
  }

  getAllBooks(): Observable<any> {
    return this.http.get(endpoint + 'books').pipe(map(this.extractData));
  }

  getBook(id: string): Observable<any> {
    return this.http.get(endpoint + 'book/' + id).pipe(map(this.extractData));
  }

  deleteBook(id: string): Observable<any> {
    return this.http
      .delete(endpoint + 'book/' + id)
      .pipe(map(this.extractData));
  }

  editBook(book: Book): Observable<any> {
    return this.http.put(endpoint + 'book/' + book.id, book, httpOptions);
  }

  newBook(book: Book): Observable<any> {
    return this.http.post(endpoint + 'books', book);
  }
}
