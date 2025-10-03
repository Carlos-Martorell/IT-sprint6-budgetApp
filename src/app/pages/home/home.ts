import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BudgetService } from '../../core/services/budget';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule ,ReactiveFormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  public mainForm = new FormGroup({
    seo: new FormControl(false),
    ads: new FormControl(false),
    web: new FormControl(false),
  });

  public budgetService = inject(BudgetService);

  constructor() {

      // Suscripción 1: SEO
      this.mainForm.controls.seo.valueChanges.subscribe(selected => {
        this.budgetService.updateOptionSelection(1, selected ?? false);
      });

      // Suscripción 2: Publicidad (ID 2)
      this.mainForm.controls.ads.valueChanges.subscribe(selected => {
        this.budgetService.updateOptionSelection(2, selected ?? false);
      });

      // Suscripción 3: Web (ID 3)
      this.mainForm.controls.web.valueChanges.subscribe(selected => {
        this.budgetService.updateOptionSelection(3, selected ?? false);
      });
  }

}
