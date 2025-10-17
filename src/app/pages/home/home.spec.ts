// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { HomeComponent } from './home';

// describe('HomeComponent', () => {
//   let component: HomeComponent;
//   let fixture: ComponentFixture<HomeComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [HomeComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(HomeComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

import { HomeComponent } from './home';
import { BudgetService } from '@core/services/budget';
import { FormUrlSyncService } from '@core/services/form-url-sync';

// 1. Mock de BudgetService
// Solo necesitamos simular los métodos que el HomeComponent llama.
const mockBudgetService = {
  totalPrice: () => 1200, // Simulamos un precio fijo
  getBudgets: () => [/* ... */],
  saveBudget: jasmine.createSpy('saveBudget'),
  updateOptionSelection: jasmine.createSpy('updateOptionSelection'),
  updatePanelSettings: jasmine.createSpy('updatePanelSettings'),
  // Simulamos las signals que usa el componente
  numPages: () => 1,
  numLanguages: () => 1,
  options: () => []
};

// 2. Mock de FormUrlSyncService
const mockFormUrlSyncService = {
  applyParamsToForms: jasmine.createSpy('applyParamsToForms'),
  updateUrl: jasmine.createSpy('updateUrl'),
};


describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let budgetService: any;
  let formUrlSyncService: any;

  beforeEach(async () => {
    // Configuración del TestBed
    await TestBed.configureTestingModule({
      // Importamos módulos necesarios para el componente
      imports: [
        ReactiveFormsModule,
        RouterTestingModule, // Necesario si usa ActivatedRoute o Router (indirectamente por el FormUrlSyncService)
        HomeComponent, // Si es standalone
      ],
      // Proveemos los mocks de los servicios
      providers: [
        FormBuilder,
        { provide: BudgetService, useValue: mockBudgetService },
        { provide: FormUrlSyncService, useValue: mockFormUrlSyncService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    // Obtenemos la instancia del componente y de los servicios mockeados
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    // Obtenemos las referencias a los mocks inyectados
    budgetService = TestBed.inject(BudgetService);
    formUrlSyncService = TestBed.inject(FormUrlSyncService);

    fixture.detectChanges(); // Inicia la detección de cambios (llama a ngOnInit)
  });

  it('should create the component and initialize forms', () => {
    expect(component).toBeTruthy();
    expect(component.mainForm).toBeDefined();
    expect(component.panelForm).toBeDefined();
  });

// ----------------------------------------------------------------------
// A. PRUEBAS DE INICIALIZACIÓN (ngOnInit)
// ----------------------------------------------------------------------

  it('should call FormUrlSyncService.applyParamsToForms on initialization', () => {
    // Al ser llamado en ngOnInit, esperamos que haya sido llamado
    expect(formUrlSyncService.applyParamsToForms).toHaveBeenCalled();
  });

  it('should subscribe to form value changes and call updateUrl on the first change', () => {
    // Hacemos un cambio en el formulario
    component.mainForm.controls['seo'].setValue(true);

    // El servicio updateUrl debería ser llamado con los nuevos valores
    expect(formUrlSyncService.updateUrl).toHaveBeenCalled();
    const [mainValues, panelValues] = formUrlSyncService.updateUrl.calls.mostRecent().args;

    expect(mainValues.seo).toBe(true);
    // Nota: El testing de RxJS (observables) puede ser más complejo,
    // pero esta simple interacción verifica que el subscribe funcione.
  });

// ----------------------------------------------------------------------
// B. PRUEBAS DE ACCIÓN (onSaveBudget)
// ----------------------------------------------------------------------

  it('should call BudgetService.saveBudget when onSaveBudget is called', () => {
    // Llenamos el formulario de cliente
    component.clientForm.setValue({
      clientName: 'Juan Pérez',
      clientPhone: '555-1234',
      clientEmail: 'juan@perez.com'
    });

    // Llamamos a la función de guardado
    component.onSaveBudget();

    // Esperamos que el servicio de presupuesto sea llamado con los datos correctos
    expect(budgetService.saveBudget).toHaveBeenCalledWith(
      'Juan Pérez',
      '555-1234',
      'juan@perez.com'
    );
  });

  it('should NOT call saveBudget if the client form is invalid', () => {
    // Cliente Formulario vacío o inválido (depende de tus validadores)
    component.clientForm.controls['clientName'].setValue(null);
    component.onSaveBudget();

    expect(budgetService.saveBudget).not.toHaveBeenCalled();
  });
});
