import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsListItemPinBtnComponent } from './events-list-item-pin-btn.component';

describe('EventsListItemPinBtnComponent', () => {
  let component: EventsListItemPinBtnComponent;
  let fixture: ComponentFixture<EventsListItemPinBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsListItemPinBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsListItemPinBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
