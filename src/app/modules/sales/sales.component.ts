import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-sm p-8 text-center">
      <div class="text-6xl mb-4">🛒</div>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Ventas</h1>
      <p class="text-gray-600">Módulo en desarrollo - Próximamente</p>
    </div>
  `
})
export class SalesComponent {}
