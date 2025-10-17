
import { BudgetService } from './budget';

const SEO_PRICE = 300;
const ADS_PRICE = 400;
const WEB_PRICE = 500;
const MODULE_PRICE = 30;

describe('BudgetService (Pruebas Unitarias - Instanciación Directa)', () => {
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
    expect(service.totalPrice()).toBe(SEO_PRICE + ADS_PRICE);
  });

  it('should calculate extra cost for 4 Pages (3 extra) if Web is selected', () => {
    service.updateOptionSelection(3, true);
    service.updatePanelSettings(4, 1);
    // Coste: 500 + (4-1)*30 = 590
    expect(service.totalPrice()).toBe(WEB_PRICE + 3 * MODULE_PRICE);
  });

  it('should calculate extra cost for 3 Languages (2 extra) if Web is selected', () => {
    service.updateOptionSelection(3, true);
    service.updatePanelSettings(1, 3);
    // Coste: 500 + (3-1)*30 = 560
    expect(service.totalPrice()).toBe(WEB_PRICE + 2 * MODULE_PRICE);
  });

  it('should calculate total price including base and extra costs (Full Scenario)', () => {
    service.updateOptionSelection(1, true); // SEO (300)
    service.updateOptionSelection(3, true); // WEB (500)
    service.updatePanelSettings(3, 2); // (3-1)*30 + (2-1)*30 = 90
    // Total: 300 + 500 + 90 = 890
    expect(service.totalPrice()).toBe(SEO_PRICE + WEB_PRICE + 3 * MODULE_PRICE);
  });

  it('should NOT add extra cost if Web is not selected', () => {
    service.updatePanelSettings(5, 5); // 8 extras
    service.updateOptionSelection(1, true); // Solo SEO (300)
    expect(service.totalPrice()).toBe(SEO_PRICE);
  });

// --- PRUEBAS DE FLUJO DE GUARDADO Y RESETEO ---

  it('should save a budget with the correct data and reset state', () => {
    // 1. Configurar estado y calcular precio (el precio total es 890)
    service.updateOptionSelection(1, true);
    service.updateOptionSelection(3, true);
    service.updatePanelSettings(3, 2);
    const expectedPrice = service.totalPrice();

    // 2. Guardar
    service.saveBudget('Test Client', '123456789', 'test@example.com');

    // 3. Verificar GUARDADO
    const savedBudgets = service.getBudgets();
    expect(savedBudgets().length).toBe(1);
    expect(savedBudgets()[0].clientName).toBe('Test Client');
    expect(savedBudgets()[0].totalPrice).toBe(expectedPrice);
    expect(savedBudgets()[0].id).toBe(1);

    // 4. Verificar RESESTEO
    expect(service.totalPrice()).toBe(0);
    expect(service.numPages()).toBe(1);
  });
});
