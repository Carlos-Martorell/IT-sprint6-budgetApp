import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetsList } from './budgets-list';

describe('BudgetsList', () => {
  let component: BudgetsList;
  let fixture: ComponentFixture<BudgetsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
