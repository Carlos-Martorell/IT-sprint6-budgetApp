# Testing Setup - Angular 20 Presupuestos App

## Descripción

Este documento explica cómo ejecutar los tests (Jasmine + Karma) en el proyecto Angular 20.

## Dependencias Instaladas

Para que los tests funcionen correctamente, se instalaron las siguientes dependencias:

```
zone.js
@angular/platform-browser-dynamic@20.3.2
```

Estas son esenciales para que Angular testing funcione correctamente.

## Instalación

Si es la primera vez clonando el proyecto o después de hacer `git clone`, instala todo con:

```bash
npm install
```

Si tienes problemas de conflictos de versiones, usa:

```bash
npm install --legacy-peer-deps
```

## Ejecutar Tests

### Ejecutar todos los tests una sola vez (modo headless)
```bash
ng test --watch=false --browsers=ChromeHeadless
```

### Ejecutar tests en modo watch (se actualizan automáticamente)
```bash
ng test
```

### Ejecutar tests con cobertura
```bash
ng test --watch=false --code-coverage
```

## Estructura de Tests

Los tests están ubicados en:
- `src/app/**/*.spec.ts` - Archivos de test

### Tests actuales:

1. **FormUrlSyncService** (`src/app/core/services/form-url-sync.service.spec.ts`)
   - Tests para sincronización de formularios con URL
   - Pruebas de aplicación y actualización de parámetros

2. **BudgetService** (`src/app/core/services/budget.service.spec.ts`)
   - Tests para el servicio de presupuestos

3. **App Component** (`src/app/app.spec.ts`)
   - Tests básicos del componente principal

4. **BudgetsList Component** (`src/app/shared/components/budgets-list/budgets-list.spec.ts`)
   - Tests del componente de listado de presupuestos

5. **Home Page** (`src/app/pages/home/home.spec.ts`)
   - Tests de la página principal

## Archivos de Configuración

### src/test.ts
Archivo de entrada para tests. Inicializa el entorno de testing de Angular con Zone.js.

```typescript
import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
  { teardown: { destroyAfterEach: true } }
);
```

### angular.json
La sección de test debe tener los polyfills correctos:

```json
"test": {
  "builder": "@angular-devkit/build-angular:karma",
  "options": {
    "polyfills": [
      "zone.js",
      "zone.js/testing"
    ],
    "tsConfig": "tsconfig.spec.json",
    ...
  }
}
```

### karma.conf.js
Configuración de Karma (test runner). No requiere cambios especiales.

### tsconfig.spec.json
Configuración de TypeScript para tests. Incluye tipos de Jasmine.

## Solución de Problemas

### Error: "Angular requires Zone.js"
**Causa:** Zone.js no está en los polyfills de `angular.json`
**Solución:** Asegúrate que `angular.json` tenga:
```json
"polyfills": ["zone.js", "zone.js/testing"]
```

### Error: "Cannot find module '@angular/platform-browser-dynamic/testing'"
**Causa:** El paquete no está instalado
**Solución:**
```bash
npm install --save-dev @angular/platform-browser-dynamic@20.3.2 --legacy-peer-deps
```

### Error: "Cannot resolve zone.js"
**Causa:** Zone.js no está instalado
**Solución:**
```bash
npm install --save-dev zone.js --legacy-peer-deps
```

### WARN: "The application is using zoneless change detection, but is still loading Zone.js"
**Causa:** Aviso informativo (no es un error)
**Solución:** Este warning aparece en Angular 20 con zoneless. Puede ignorarse.

## Tips

- Los tests se ejecutan automáticamente cuando modificas archivos en modo `ng test`
- Usa `--watch=false` para CI/CD pipelines
- Usa `--code-coverage` para generar reportes de cobertura en `coverage/`
- Los tests pasan cuando ves: `TOTAL: XX SUCCESS`

## Próximos Pasos

1. Añade más tests según sea necesario
2. Mantén la cobertura de tests por encima del 80%
3. Ejecuta tests antes de hacer commits
