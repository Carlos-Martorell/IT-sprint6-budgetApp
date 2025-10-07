import { TestBed } from '@angular/core/testing';
import { BudgetService } from './budget';

describe('BudgetService (Lógica de Precios y Signals)', () => {
  let service: BudgetService;

  beforeEach(() => {
    service = new BudgetService();
    

    // Resetear el estado para cada test
    service.updateOptionSelection(1, false); // SEO
    service.updateOptionSelection(2, false); // ADS
    service.updateOptionSelection(3, false); // WEB
    service.updatePanelSettings(1, 1); // 1 página, 1 idioma
  });

  // ------------------------------------------------------------------
  // TEST DE INICIALIZACIÓN
  // ------------------------------------------------------------------
  it('should be created and initial price should be 0', () => {
    expect(service).toBeTruthy();
    expect(service.totalPrice()).toBe(0);
  });

  // ------------------------------------------------------------------
  // TEST DE CÁLCULO BASE (OPTIONS)
  // ------------------------------------------------------------------
  it('should calculate base cost correctly when SEO (300) and ADS (400) are selected', () => {
    service.updateOptionSelection(1, true);
    service.updateOptionSelection(2, true);
    expect(service.totalPrice()).toBe(700);
  });

  it('should calculate base cost correctly when only WEB (500) is selected', () => {
    service.updateOptionSelection(3, true);
    expect(service.totalPrice()).toBe(500);
  });

  // ------------------------------------------------------------------
  // TEST DE COSTES ADICIONALES (FÓRMULA ADITIVA)
  // ------------------------------------------------------------------

  it('should calculate extra cost for pages if Web is selected (4 Pages, 1 Lang)', () => {
    service.updateOptionSelection(3, true); // Web (500)
    service.updatePanelSettings(4, 1); // 3 páginas extra * 30€ = 90€
    // Precio: 500 (Base) + 90 (Extra) = 590
    expect(service.totalPrice()).toBe(590);
  });

  it('should calculate extra cost for languages if Web is selected (1 Page, 3 Langs)', () => {
    service.updateOptionSelection(3, true); // Web (500)
    service.updatePanelSettings(1, 3); // 2 idiomas extra * 30€ = 60€
    // Precio: 500 (Base) + 60 (Extra) = 560
    expect(service.totalPrice()).toBe(560);
  });

  it('should calculate extra cost for both pages and languages (2 Pages, 2 Langs)', () => {
    service.updateOptionSelection(3, true); // Web (500)
    service.updatePanelSettings(2, 2); // (1 Pág extra * 30) + (1 Idioma extra * 30) = 60€
    // Precio: 500 + 60 = 560
    expect(service.totalPrice()).toBe(560);
  });

  it('should handle zero extra cost when 1 Page and 1 Lang are selected', () => {
    service.updateOptionSelection(3, true); // Web (500)
    service.updatePanelSettings(1, 1); // 0 extra
    expect(service.totalPrice()).toBe(500);
  });

  // ------------------------------------------------------------------
  // TEST DE CONDICIÓN (WEB NO SELECCIONADA)
  // ------------------------------------------------------------------

  it('should NOT add extra cost if Web is not selected, even with panel values > 1', () => {
    service.updatePanelSettings(5, 5); // Máximo extra posible (240€)
    service.updateOptionSelection(3, false); // Web NO seleccionada

    // El precio debe ser 0.
    expect(service.totalPrice()).toBe(0);
  });

  it('should calculate total price including base and extra costs', () => {
    service.updateOptionSelection(1, true); // SEO (300)
    service.updateOptionSelection(3, true); // Web (500)
    service.updatePanelSettings(3, 2); // (2 Págs extra * 30) + (1 Lang extra * 30) = 90€

    // Total: 300 (SEO) + 500 (Web) + 90 (Extra) = 890€
    expect(service.totalPrice()).toBe(890);
  });
});
