import { computed, Injectable, signal } from '@angular/core';
import { ServiceOption, Budget } from '../models/budget';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

options = signal<ServiceOption[]> ([
  { id: 1, name: 'Hacer una campaña SEO', price: 300, selected: false },
  { id: 2, name: 'Hacer una campaña de publicidad', price: 400, selected: false },
  { id: 3, name: 'Hacer una página web', price: 500, selected: false },
]);

PRICE_PER_MODULE = 30

totalPrice = computed(() => {
  const baseCost = this.options().filter(option => option.selected)
    .reduce((total, option) => total + option.price, 0)

    // Coste por cada PÁGINA ADICIONAL y cada IDIOMA ADICIONAL
   const pagesMultiplier = Math.max(0, this.numPages() - 1); // Si es 1, el resultado es 0
   const languagesMultiplier = Math.max(0, this.numLanguages() - 1); // Si es 1, el resultado es 0
   const costPages = pagesMultiplier * this.PRICE_PER_MODULE;
   const costLanguages = languagesMultiplier * this.PRICE_PER_MODULE;
   const panelExtra = costPages + costLanguages;

   const webSelected = this.options().find(opt => opt.id === 3)?.selected;
   const extraCost = webSelected ? panelExtra : 0;
   return baseCost + extraCost;

});

updateOptionSelection(id: number, isSelected: boolean): void {
  this.options.update(options => options.map(option => option.id === id ? { ...option, selected : isSelected } : option));}

numPages = signal(1);
numLanguages = signal(1);

updatePanelSettings(pages: number, languages: number): void {
  this.numPages.set(pages);
  this.numLanguages.set(languages);
}


private budgets = signal<Budget[]>([]);
getBudgets() {
  return this.budgets.asReadonly();
}

// Contador para asignar IDs
private nextBudgetId = 1;
saveBudget(clientName: string, clientPhone: string, clientEmail: string): void {
 //Clonar el estado actual del presupuesto
  const newBudget: Budget = {
    id: this.nextBudgetId++, // Asignar ID
    clientName: clientName,
    clientPhone: clientPhone,
    clientEmail: clientEmail,
    selectedOptions: this.options().filter(opt => opt.selected), // Solo guardar las seleccionadas
    numPages: this.numPages(),
    numLanguages: this.numLanguages(),
    totalPrice: this.totalPrice(),
    creationDate: new Date()
  };

  this.budgets.update(currentBudgets => [...currentBudgets, newBudget]);
  // Reiniciar el estado del presupuesto
  this.options.update(options => options.map(option => ({ ...option, selected: false })));
  this.numPages.set(1);
  this.numLanguages.set(1);



}

}
