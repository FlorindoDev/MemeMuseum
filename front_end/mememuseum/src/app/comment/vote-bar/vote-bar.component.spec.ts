import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoteBar } from './vote-bar.component';

describe('VoteBar', () => {
  let component: VoteBar;
  let fixture: ComponentFixture<VoteBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoteBar]
    })
      .compileComponents();

    fixture = TestBed.createComponent(VoteBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
