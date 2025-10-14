import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BudgetService } from '@core/services/budget';
import { CommonModule } from '@angular/common';
import { BudgetsListComponent } from '@shared/components/budgets-list/budgets-list';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MainFormValues, PanelFormValues } from '@core/models/budget';

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

  private router = inject(Router);
  private route = inject(ActivatedRoute);


public activeHelpModal = signal<'closed' | 'pages' | 'languages'>('closed');

public openHelpModal(type: 'pages' | 'languages'): void {
  this.activeHelpModal.set(type);
}
public closeHelpModal(): void {
  this.activeHelpModal.set('closed');
}

  public budgetService = inject(BudgetService);

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
    this.route.queryParams.subscribe(params => {
      this.loadFormFromUrl(params);
    });

    this.mainForm.valueChanges.subscribe(value => {
      this.updateUrl(value, this.panelForm.value);
    });

    this.panelForm.valueChanges.subscribe(values => {
      this.updateUrl(this.mainForm.value, values);
    });
  }

loadFormFromUrl(params: Params): void {
  const options = { emitEvent: false };

  this.mainForm.patchValue({
    seo: params['seo'] === 'true',
    ads: params['ads'] === 'true',
    web: params['web'] === 'true',
  }, options);

  const numPages = parseInt(params['pages'] || '1', 10);
  const numLanguages = parseInt(params['langs'] || '1', 10);

  this.panelForm.patchValue({
    numPages: numPages,
    numLanguages: numLanguages,
  }, options);


  this.budgetService.updateOptionSelection(1, params['seo'] === 'true');
  this.budgetService.updateOptionSelection(2, params['ads'] === 'true');
  this.budgetService.updateOptionSelection(3, params['web'] === 'true');
  this.budgetService.updatePanelSettings(numPages, numLanguages);
}


updateUrl(mainValue: MainFormValues, panelValue: PanelFormValues): void {
  const queryParams: Params = {};


  if (mainValue.seo) queryParams['seo'] = 'true';
  if (mainValue.ads) queryParams['ads'] = 'true';
  if (mainValue.web) queryParams['web'] = 'true';


  if (mainValue.web) {
    if ((panelValue.numPages ?? 0) > 1) queryParams['pages'] = panelValue.numPages;
    if ((panelValue.numLanguages ?? 0) > 1) queryParams['langs'] = panelValue.numLanguages;
  }

  this.router.navigate([], {
    relativeTo: this.route,
    queryParams: queryParams,
    queryParamsHandling: 'merge',
    replaceUrl: true
  });
}




//
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
