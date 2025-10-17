

// import { TestBed } from '@angular/core/testing';
// import { FormUrlSyncService } from './form-url-sync';
// import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
// import { RouterTestingModule } from '@angular/router/testing';
// import { FormGroup, FormControl } from '@angular/forms';
// import { Params } from '@angular/router';

// // 1. Mock para simular el Router y espiar el método navigate
// class MockRouter {
//   navigate = jasmine.createSpy('navigate');
// }

// // 2. Mock para simular el ActivatedRoute, especialmente los parámetros
// class MockActivatedRoute {
//   // Un objeto que simula la ruta actual
//   snapshot = {
//     paramMap: convertToParamMap({})
//   };
// }

// describe('FormUrlSyncService', () => {
//   let service: FormUrlSyncService;
//   let mockRouter: MockRouter;
//   let mockRoute: MockActivatedRoute;
//   let mainForm: FormGroup;
//   let panelForm: FormGroup;

//   beforeEach(() => {
//     // Inicialización de Mocks
//     mockRouter = new MockRouter();
//     mockRoute = new MockActivatedRoute();

//     TestBed.configureTestingModule({
//       // Usamos el TestBed para inyectar el servicio con sus mocks de dependencias
//       providers: [
//         FormUrlSyncService,
//         { provide: Router, useValue: mockRouter },
//         { provide: ActivatedRoute, useValue: mockRoute },
//       ],
//       // No necesitamos RouterTestingModule si mockeamos Router y ActivatedRoute
//     });

//     service = TestBed.inject(FormUrlSyncService);

//     // Inicialización de Formularios
//     mainForm = new FormGroup({
//       seo: new FormControl(false),
//       ads: new FormControl(false),
//       web: new FormControl(false),
//     });

//     panelForm = new FormGroup({
//       numPages: new FormControl(1),
//       numLanguages: new FormControl(1),
//     });
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   // -------------------------------------------------------------------
//   // A. PRUEBAS DE APLICACIÓN DE PARÁMETROS (applyParamsToForms)
//   // -------------------------------------------------------------------

//   describe('applyParamsToForms', () => {

//     it('should correctly apply URL parameters (SEO=true, langs=3)', () => {
//       const params: Params = { seo: 'true', langs: '3' };
//       service.applyParamsToForms(params, mainForm, panelForm);

//       expect(mainForm.value.seo).toBe(true);
//       expect(mainForm.value.ads).toBe(false); // No está en params
//       expect(mainForm.value.web).toBe(false);

//       expect(panelForm.value.numPages).toBe(1); // No está en params, usa '1' por defecto
//       expect(panelForm.value.numLanguages).toBe(3); // '3' convertido a número
//     });

//     it('should default to 1 if page/langs parameters are missing', () => {
//       const params: Params = { web: 'true' };
//       service.applyParamsToForms(params, mainForm, panelForm);

//       expect(mainForm.value.web).toBe(true);
//       expect(panelForm.value.numPages).toBe(1);
//       expect(panelForm.value.numLanguages).toBe(1);
//     });
//   });

//   // -------------------------------------------------------------------
//   // B. PRUEBAS DE ACTUALIZACIÓN DE URL (updateUrl)
//   // -------------------------------------------------------------------

//   describe('updateUrl', () => {

//     it('should correctly set query params for base services (SEO & ADS)', () => {
//       const mainValue = { seo: true, ads: true, web: false };
//       const panelValue = { numPages: 1, numLanguages: 1 };

//       service.updateUrl(mainValue, panelValue);

//       expect(mockRouter.navigate).toHaveBeenCalledWith(
//         [],
//         jasmine.objectContaining({
//           queryParams: { seo: 'true', ads: 'true' },
//           queryParamsHandling: '',
//           replaceUrl: true
//         })
//       );
//     });

//     it('should include pages and langs if WEB is selected and values > 1', () => {
//       const mainValue = { seo: false, ads: false, web: true };
//       const panelValue = { numPages: 5, numLanguages: 2 };

//       service.updateUrl(mainValue, panelValue);

//       expect(mockRouter.navigate).toHaveBeenCalledWith(
//         [],
//         jasmine.objectContaining({
//           queryParams: { web: 'true', pages: 5, langs: 2 },
//         })
//       );
//     });

//     it('should OMIT pages/langs if WEB is selected but values are 1', () => {
//       const mainValue = { seo: false, ads: false, web: true };
//       const panelValue = { numPages: 1, numLanguages: 1 }; // Valores por defecto

//       service.updateUrl(mainValue, panelValue);

//       expect(mockRouter.navigate).toHaveBeenCalledWith(
//         [],
//         jasmine.objectContaining({
//           queryParams: { web: 'true' }, // Solo 'web', sin 'pages' ni 'langs'
//         })
//       );
//     });

//     it('should OMIT pages/langs if WEB is NOT selected, regardless of panel values', () => {
//         const mainValue = { seo: true, ads: false, web: false };
//         const panelValue = { numPages: 10, numLanguages: 10 }; // Valores altos

//         service.updateUrl(mainValue, panelValue);

//         expect(mockRouter.navigate).toHaveBeenCalledWith(
//             [],
//             jasmine.objectContaining({
//                 queryParams: { seo: 'true' }, // Solo 'seo', sin 'pages' ni 'langs'
//             })
//         );
//     });
//   });
// });

