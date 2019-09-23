import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, NgForm } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ROUTE_ANIMATIONS_ELEMENTS } from 'app/core/core.module';

import { Book } from '../books.model';
import { BooksService } from '../books.service';

@Component({
  selector: 'anms-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.scss']
})
export class CrudComponent implements OnInit {
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  bookFormGroup = this.fb.group(CrudComponent.createBook());
  books$: Observable<Book[]>;
  selectedBook: Book;

  isEditing: boolean;

  static createBook(): Book {
    return {
      id: '',
      title: '',
      author: '',
      description: ''
    };
  }

  constructor(
    public fb: FormBuilder,
    public rest: BooksService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.reloadData();
    // subscribe to the parameters observable
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.rest.getBook(id).subscribe((book: Book) => {
          this.selectedBook = book;
        });
      } else {
        this.selectedBook = null;
      }
    });
  }

  reloadData() {
    this.books$ = this.rest.getAllBooks();
  }

  select(book: Book) {
    this.isEditing = false;
    this.router.navigate(['examples/crud', book.id]);
  }

  deselect() {
    this.isEditing = false;
    this.router.navigate(['examples/crud']);
  }

  edit(book: Book) {
    this.isEditing = true;
    this.bookFormGroup.setValue(book);
  }

  addNew(bookForm: NgForm) {
    bookForm.resetForm();
    this.bookFormGroup.reset();
    this.bookFormGroup.setValue(CrudComponent.createBook());
    this.isEditing = true;
  }

  cancelEditing() {
    this.isEditing = false;
  }

  delete(book: Book) {
    this.rest.deleteBook(book.id).subscribe(() => {
      this.router.navigate(['examples/crud']);
      this.isEditing = false;
      this.reloadData();
    });
  }

  save() {
    if (!this.bookFormGroup.valid) return;
    const book = this.bookFormGroup.value;
    let restCall: Observable<any>;
    if (book.id) {
      restCall = this.rest.editBook(book);
    } else {
      restCall = this.rest.newBook(book);
    }
    restCall.subscribe(() => {
      this.router.navigate(['examples/crud']);
      this.isEditing = false;
      this.reloadData();
    });
  }
}
