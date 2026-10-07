import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovementsTable } from './movements-table';

describe('MovementsTable', () => {
  let component: MovementsTable;
  let fixture: ComponentFixture<MovementsTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovementsTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovementsTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
