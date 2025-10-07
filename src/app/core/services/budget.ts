import { computed, Injectable, signal } from '@angular/core';
import { ServiceOption } from '../models/budget';

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
  this.options.update(options => options.map(option => option.id === id ? { ...option, selected : isSelected } : option));

}

numPages = signal(1);
numLanguages = signal(1);

updatePanelSettings(pages: number, languages: number): void {
  this.numPages.set(pages);
  this.numLanguages.set(languages);
}



constructor() {

}
}
