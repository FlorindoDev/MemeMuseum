import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpLoadMeme } from './up-load-meme.component';

describe('UpLoadMeme', () => {
  let component: UpLoadMeme;
  let fixture: ComponentFixture<UpLoadMeme>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpLoadMeme]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UpLoadMeme);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
