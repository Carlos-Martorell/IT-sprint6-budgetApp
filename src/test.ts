// // Este archivo es el punto de entrada de las pruebas
// import 'zone.js';
// import 'zone.js/testing'; // Necesario para el entorno de pruebas de Angular

// import { getTestBed } from '@angular/core/testing';
// import {
//   BrowserDynamicTestingModule,
//   platformBrowserDynamicTesting
// } from '@angular/platform-browser-dynamic/testing';

// // Inicializar el entorno de pruebas de Angular
// getTestBed().initTestEnvironment(
//   BrowserDynamicTestingModule,
//   platformBrowserDynamicTesting(),
//   { ngZone: 'proxy' } // Configuración moderna para el control de NgZone
// );

// // Aquí se buscan y cargan todos los archivos *.spec.ts
// const context = require.context('./', true, /\.spec\.ts$/);
// context.keys().map(context);

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
  {
    teardown: { destroyAfterEach: true }
  }
);
