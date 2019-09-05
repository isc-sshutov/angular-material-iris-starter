import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { SharedModule } from '../../../../shared/shared.module';

import { State } from '../../examples.state';
import { CrudComponent } from './crud.component';
import { BookListComponent } from './book-list.component';
import { BooksService } from '../books.service';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CrudComponent', () => {
  let component: CrudComponent;
  let fixture: ComponentFixture<CrudComponent>;
  let store: MockStore<State>;
  let booksService: BooksService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
        NoopAnimationsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot()
      ],
      providers: [
        provideMockStore({
          initialState: {
            examples: {
              books: {
                ids: [],
                entities: {}
              }
            }
          }
        }),
        BooksService
      ],
      declarations: [CrudComponent, BookListComponent]
    }).compileComponents();
    store = TestBed.get(Store);
    fixture = TestBed.createComponent(CrudComponent);
    component = fixture.componentInstance;
    booksService = TestBed.get(BooksService);
    spyOn(booksService, 'getBooks').and.returnValue(of([]));
    fixture.detectChanges();
  }));
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
