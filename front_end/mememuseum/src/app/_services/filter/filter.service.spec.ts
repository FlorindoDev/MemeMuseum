import { TestBed } from '@angular/core/testing';
import { FilterService } from './filter.service';
import { Meme } from '../meme/meme.type';
import { Filter } from '../meme/filter.type';

describe('Filter', () => {
  let service: FilterService<Meme, Filter>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
