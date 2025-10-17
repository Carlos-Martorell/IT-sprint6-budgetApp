import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { BudgetsListComponent } from './budgets-list';
import { BudgetService } from '@core/services/budget';

describe('BudgetsListComponent', () => {
  let component: BudgetsListComponent;
  let fixture: ComponentFixture<BudgetsListComponent>;
  let budgetService: jasmine.SpyObj<BudgetService>;

  // Mock de presupuestos para testing
  const mockBudgets = [
    {
      id: 1,
      clientName: 'Juan Pérez',
      clientPhone: '666-111111',
      clientEmail: 'juan@test.com',
      totalPrice: 1200,
      creationDate: new Date('2024-01-15'),
      selectedOptions: [
        { id: 1, name: 'Hacer una campaña SEO', price: 300, selected: true },
        { id: 3, name: 'Hacer una página web', price: 500, selected: true }
      ],
      numPages: 5,
      numLanguages: 2
    },
    {
      id: 2,
      clientName: 'Ana García',
      clientPhone: '666-222222',
      clientEmail: 'ana@test.com',
      totalPrice: 800,
      creationDate: new Date('2024-02-20'),
      selectedOptions: [
        { id: 2, name: 'Hacer una campaña de publicidad', price: 400, selected: true }
      ],
      numPages: 1,
      numLanguages: 1
    },
    {
      id: 3,
      clientName: 'Carlos López',
      clientPhone: '666-333333',
      clientEmail: 'carlos@test.com',
      totalPrice: 1500,
      creationDate: new Date('2024-01-10'),
      selectedOptions: [
        { id: 1, name: 'Hacer una campaña SEO', price: 300, selected: true },
        { id: 2, name: 'Hacer una campaña de publicidad', price: 400, selected: true },
        { id: 3, name: 'Hacer una página web', price: 500, selected: true }
      ],
      numPages: 10,
      numLanguages: 3
    }
  ];

  beforeEach(async () => {
    // Crear mock de BudgetService
    const budgetServiceSpy = jasmine.createSpyObj('BudgetService', ['getBudgets']);
    budgetServiceSpy.getBudgets.and.returnValue(signal(mockBudgets));

    await TestBed.configureTestingModule({
      imports: [BudgetsListComponent],
      providers: [
        { provide: BudgetService, useValue: budgetServiceSpy }
      ]
    }).compileComponents();

    budgetService = TestBed.inject(BudgetService) as jasmine.SpyObj<BudgetService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BudgetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ===================================================================
  // A. PRUEBAS DE CREACIÓN E INICIALIZACIÓN
  // ===================================================================

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with budgets from service', () => {
    expect(component.budgets()).toEqual(mockBudgets);
  });

  it('should initialize with default sort key as "date"', () => {
    expect(component.sortKey()).toBe('date');
  });

  it('should initialize with empty search term', () => {
    expect(component.searchTerm()).toBe('');
  });

  // ===================================================================
  // B. PRUEBAS DE BÚSQUEDA
  // ===================================================================

  it('should filter budgets by client name (case insensitive)', () => {
    component.searchTerm.set('ana');

    const filtered = component.filteredAndSortedBudgets();

    expect(filtered.length).toBe(1);
    expect(filtered[0].clientName).toBe('Ana García');
  });

  it('should filter budgets with partial match', () => {
    component.searchTerm.set('pér');

    const filtered = component.filteredAndSortedBudgets();

    expect(filtered.length).toBe(1);
    expect(filtered[0].clientName).toBe('Juan Pérez');
  });

  it('should return all budgets when search term is empty', () => {
    component.searchTerm.set('');

    const filtered = component.filteredAndSortedBudgets();

    expect(filtered.length).toBe(3);
  });

  it('should return empty array when no budgets match search', () => {
    component.searchTerm.set('xyz123');

    const filtered = component.filteredAndSortedBudgets();

    expect(filtered.length).toBe(0);
  });

  it('should update search term when onSearch is called', () => {
    const mockEvent = {
      target: { value: 'test search' }
    } as any;

    component.onSearch(mockEvent);

    expect(component.searchTerm()).toBe('test search');
  });

  // ===================================================================
  // C. PRUEBAS DE ORDENAMIENTO
  // ===================================================================

  it('should sort budgets by date (most recent first) by default', () => {
    const sorted = component.filteredAndSortedBudgets();

    // Orden esperado: 2024-02-20, 2024-01-15, 2024-01-10
    expect(sorted[0].clientName).toBe('Ana García');
    expect(sorted[1].clientName).toBe('Juan Pérez');
    expect(sorted[2].clientName).toBe('Carlos López');
  });

  it('should sort budgets by price (highest first)', () => {
    component.setSortKey('price');

    const sorted = component.filteredAndSortedBudgets();

    // Orden esperado: 1500, 1200, 800
    expect(sorted[0].totalPrice).toBe(1500);
    expect(sorted[1].totalPrice).toBe(1200);
    expect(sorted[2].totalPrice).toBe(800);
  });

  it('should sort budgets alphabetically by name', () => {
    component.setSortKey('name');

    const sorted = component.filteredAndSortedBudgets();

    // Orden alfabético: Ana, Carlos, Juan
    expect(sorted[0].clientName).toBe('Ana García');
    expect(sorted[1].clientName).toBe('Carlos López');
    expect(sorted[2].clientName).toBe('Juan Pérez');
  });

  it('should update sort key when setSortKey is called', () => {
    component.setSortKey('price');
    expect(component.sortKey()).toBe('price');

    component.setSortKey('name');
    expect(component.sortKey()).toBe('name');
  });

  // ===================================================================
  // D. PRUEBAS DE FILTRADO + ORDENAMIENTO COMBINADOS
  // ===================================================================

  it('should filter and sort budgets together', () => {
    // Agregar más presupuestos con mismo nombre parcial
    const extendedBudgets = [
      ...mockBudgets,
      {
        id: 4,
        clientName: 'Ana Martínez',
        clientPhone: '666-444444',
        clientEmail: 'ana2@test.com',
        totalPrice: 1000,
        creationDate: new Date('2024-03-01'),
        selectedOptions: [
          { id: 1, name: 'Hacer una campaña SEO', price: 300, selected: true }
        ],
        numPages: 1,
        numLanguages: 1
      }
    ];

    budgetService.getBudgets.and.returnValue(signal(extendedBudgets));

    // Recrear el componente con el nuevo mock
    fixture = TestBed.createComponent(BudgetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.searchTerm.set('ana');
    component.setSortKey('price');

    const result = component.filteredAndSortedBudgets();

    expect(result.length).toBe(2);
    expect(result[0].totalPrice).toBe(1000); // Mayor precio primero
    expect(result[1].totalPrice).toBe(800);
  });

  // ===================================================================
  // E. PRUEBAS DE ESTILOS DE BOTONES
  // ===================================================================

  it('should return active classes for selected sort key', () => {
    component.setSortKey('price');

    const classes = component.getButtonClasses('price');

    expect(classes).toContain('bg-indigo-700');
    expect(classes).toContain('font-bold');
    expect(classes).toContain('shadow-md');
  });

  it('should return inactive classes for non-selected sort key', () => {
    component.setSortKey('date');

    const classes = component.getButtonClasses('price');

    expect(classes).toContain('bg-indigo-500');
    expect(classes).toContain('hover:bg-indigo-600');
    expect(classes).not.toContain('bg-indigo-700');
  });

  it('should always include base classes', () => {
    const classes = component.getButtonClasses('date');

    expect(classes).toContain('px-3');
    expect(classes).toContain('py-1');
    expect(classes).toContain('text-sm');
    expect(classes).toContain('rounded-lg');
    expect(classes).toContain('transition');
    expect(classes).toContain('text-white');
  });

  // ===================================================================
  // F. PRUEBAS DE CASOS EDGE
  // ===================================================================

  it('should handle empty budgets list', () => {
    budgetService.getBudgets.and.returnValue(signal([]));

    // Recrear el componente con el nuevo mock
    fixture = TestBed.createComponent(BudgetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const result = component.filteredAndSortedBudgets();

    expect(result.length).toBe(0);
  });

  it('should handle budgets with same date', () => {
    const sameDateBudgets = [
      { ...mockBudgets[0], creationDate: new Date('2024-01-15') },
      { ...mockBudgets[1], creationDate: new Date('2024-01-15') }
    ];

    budgetService.getBudgets.and.returnValue(signal(sameDateBudgets));

    // Recrear el componente con el nuevo mock
    fixture = TestBed.createComponent(BudgetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const result = component.filteredAndSortedBudgets();

    expect(result.length).toBe(2);
  });

  it('should handle budgets with same price', () => {
    const samePriceBudgets = [
      { ...mockBudgets[0], totalPrice: 1000 },
      { ...mockBudgets[1], totalPrice: 1000 }
    ];

    budgetService.getBudgets.and.returnValue(signal(samePriceBudgets));

    // Recrear el componente con el nuevo mock
    fixture = TestBed.createComponent(BudgetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.setSortKey('price');

    const result = component.filteredAndSortedBudgets();

    expect(result.length).toBe(2);
  });
});
