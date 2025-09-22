import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-administrator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm p-8 text-center">
      <div class="text-6xl mb-4">👨‍💼</div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Administrador del Sistema (AS)</h1>
      <p class="text-gray-600 mb-4">Módulo en desarrollo - Próximamente</p>
      <p class="text-sm text-gray-500">Ruta actual: {{ currentRoute }}</p>
    </div>
  `
})
export class AdministratorComponent {
  public currentRoute: string = '';

  constructor(private router: Router) {
    this.currentRoute = this.router.url;
  }
}
