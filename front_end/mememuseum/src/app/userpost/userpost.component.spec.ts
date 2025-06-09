import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Userpost } from './userpost.component';

describe('Userpost', () => {
  let component: Userpost;
  let fixture: ComponentFixture<Userpost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Userpost]
    })
      .compileComponents();

    fixture = TestBed.createComponent(Userpost);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
