import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolitcsComponent } from './politcs.component';

describe('PolitcsComponent', () => {
  let component: PolitcsComponent;
  let fixture: ComponentFixture<PolitcsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolitcsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolitcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
