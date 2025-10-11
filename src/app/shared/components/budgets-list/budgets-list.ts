import { Component, inject } from '@angular/core';

import { NgFor, DatePipe, DecimalPipe } from '@angular/common'; // Necesario para pipes y loops
import { BudgetService } from '../../../core/services/budget';

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
}
