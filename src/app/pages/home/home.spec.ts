import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { signal, NO_ERRORS_SCHEMA } from '@angular/core';

import { HomeComponent } from './home';
import { BudgetService } from '@core/services/budget';
import { FormUrlSyncService } from '@core/services/form-url-sync';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let budgetService: jasmine.SpyObj<BudgetService>;
  let formUrlSyncService: jasmine.SpyObj<FormUrlSyncService>;

  beforeEach(async () => {
    // Crear mocks con jasmine.SpyObj
    const budgetServiceSpy = jasmine.createSpyObj('BudgetService', [
      'saveBudget',
      'updateOptionSelection',
      'updatePanelSettings',
      'getBudgets'
    ]);

    // Agregar signals al mock manualmente
    (budgetServiceSpy as any).totalPrice = signal(1200);
    (budgetServiceSpy as any).numPages = signal(1);
    (budgetServiceSpy as any).numLanguages = signal(1);
    (budgetServiceSpy as any).options = signal([]);
    (budgetServiceSpy as any).budgets = signal([]);

    const formUrlSyncServiceSpy = jasmine.createSpyObj('FormUrlSyncService', [
      'applyParamsToForms',
      'updateUrl'
    ]);

    const mockActivatedRoute = {
      queryParams: of({ seo: 'true', pages: '3', langs: '2' }),
      snapshot: { paramMap: new Map() }
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        HomeComponent,
      ],
      providers: [
        FormBuilder,
        { provide: BudgetService, useValue: budgetServiceSpy },
        { provide: FormUrlSyncService, useValue: formUrlSyncServiceSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA] // ← Ignora BudgetsListComponent
    }).compileComponents();

    budgetService = TestBed.inject(BudgetService) as jasmine.SpyObj<BudgetService>;
    formUrlSyncService = TestBed.inject(FormUrlSyncService) as jasmine.SpyObj<FormUrlSyncService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;

    // NO llamar a detectChanges() aquí para evitar renderizar el template
    // fixture.detectChanges();
  });

  afterEach(() => {
    budgetService.saveBudget.calls.reset();
    budgetService.updateOptionSelection.calls.reset();
    budgetService.updatePanelSettings.calls.reset();
    formUrlSyncService.updateUrl.calls.reset();
  });

  // ===================================================================
  // A. PRUEBAS DE CREACIÓN Y INICIALIZACIÓN
  // ===================================================================

  it('should create the component', () => {
    expect(component).toBeTruthy();
    expect(component.mainForm).toBeDefined();
    expect(component.panelForm).toBeDefined();
    expect(component.clientForm).toBeDefined();
  });

  it('should initialize all forms correctly', () => {
    expect(component.mainForm.value).toEqual({
      seo: false,
      ads: false,
      web: false
    });

    expect(component.panelForm.value).toEqual({
      numPages: 1,
      numLanguages: 1
    });
  });

  it('should apply URL parameters and update services on ngOnInit', () => {
    // Llamar manualmente a ngOnInit en lugar de detectChanges
    component.ngOnInit();

    expect(formUrlSyncService.applyParamsToForms).toHaveBeenCalledWith(
      { seo: 'true', pages: '3', langs: '2' },
      component.mainForm,
      component.panelForm
    );

    expect(budgetService.updateOptionSelection).toHaveBeenCalledWith(1, true);
    expect(budgetService.updatePanelSettings).toHaveBeenCalledWith(3, 2);
  });

  // ===================================================================
  // B. PRUEBAS DE CAMBIOS EN FORMULARIOS
  // ===================================================================

  it('should update BudgetService and URL when mainForm changes', () => {
    // Inicializar el componente para activar las suscripciones
    component.ngOnInit();

    budgetService.updateOptionSelection.calls.reset();
    formUrlSyncService.updateUrl.calls.reset();

    component.mainForm.patchValue({ ads: true });

    expect(formUrlSyncService.updateUrl).toHaveBeenCalled();
    expect(budgetService.updateOptionSelection).toHaveBeenCalledWith(2, true);
  });

  it('should update BudgetService and URL when panelForm changes', () => {
    // Inicializar el componente para activar las suscripciones
    component.ngOnInit();

    budgetService.updatePanelSettings.calls.reset();
    formUrlSyncService.updateUrl.calls.reset();

    component.panelForm.patchValue({ numPages: 5, numLanguages: 2 });

    expect(budgetService.updatePanelSettings).toHaveBeenCalledWith(5, 2);
    expect(formUrlSyncService.updateUrl).toHaveBeenCalled();
  });

  // ===================================================================
  // C. PRUEBAS DE GUARDAR PRESUPUESTO
  // ===================================================================

  it('should save budget and reset forms when clientForm is VALID', () => {
    spyOn(window, 'alert');

    component.clientForm.patchValue({
      clientName: 'Juan Pérez',
      clientPhone: '666-123456',
      clientEmail: 'juan@test.com'
    });

    component.saveBudget();

    expect(budgetService.saveBudget).toHaveBeenCalledWith(
      'Juan Pérez',
      '666-123456',
      'juan@test.com'
    );

    expect(component.clientForm.get('clientName')?.value).toBeNull();
    expect(component.mainForm.value).toEqual({
      seo: false,
      ads: false,
      web: false
    });
    expect(component.panelForm.value).toEqual({
      numPages: 1,
      numLanguages: 1
    });

    expect(window.alert).toHaveBeenCalledWith('Presupuesto guardado con éxito!');
  });

  it('should NOT save budget if clientForm is INVALID', () => {
    spyOn(window, 'alert');

    component.clientForm.patchValue({
      clientName: 'Test',
      clientPhone: '',
      clientEmail: ''
    });

    component.saveBudget();

    expect(budgetService.saveBudget).not.toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith(
      'Por favor, rellena todos los campos del cliente.'
    );
  });

  // ===================================================================
  // D. PRUEBAS DE LÓGICA DE PANELES
  // ===================================================================

  it('should increment numPages when updatePanelValue is called with +1', () => {
    component.panelForm.get('numPages')?.setValue(3);
    component.updatePanelValue('numPages', 1);

    expect(component.panelForm.get('numPages')?.value).toBe(4);
  });

  it('should decrement numPages when updatePanelValue is called with -1', () => {
    component.panelForm.get('numPages')?.setValue(5);
    component.updatePanelValue('numPages', -1);

    expect(component.panelForm.get('numPages')?.value).toBe(4);
  });

  it('should enforce minimum of 1 for numPages', () => {
    component.panelForm.get('numPages')?.setValue(1);
    component.updatePanelValue('numPages', -1);

    expect(component.panelForm.get('numPages')?.value).toBe(1);
  });

  it('should increment and decrement numLanguages correctly', () => {
    const control = component.panelForm.get('numLanguages');

    control?.setValue(2);
    component.updatePanelValue('numLanguages', 1);
    expect(control?.value).toBe(3);

    component.updatePanelValue('numLanguages', -1);
    expect(control?.value).toBe(2);

    control?.setValue(1);
    component.updatePanelValue('numLanguages', -1);
    expect(control?.value).toBe(1);
  });

  // ===================================================================
  // E. PRUEBAS DE MODALES
  // ===================================================================

  it('should open and close help modal correctly', () => {
    expect(component.activeHelpModal()).toBe('closed');

    component.openHelpModal('pages');
    expect(component.activeHelpModal()).toBe('pages');

    component.openHelpModal('languages');
    expect(component.activeHelpModal()).toBe('languages');

    component.closeHelpModal();
    expect(component.activeHelpModal()).toBe('closed');
  });
});
