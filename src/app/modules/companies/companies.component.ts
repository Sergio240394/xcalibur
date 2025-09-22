import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-companies',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Gestión de Compañías</h1>
      <router-outlet></router-outlet>
    </div>
  `
})
export class CompaniesComponent {}

