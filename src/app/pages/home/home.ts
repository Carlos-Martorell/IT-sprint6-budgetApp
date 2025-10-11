import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BudgetService } from '@core/services/budget';
import { CommonModule } from '@angular/common';
import { BudgetsListComponent } from '@shared/components/budgets-list/budgets-list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule ,ReactiveFormsModule, BudgetsListComponent],
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


// Signal para controlar QUÉ modal está abierto ('closed', 'pages', 'languages')
// Usamos 'closed' como valor inicial.
public activeHelpModal = signal<'closed' | 'pages' | 'languages'>('closed');

// Método para abrir el modal específico (llamado por los nuevos botones)
public openHelpModal(type: 'pages' | 'languages'): void {
  this.activeHelpModal.set(type);
}

// Método para cerrar el modal
public closeHelpModal(): void {
  this.activeHelpModal.set('closed');
}


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

  //formulario
  fb = inject(FormBuilder);
  clientForm: FormGroup;

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

      this.clientForm = this.fb.group({
        clientName: ['', Validators.required],
        clientPhone: ['', Validators.required],
        clientEmail: ['', [Validators.required, Validators.email]]
      });


  }

  saveBudget(): void {
    if (this.clientForm.valid) {
      this.budgetService.saveBudget(
        this.clientForm.get('clientName')!.value,
        this.clientForm.get('clientPhone')!.value,
        this.clientForm.get('clientEmail')!.value
      );

      this.clientForm.reset();
      this.mainForm.reset({ seo: false, ads: false, web: false });
      this.panelForm.reset({ numPages: 1, numLanguages: 1 });
      alert('Presupuesto guardado con éxito!');

    } else {
      alert('Por favor, rellena todos los campos del cliente.');
    }
  }

}
