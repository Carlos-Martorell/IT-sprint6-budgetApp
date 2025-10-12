import { Component, computed, inject, signal } from '@angular/core';
import {  DatePipe, DecimalPipe, NgClass } from '@angular/common';
import { BudgetService } from '@core/services/budget';
import { SortKey } from '@core/models/budget';

@Component({
  selector: 'app-budgets-list',
  standalone: true,
  imports: [ DatePipe, DecimalPipe, NgClass],
  template: `
   <h2 class="text-xl font-bold mb-4">Listado de Presupuestos ({{ budgets().length }})</h2>

@if (budgets().length === 0) {
  <p class="text-gray-500 text-center p-4 border rounded-lg">Aún no hay presupuestos guardados.</p>
} @else {
  <div class="mb-4">
        <input type="text"
               (input)="onSearch($event)"
               placeholder="🔍 Buscar por nombre de cliente..."
               class="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition">
  </div>
  <div class="mb-6 flex space-x-5 justify-start">
    <span class="self-center font-medium text-gray-700">Ordenar por:</span>
    <button (click)="setSortKey('date')"
            [ngClass]="getButtonClasses('date')">
      Fecha
    </button>
    <button (click)="setSortKey('price')"
            [ngClass]="getButtonClasses('price')">
      Precio
    </button>
    <button (click)="setSortKey('name')"
            [ngClass]="getButtonClasses('name')">
      Alfabéticamente
    </button>
  </div>
  <div class="space-y-4">
    @for (budget of filteredAndSortedBudgets(); track budget.id) {
      <div class="p-4 border rounded-lg shadow-sm bg-white">
        <div class="font-bold text-lg mb-1">{{ budget.clientName }} - {{ budget.totalPrice | number:'1.2-2' }} €</div>
        <div class="text-sm text-gray-600">
          <p>Email: {{ budget.clientEmail }} | Teléfono: {{ budget.clientPhone }}</p>
          <p>Fecha: {{ budget.creationDate | date:'short' }}</p>
        </div>
        </div>
    }
  </div>
}`

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

