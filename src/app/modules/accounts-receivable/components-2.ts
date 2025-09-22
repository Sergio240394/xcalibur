import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// Continuación de Reportes principales components
@Component({
  selector: 'app-observacion-generales',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Observación generales</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Observaciones generales del sistema.</p>
      </div>
    </div>
  `
})
export class ObservacionGeneralesComponent {}

@Component({
  selector: 'app-nota-credito-total',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Nota crédito total</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Nota de crédito total.</p>
      </div>
    </div>
  `
})
export class NotaCreditoTotalComponent {}

@Component({
  selector: 'app-registro-ordenes-facturacion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Registro órdenes de facturación</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Registro de órdenes de facturación.</p>
      </div>
    </div>
  `
})
export class RegistroOrdenesFacturacionComponent {}

@Component({
  selector: 'app-actualiza-indicativo-f-electronica-cia',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Actualiza indicativo f-electrónica x CIA</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Actualización de indicativo de facturación electrónica por compañía.</p>
      </div>
    </div>
  `
})
export class ActualizaIndicativoFElectronicaCiaComponent {}

@Component({
  selector: 'app-mantenimiento-detalles-generales',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Mantenimiento detalles generales</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Mantenimiento de detalles generales.</p>
      </div>
    </div>
  `
})
export class MantenimientoDetallesGeneralesComponent {}

@Component({
  selector: 'app-reimpresion-facturas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Reimpresión de facturas</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Reimpresión de facturas.</p>
      </div>
    </div>
  `
})
export class ReimpresionFacturasComponent {}

@Component({
  selector: 'app-generacion-facturacion-recurrente',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Generación facturación recurrente</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Generación de facturación recurrente.</p>
      </div>
    </div>
  `
})
export class GeneracionFacturacionRecurrenteComponent {}

@Component({
  selector: 'app-reporte-facturacion-recurrente',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Reporte de facturación recurrente</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Reporte de facturación recurrente.</p>
      </div>
    </div>
  `
})
export class ReporteFacturacionRecurrenteComponent {}

@Component({
  selector: 'app-importacion-ordenes-facturacion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Importación órdenes de facturación</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Importación de órdenes de facturación.</p>
      </div>
    </div>
  `
})
export class ImportacionOrdenesFacturacionComponent {}

@Component({
  selector: 'app-reporte-gastos-facturacion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Reporte gastos de facturación</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Reporte de gastos de facturación.</p>
      </div>
    </div>
  `
})
export class ReporteGastosFacturacionComponent {}

@Component({
  selector: 'app-reporte-facturacion-ofa-rango-fecha',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Reporte facturación OFA por rango de fecha</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Reporte de facturación OFA por rango de fecha.</p>
      </div>
    </div>
  `
})
export class ReporteFacturacionOfaRangoFechaComponent {}

@Component({
  selector: 'app-facturas-anuladas-fuera-sistema',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Facturas anuladas fuera del sistema</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Facturas anuladas fuera del sistema.</p>
      </div>
    </div>
  `
})
export class FacturasAnuladasFueraSistemaComponent {}

@Component({
  selector: 'app-facturacion-asobancaria',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Facturación Asobancaria</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Facturación Asobancaria.</p>
      </div>
    </div>
  `
})
export class FacturacionAsobancariaComponent {}

@Component({
  selector: 'app-elimina-notas-credito-debito',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Elimina notas crédito o débito</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Eliminación de notas de crédito o débito.</p>
      </div>
    </div>
  `
})
export class EliminaNotasCreditoDebitoComponent {}

@Component({
  selector: 'app-verifica-diferencias-facturacion-recurrente',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Verifica diferencias de facturación recurrente</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Verificación de diferencias de facturación recurrente.</p>
      </div>
    </div>
  `
})
export class VerificaDiferenciasFacturacionRecurrenteComponent {}

@Component({
  selector: 'app-carga-codigos-cufe-facturas-electronicas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Carga códigos CUFE a facturas electrónicas</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Carga de códigos CUFE a facturas electrónicas.</p>
      </div>
    </div>
  `
})
export class CargaCodigosCufeFacturasElectronicasComponent {}

@Component({
  selector: 'app-reporte-facturas-sin-codigo-cufe-ubl2-dic19',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Reporte de facturas sin código CUFE UBL2 Dic 19</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Reporte de facturas sin código CUFE UBL2 Dic 19.</p>
      </div>
    </div>
  `
})
export class ReporteFacturasSinCodigoCufeUbl2Dic19Component {}

@Component({
  selector: 'app-carga-recurrente-email-gerente-socio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Carga recurrente email de gerente y socio</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Carga recurrente de email de gerente y socio.</p>
      </div>
    </div>
  `
})
export class CargaRecurrenteEmailGerenteSocioComponent {}

