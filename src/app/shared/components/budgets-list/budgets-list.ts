import { Component, computed, inject, signal } from '@angular/core';
import {  DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { BudgetService } from '@core/services/budget';
import { SortKey } from '@core/models/budget-models';

@Component({
  selector: 'app-budgets-list',
  standalone: true,
  imports: [ DatePipe, DecimalPipe, NgClass],
  templateUrl: './budgets-list.html'
})
export class BudgetsListComponent {
  private budgetService = inject(BudgetService);

  budgets = this.budgetService.getBudgets();
  sortKey = signal<SortKey>('date');
  searchTerm = signal('');

filteredAndSortedBudgets = computed(() => {
  const key = this.sortKey();
  const term = this.searchTerm().toLowerCase();
  let list = this.budgets();

  if (term) {
    list = list.filter(budget =>
      budget.clientName.toLowerCase().includes(term)
    );
  }

  const sortedList = [...list];

  if (key === 'date') {
    sortedList.sort((a, b) => b.creationDate.getTime() - a.creationDate.getTime());
  } else if (key === 'price') {
    sortedList.sort((a, b) => b.totalPrice - a.totalPrice);
  } else if (key === 'name') {
    sortedList.sort((a, b) => a.clientName.localeCompare(b.clientName));
  }

  return sortedList;
});


onSearch(event: Event): void {
  const input = event.target as HTMLInputElement;
  this.searchTerm.set(input.value);
}

 setSortKey(key: SortKey): void {
   this.sortKey.set(key);
 }

 getButtonClasses(key: SortKey): string {
   const base = 'px-3 py-1 text-sm rounded-lg transition text-white';
   const active = 'bg-indigo-700 font-bold shadow-md';
   const inactive = 'bg-indigo-500 hover:bg-indigo-600';

   return this.sortKey() === key ? `${base} ${active}` : `${base} ${inactive}`;
 }
}