import { TestBed } from '@angular/core/testing';
import { FormUrlSyncService } from './form-url-sync';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { of } from 'rxjs';

describe('FormUrlSyncService', () => {
  let service: FormUrlSyncService;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let mainForm: FormGroup;
  let panelForm: FormGroup;

  beforeEach(() => {
    // Crear Spy Objects para Router (más limpio en Angular 20)
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Mock de ActivatedRoute con estructura completa
    mockActivatedRoute = {
      snapshot: {
        paramMap: new Map(),
        queryParamMap: new Map(),
      },
      params: of({}),
      queryParams: of({}),
    };

    TestBed.configureTestingModule({
      providers: [
        FormUrlSyncService,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    service = TestBed.inject(FormUrlSyncService);

    // Inicialización de Formularios
    mainForm = new FormGroup({
      seo: new FormControl(false),
      ads: new FormControl(false),
      web: new FormControl(false),
    });

    panelForm = new FormGroup({
      numPages: new FormControl(1),
      numLanguages: new FormControl(1),
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // -------------------------------------------------------------------
  // A. PRUEBAS DE APLICACIÓN DE PARÁMETROS (applyParamsToForms)
  // -------------------------------------------------------------------

  describe('applyParamsToForms', () => {
    it('should correctly apply URL parameters (SEO=true, langs=3)', () => {
      const params = { seo: 'true', langs: '3' };
      service.applyParamsToForms(params, mainForm, panelForm);

      expect(mainForm.value.seo).toBe(true);
      expect(mainForm.value.ads).toBe(false);
      expect(mainForm.value.web).toBe(false);
      expect(panelForm.value.numPages).toBe(1);
      expect(panelForm.value.numLanguages).toBe(3);
    });

    it('should default to 1 if page/langs parameters are missing', () => {
      const params = { web: 'true' };
      service.applyParamsToForms(params, mainForm, panelForm);

      expect(mainForm.value.web).toBe(true);
      expect(panelForm.value.numPages).toBe(1);
      expect(panelForm.value.numLanguages).toBe(1);
    });

    it('should handle empty params object', () => {
      const params = {};
      service.applyParamsToForms(params, mainForm, panelForm);

      expect(mainForm.value.seo).toBe(false);
      expect(mainForm.value.ads).toBe(false);
      expect(mainForm.value.web).toBe(false);
      expect(panelForm.value.numPages).toBe(1);
      expect(panelForm.value.numLanguages).toBe(1);
    });

    it('should handle string params for pages/langs', () => {
      const params = { web: 'true', pages: '5', langs: '2' };
      service.applyParamsToForms(params, mainForm, panelForm);

      expect(panelForm.value.numPages).toBe(5);
      expect(panelForm.value.numLanguages).toBe(2);
    });
  });

  // -------------------------------------------------------------------
  // B. PRUEBAS DE ACTUALIZACIÓN DE URL (updateUrl)
  // -------------------------------------------------------------------

  describe('updateUrl', () => {
    it('should correctly set query params for base services (SEO & ADS)', () => {
      const mainValue = { seo: true, ads: true, web: false };
      const panelValue = { numPages: 1, numLanguages: 1 };

      service.updateUrl(mainValue, panelValue);

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        [],
        jasmine.objectContaining({
          queryParams: { seo: 'true', ads: 'true' },
          queryParamsHandling: '',
          replaceUrl: true,
        })
      );
    });

    it('should include pages and langs if WEB is selected and values > 1', () => {
      const mainValue = { seo: false, ads: false, web: true };
      const panelValue = { numPages: 5, numLanguages: 2 };

      service.updateUrl(mainValue, panelValue);

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        [],
        jasmine.objectContaining({
          queryParams: { web: 'true', pages: 5, langs: 2 },
        })
      );
    });

    it('should OMIT pages/langs if WEB is selected but values are 1', () => {
      const mainValue = { seo: false, ads: false, web: true };
      const panelValue = { numPages: 1, numLanguages: 1 };

      service.updateUrl(mainValue, panelValue);

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        [],
        jasmine.objectContaining({
          queryParams: { web: 'true' },
        })
      );
    });

    it('should OMIT pages/langs if WEB is NOT selected, regardless of panel values', () => {
      const mainValue = { seo: true, ads: false, web: false };
      const panelValue = { numPages: 10, numLanguages: 10 };

      service.updateUrl(mainValue, panelValue);

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        [],
        jasmine.objectContaining({
          queryParams: { seo: 'true' },
        })
      );
    });

    it('should handle all services selected with panel values', () => {
      const mainValue = { seo: true, ads: true, web: true };
      const panelValue = { numPages: 3, numLanguages: 4 };

      service.updateUrl(mainValue, panelValue);

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        [],
        jasmine.objectContaining({
          queryParams: {
            seo: 'true',
            ads: 'true',
            web: 'true',
            pages: 3,
            langs: 4,
          },
        })
      );
    });

    it('should call navigate with relativeTo option', () => {
      const mainValue = { seo: true, ads: false, web: false };
      const panelValue = { numPages: 1, numLanguages: 1 };

      service.updateUrl(mainValue, panelValue);

      const callArgs = mockRouter.navigate.calls.mostRecent().args;
      expect(callArgs[1]).toEqual(
        jasmine.objectContaining({
          relativeTo: mockActivatedRoute,
        })
      );
    });
  });
});
