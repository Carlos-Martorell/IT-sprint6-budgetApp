import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  public panelForm = new FormGroup({
    numPages: new FormControl(1, [Validators.required, Validators.min(1)]),
    numLanguages: new FormControl(1, [Validators.required, Validators.min(1)]),
  });

  public budgetService = inject(BudgetService);
  //panel
  public updatePanelValue(controlName: 'numPages' | 'numLanguages', change: 1 | -1): void {
    const control = this.panelForm.get(controlName); // Obtiene el FormControl específico

    if (control) {
      let currentValue = control.value as number;
      let newValue = currentValue + change;

      // Validamos que el valor nunca sea menor a 1 (lo mismo que el Validators.min(1))
      if (newValue < 1) {
        newValue = 1;
      }

      // ⬅️ Actualizamos el FormControl, lo que dispara el valueChanges (paso 2)
      control.setValue(newValue);
    }
  }


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
      //panel
      this.panelForm.valueChanges.subscribe(values => {
        if (this.panelForm.valid) {
          this.budgetService.updatePanelSettings(
            values.numPages ?? 1,
            values.numLanguages ?? 1
          );
        }
      });
  }

}
