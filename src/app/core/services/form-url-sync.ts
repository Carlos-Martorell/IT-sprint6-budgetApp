import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup } from '@angular/forms';
import { MainFormValues, PanelFormValues } from '@core/models/budget';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormUrlSyncService {

  private router = inject(Router);
  private route = inject(ActivatedRoute);


  public readUrlAndApplyToForm(mainForm: FormGroup, panelForm: FormGroup) {

    return this.route.queryParams.pipe(
        tap(params => {
            const options = { emitEvent: false };

            // 🛑 APLICAR LÓGICA DE BOOLEANOS
            mainForm.patchValue({
                seo: params['seo'] === 'true',
                ads: params['ads'] === 'true',
                web: params['web'] === 'true',
            }, options);

            // 🛑 APLICAR LÓGICA DE NÚMEROS
            const numPages = parseInt(params['pages'] || '1', 10);
            const numLanguages = parseInt(params['langs'] || '1', 10);

            panelForm.patchValue({
                numPages: numPages,
                numLanguages: numLanguages,
            }, options);
        })
    );
}

  public updateUrl(mainValue: MainFormValues, panelValue: PanelFormValues): void {
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
}
