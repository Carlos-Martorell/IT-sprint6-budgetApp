import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BudgetService } from '@core/services/budget';
import { CommonModule } from '@angular/common';
import { BudgetsListComponent } from '@shared/components/budgets-list/budgets-list';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MainFormValues, PanelFormValues } from '@core/models/budget';
import { FormUrlSyncService } from '@core/services/form-url-sync';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule ,ReactiveFormsModule, BudgetsListComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  public mainForm = new FormGroup({
    seo: new FormControl(false),
    ads: new FormControl(false),
    web: new FormControl(false),
  });
  public panelForm = new FormGroup({
    numPages: new FormControl(1, [Validators.required, Validators.min(1)]),
    numLanguages: new FormControl(1, [Validators.required, Validators.min(1)]),
  });

  private urlSyncService = inject(FormUrlSyncService);

public activeHelpModal = signal<'closed' | 'pages' | 'languages'>('closed');

public openHelpModal(type: 'pages' | 'languages'): void {
  this.activeHelpModal.set(type);
}
public closeHelpModal(): void {
  this.activeHelpModal.set('closed');
}

public budgetService = inject(BudgetService);

public updatePanelValue(controlName: 'numPages' | 'numLanguages', change: 1 | -1): void {
  const control = this.panelForm.get(controlName);

  if (control) {
    let currentValue = control.value as number;
    let newValue = currentValue + change;

    if (newValue < 1) {
      newValue = 1;
    }

    control.setValue(newValue);
  }
}

fb = inject(FormBuilder);
clientForm: FormGroup;

constructor() {

  this.clientForm = this.fb.group({
    clientName: ['', Validators.required],
    clientPhone: ['', Validators.required],
    clientEmail: ['', [Validators.required, Validators.email]]
  });


}



ngOnInit(): void {

  this.urlSyncService.readUrlAndApplyToForm(this.mainForm, this.panelForm)
      .subscribe(params => {

          const numPages = parseInt(params['pages'] || '1', 10);
          const numLanguages = parseInt(params['langs'] || '1', 10);

          this.budgetService.updateOptionSelection(1, params['seo'] === 'true');
          this.budgetService.updateOptionSelection(2, params['ads'] === 'true');
          this.budgetService.updateOptionSelection(3, params['web'] === 'true');
          this.budgetService.updatePanelSettings(numPages, numLanguages);
      });


  this.mainForm.valueChanges.subscribe(value => {
    this.urlSyncService.updateUrl(value, this.panelForm.value);
  });

  this.panelForm.valueChanges.subscribe(values => {
    this.urlSyncService.updateUrl(this.mainForm.value, values);
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
