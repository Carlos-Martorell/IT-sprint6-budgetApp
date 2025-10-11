import { Component, computed, inject, signal } from '@angular/core';
import { NgFor, DatePipe, DecimalPipe } from '@angular/common'; // Necesario para pipes y loops
import { BudgetService } from '@core/services/budget';
import { SortKey } from '@core/models/budget';

@Component({
  selector: 'app-budgets-list',
  standalone: true,
  imports: [NgFor, DatePipe, DecimalPipe],
  template: `
    <h2 class="text-xl font-bold mb-4">Listado de Presupuestos ({{ budgets().length }})</h2>

    @if (budgets().length === 0) {
      <p class="text-gray-500 text-center p-4 border rounded-lg">Aún no hay presupuestos guardados.</p>
    } @else {
      <div class="space-y-4">
        @for (budget of budgets(); track budget.id) {
          <div class="p-4 border rounded-lg shadow-sm bg-white">
            <div class="font-bold text-lg mb-1">{{ budget.clientName }} - {{ budget.totalPrice | number:'1.2-2' }} €</div>
            <div class="text-sm text-gray-600">
              <p>Email: {{ budget.clientEmail }} | Teléfono: {{ budget.clientPhone }}</p>
              <p>Fecha: {{ budget.creationDate | date:'short' }}</p>
            </div>
            </div>
        }
      </div>
    }
  `,
  // Simplificado, puedes poner el CSS que necesites
  styles: ``
})
export class BudgetsListComponent {
  private budgetService = inject(BudgetService);

  // 🛑 Acceso al Signal del servicio
  budgets = this.budgetService.getBudgets();

 // 🛑 Signal para almacenar el criterio de ordenación actual (por defecto: 'date')
 sortKey = signal<SortKey>('date');

 // 🛑 Signal COMPUTED: Se recalcula automáticamente cuando budgets() o sortKey() cambian
 sortedBudgets = computed(() => {
   const key = this.sortKey();
   const list = this.budgets();

   // 1. Clonar la lista para evitar mutar el Signal original
   const sortedList = [...list];

   // 2. Lógica de Ordenación
   if (key === 'date') {
     // Ordena por fecha de más reciente a más antiguo (Date.getTime() o el objeto Date directamente)
     sortedList.sort((a, b) => b.creationDate.getTime() - a.creationDate.getTime());
   } else if (key === 'price') {
     // Ordena de precio más alto a más bajo
     sortedList.sort((a, b) => b.totalPrice - a.totalPrice);
   } else if (key === 'name') {
     // Ordena alfabéticamente por nombre del cliente
     sortedList.sort((a, b) => a.clientName.localeCompare(b.clientName));
   }

   return sortedList;
 });

 // Método para cambiar la clave de ordenación
 setSortKey(key: SortKey): void {
   this.sortKey.set(key);
 }

 // Método de ayuda para las clases de los botones (opcional, mejora la legibilidad del HTML)
 getButtonClasses(key: SortKey): string {
   const base = 'px-3 py-1 text-sm rounded-lg transition text-white';
   const active = 'bg-indigo-700 font-bold shadow-md';
   const inactive = 'bg-indigo-500 hover:bg-indigo-600';

   return this.sortKey() === key ? `${base} ${active}` : `${base} ${inactive}`;
 }
}

