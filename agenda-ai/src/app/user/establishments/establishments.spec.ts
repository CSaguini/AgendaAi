import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Establishments } from './establishments';

describe('Establishments', () => {
  let component: Establishments;
  let fixture: ComponentFixture<Establishments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Establishments]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Establishments);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
