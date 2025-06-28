import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Filterbutton } from './filterbutton.component';

describe('Filterbutton', () => {
  let component: Filterbutton;
  let fixture: ComponentFixture<Filterbutton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Filterbutton]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Filterbutton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
