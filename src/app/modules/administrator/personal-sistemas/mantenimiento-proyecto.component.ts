import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mantenimiento-proyecto',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Mantenimiento proyecto</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">
          Esta es la vista del módulo Mantenimiento proyecto del sistema de administración.
        </p>
        <div class="bg-blue-50 border border-blue-200 rounded-md p-4">
          <h3 class="text-lg font-semibold text-blue-900 mb-2">Funcionalidades</h3>
          <ul class="list-disc list-inside text-blue-800 space-y-1">
            <li>Gestión de proyectos del sistema</li>
            <li>Configuración de parámetros</li>
            <li>Mantenimiento de estructuras</li>
            <li>Control de versiones</li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class MantenimientoProyectoComponent {}
