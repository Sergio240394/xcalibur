import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Programas especiales components
@Component({
  selector: 'app-mantenimiento-errores',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Mantenimiento errores</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Mantenimiento de errores del sistema.</p>
      </div>
    </div>
  `
})
export class MantenimientoErroresComponent {}

@Component({
  selector: 'app-blanqueo-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Blanqueo de logs</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Blanqueo de logs del sistema.</p>
      </div>
    </div>
  `
})
export class BlanqueoLogsComponent {}

@Component({
  selector: 'app-usuarios-trabajando',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Usuarios trabajando</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Monitoreo de usuarios trabajando en el sistema.</p>
      </div>
    </div>
  `
})
export class UsuariosTrabajandoComponent {}

@Component({
  selector: 'app-mantenimiento-parametros',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Mantenimiento parametros</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Mantenimiento de parámetros del sistema.</p>
      </div>
    </div>
  `
})
export class MantenimientoParametrosComponent {}

@Component({
  selector: 'app-reporte-errores',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Reporte de errores</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Reporte de errores del sistema.</p>
      </div>
    </div>
  `
})
export class ReporteErroresComponent {}

@Component({
  selector: 'app-reporte-logs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Reporte de logs</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Reporte de logs del sistema.</p>
      </div>
    </div>
  `
})
export class ReporteLogsComponent {}

@Component({
  selector: 'app-reporte-errores-soluciones',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Reporte de errores/soluciones</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Reporte de errores y sus soluciones.</p>
      </div>
    </div>
  `
})
export class ReporteErroresSolucionesComponent {}

@Component({
  selector: 'app-reporte-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Reporte de login</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Reporte de logins del sistema.</p>
      </div>
    </div>
  `
})
export class ReporteLoginComponent {}

@Component({
  selector: 'app-reporte-tasas-cambio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Reporte tasas de cambio</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Reporte de tasas de cambio.</p>
      </div>
    </div>
  `
})
export class ReporteTasasCambioComponent {}

@Component({
  selector: 'app-reporte-auditoria-opciones-perfil',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Reporte auditoria cambios opciones x perfil</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Reporte de auditoría de cambios de opciones por perfil.</p>
      </div>
    </div>
  `
})
export class ReporteAuditoriaOpcionesPerfilComponent {}

@Component({
  selector: 'app-reporte-auditoria-perfiles-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Reporte auditoria cambios perfiles x login</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Reporte de auditoría de cambios de perfiles por login.</p>
      </div>
    </div>
  `
})
export class ReporteAuditoriaPerfilesLoginComponent {}

@Component({
  selector: 'app-reporte-auditoria-restriccion-cias',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Reporte auditoria restriccion cias</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Reporte de auditoría de restricciones por compañías.</p>
      </div>
    </div>
  `
})
export class ReporteAuditoriaRestriccionCiasComponent {}

@Component({
  selector: 'app-ejecutor-programas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Ejecutor de programas</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Ejecutor de programas del sistema.</p>
      </div>
    </div>
  `
})
export class EjecutorProgramasComponent {}

// Procesos eventuales components
@Component({
  selector: 'app-mantenimiento-tasa-reexpresion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Mantenimiento tasa reexpresion</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Mantenimiento de tasas de reexpresión.</p>
      </div>
    </div>
  `
})
export class MantenimientoTasaReexpresionComponent {}

@Component({
  selector: 'app-mant-nit',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Mant. N.I.T.</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Mantenimiento de N.I.T.</p>
      </div>
    </div>
  `
})
export class MantNitComponent {}

@Component({
  selector: 'app-mant-actividad-economica',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Mant. actividad economica</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Mantenimiento de actividad económica.</p>
      </div>
    </div>
  `
})
export class MantActividadEconomicaComponent {}

@Component({
  selector: 'app-mant-administracion-impuestos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Mant. administracion impuestos</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Mantenimiento de administración de impuestos.</p>
      </div>
    </div>
  `
})
export class MantAdministracionImpuestosComponent {}

@Component({
  selector: 'app-manten-retencion-fuente',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Manten. retencion fuente</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Mantenimiento de retención en la fuente.</p>
      </div>
    </div>
  `
})
export class MantenRetencionFuenteComponent {}

@Component({
  selector: 'app-reporte-nit',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Reporte N.I.T.</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Reporte de N.I.T.</p>
      </div>
    </div>
  `
})
export class ReporteNitComponent {}

@Component({
  selector: 'app-reporte-actividad-economica',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Reporte actividad economica</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Reporte de actividad económica.</p>
      </div>
    </div>
  `
})
export class ReporteActividadEconomicaComponent {}

@Component({
  selector: 'app-reporte-administracion-impuestos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Reporte administracion impuest</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Reporte de administración de impuestos.</p>
      </div>
    </div>
  `
})
export class ReporteAdministracionImpuestosComponent {}

@Component({
  selector: 'app-reporte-retencion-fuente',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Reporte retencion fuente</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Reporte de retención en la fuente.</p>
      </div>
    </div>
  `
})
export class ReporteRetencionFuenteComponent {}

// Opciones de sistema components
@Component({
  selector: 'app-mantenimiento-clasificaciones',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Mantenimiento clasificaciones</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Mantenimiento de clasificaciones del sistema.</p>
      </div>
    </div>
  `
})
export class MantenimientoClasificacionesComponent {}

@Component({
  selector: 'app-mant-programas-seleccion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Mant. programas de seleccion</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Mantenimiento de programas de selección.</p>
      </div>
    </div>
  `
})
export class MantProgramasSeleccionComponent {}

@Component({
  selector: 'app-mantenimiento-etiquetas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Mantenimiento de etiquetas</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Mantenimiento de etiquetas del sistema.</p>
      </div>
    </div>
  `
})
export class MantenimientoEtiquetasComponent {}
