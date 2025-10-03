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

totalPrice = computed(() => {
  return this.options().filter(option => option.selected)
    .reduce((total, option) => total + option.price, 0)});

updateOptionSelection(id: number, isSelected: boolean): void {
  this.options.update(options => options.map(option => option.id === id ? { ...option, selected : isSelected } : option));

}
constructor() {

}
}
