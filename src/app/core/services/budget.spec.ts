
import { BudgetService } from './budget';

describe('BudgetService (Lógica de Precios y Signals)', () => {
  let service: BudgetService;

  beforeEach(() => {
    service = new BudgetService();

    service.updateOptionSelection(1, false);
    service.updateOptionSelection(2, false);
    service.updateOptionSelection(3, false);
    service.updatePanelSettings(1, 1);
  });


  it('should be created and initial price should be 0', () => {
    expect(service).toBeTruthy();
    expect(service.totalPrice()).toBe(0);
  });


  it('should calculate base cost correctly when SEO (300) and ADS (400) are selected', () => {
    service.updateOptionSelection(1, true);
    service.updateOptionSelection(2, true);
    expect(service.totalPrice()).toBe(700);
  });

  it('should calculate base cost correctly when only WEB (500) is selected', () => {
    service.updateOptionSelection(3, true);
    expect(service.totalPrice()).toBe(500);
  });

  it('should calculate extra cost for pages if Web is selected (4 Pages, 1 Lang)', () => {
    service.updateOptionSelection(3, true);
    service.updatePanelSettings(4, 1);

    expect(service.totalPrice()).toBe(590);
  });

  it('should calculate extra cost for languages if Web is selected (1 Page, 3 Langs)', () => {
    service.updateOptionSelection(3, true);
    service.updatePanelSettings(1, 3);

    expect(service.totalPrice()).toBe(560);
  });

  it('should calculate extra cost for both pages and languages (2 Pages, 2 Langs)', () => {
    service.updateOptionSelection(3, true);
    service.updatePanelSettings(2, 2);

    expect(service.totalPrice()).toBe(560);
  });

  it('should handle zero extra cost when 1 Page and 1 Lang are selected', () => {
    service.updateOptionSelection(3, true);
    service.updatePanelSettings(1, 1);
    expect(service.totalPrice()).toBe(500);
  });

  it('should NOT add extra cost if Web is not selected, even with panel values > 1', () => {
    service.updatePanelSettings(5, 5);
    service.updateOptionSelection(3, false);

    expect(service.totalPrice()).toBe(0);
  });

  it('should calculate total price including base and extra costs', () => {
    service.updateOptionSelection(1, true);
    service.updateOptionSelection(3, true);
    service.updatePanelSettings(3, 2);

    expect(service.totalPrice()).toBe(890);
  });
});
