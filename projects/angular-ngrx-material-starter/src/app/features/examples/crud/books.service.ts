import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const endpoint = 'http://localhost:52773/rest/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class BooksService {
  constructor(private http: HttpClient) {}

  private extractData(res: Response) {
    const body = res;
    console.log(body);
    return body || {};
  }

  getBooks(): Observable<any> {
    return this.http.get(endpoint + 'books').pipe(map(this.extractData));
  }
}