@Component({
  selector: 'app-carga-anexos-facturacion',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Carga anexos de facturación</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Carga de anexos de facturación.</p>
      </div>
    </div>
  `
})
export class CargaAnexosFacturacionComponent {}

@Component({
  selector: 'app-actualiza-campo-llave-recurrente',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Actualiza campo llave recurrente</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Actualización de campo llave recurrente.</p>
      </div>
    </div>
  `
})
export class ActualizaCampoLlaveRecurrenteComponent {}

@Component({
  selector: 'app-elimina-recurrente-excel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Elimina recurrente por Excel</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Eliminación de recurrente por Excel.</p>
      </div>
    </div>
  `
})
export class EliminaRecurrenteExcelComponent {}

@Component({
  selector: 'app-parametros-observaciones-ingles',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Parámetros observaciones en inglés</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Parámetros de observaciones en inglés.</p>
      </div>
    </div>
  `
})
export class ParametrosObservacionesInglesComponent {}

@Component({
  selector: 'app-mantenimiento-distribucion-facturas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Mantenimiento distribución facturas</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Mantenimiento de distribución de facturas.</p>
      </div>
    </div>
  `
})
export class MantenimientoDistribucionFacturasComponent {}

@Component({
  selector: 'app-facturacion-rango-fechas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Facturación rango de fechas</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Facturación por rango de fechas.</p>
      </div>
    </div>
  `
})
export class FacturacionRangoFechasComponent {}

@Component({
  selector: 'app-reporte-diferencia-cambio-cxc-detallado',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Reporte diferencia en cambio CxC detallado</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Reporte de diferencia en cambio de CxC detallado.</p>
      </div>
    </div>
  `
})
export class ReporteDiferenciaCambioCxcDetalladoComponent {}

@Component({
  selector: 'app-reporte-relacion-facturas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Reporte relación de facturas</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Reporte de relación de facturas.</p>
      </div>
    </div>
  `
})
export class ReporteRelacionFacturasComponent {}

@Component({
  selector: 'app-listado-clientes-municipio',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Listado de clientes por municipio</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Listado de clientes por municipio.</p>
      </div>
    </div>
  `
})
export class ListadoClientesMunicipioComponent {}

// Procesos facturación components
@Component({
  selector: 'app-modificacion-detalle-facturas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Modificación detalle facturas</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Modificación de detalle de facturas.</p>
      </div>
    </div>
  `
})
export class ModificacionDetalleFacturasComponent {}

// Procesos de cierre components
@Component({
  selector: 'app-proceso-diario',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Proceso diario</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Proceso diario de cierre.</p>
      </div>
    </div>
  `
})
export class ProcesoDiarioComponent {}

@Component({
  selector: 'app-proceso-mensual',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Proceso mensual</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Proceso mensual de cierre.</p>
      </div>
    </div>
  `
})
export class ProcesoMensualComponent {}

@Component({
  selector: 'app-proceso-anual',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Proceso anual</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Proceso anual de cierre.</p>
      </div>
    </div>
  `
})
export class ProcesoAnualComponent {}

// Generadores components
@Component({
  selector: 'app-crea-ruta-calculo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Crea ruta cálculo</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Creación de ruta de cálculo.</p>
      </div>
    </div>
  `
})
export class CreaRutaCalculoComponent {}

@Component({
  selector: 'app-crea-ruta-contable',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Crea ruta contable</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Creación de ruta contable.</p>
      </div>
    </div>
  `
})
export class CreaRutaContableComponent {}

@Component({
  selector: 'app-generador-excel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Generador Excel</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Generador de archivos Excel.</p>
      </div>
    </div>
  `
})
export class GeneradorExcelComponent {}

@Component({
  selector: 'app-reporte-ruta-calculo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Reporte ruta cálculo</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Reporte de ruta de cálculo.</p>
      </div>
    </div>
  `
})
export class ReporteRutaCalculoComponent {}

@Component({
  selector: 'app-reporte-ruta-contable',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Reporte ruta contable</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Reporte de ruta contable.</p>
      </div>
    </div>
  `
})
export class ReporteRutaContableComponent {}

@Component({
  selector: 'app-reporte-especial',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Reporte especial</h1>
      <div class="bg-white rounded-lg shadow p-6">
        <p class="text-gray-600 mb-4">Reporte especial del sistema.</p>
      </div>
    </div>
  `
})
export class ReporteEspecialComponent {}
