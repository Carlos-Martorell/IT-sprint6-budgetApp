import { Component, signal } from '@angular/core';
import { HomeComponent } from './pages/home/home';

@Component({
  selector: 'app-root',
  imports: [ HomeComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  public readonly title = signal('presupuestos-app');
}
