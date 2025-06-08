import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Darkmode } from './darkmode.component';

describe('Darkmode', () => {
  let component: Darkmode;
  let fixture: ComponentFixture<Darkmode>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Darkmode]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Darkmode);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
