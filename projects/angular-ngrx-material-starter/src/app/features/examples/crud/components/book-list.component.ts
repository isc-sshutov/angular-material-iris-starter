import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { ROUTE_ANIMATIONS_ELEMENTS } from 'app/core/core.module';
import { Observable } from 'rxjs';
import { Book } from '../books.model';
import { MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'anms-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  displayedColumns: string[] = ['id', 'title', 'author', 'description'];
  dataSource: MatTableDataSource<Book>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @Input()
  books$: Observable<Book>;

  @Output()
  select: EventEmitter<Book> = new EventEmitter<Book>();

  onSelect(book: Book) {
    this.select.emit(book);
  }
}
