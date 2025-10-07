import { Component, signal, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { MenuService } from '../core/services/menu.service';
import { ToastService } from '../core/services/toast.service';
import { SvgIconComponent } from '../shared/components/svg-icon/svg-icon.component';
import { SecondaryMenuComponent } from '../shared/components/secondary-menu/secondary-menu.component';
import { ToastComponent } from '../shared/components/toast/toast.component';
import { MenuLevel1, MenuLevel2, MenuLevel3 } from '../core/interfaces/menu.interface';
import { filter } from 'rxjs/operators';

interface MenuItem {
  path: string;
  label: string;
  icon?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SvgIconComponent,
    SecondaryMenuComponent,
    ToastComponent
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainLayoutComponent implements OnInit, OnDestroy {
  public readonly isSidebarOpen = signal<boolean>(false);
  public readonly isSidebarCollapsed = signal<boolean>(false);
  public readonly expandedLevel2Items = signal<Set<number>>(new Set());
  public readonly expandedLevel3Items = signal<Set<string>>(new Set());
  public readonly showUserMenu = signal<boolean>(false);
  public readonly dynamicMenuItems = signal<MenuLevel1[]>([]);
  public readonly showSecondaryMenu = signal<boolean>(false);

  public readonly menuItems = signal<MenuItem[]>([
    {
      path: '/administrador',
      label: 'Administrador del Sistema',
      icon: 'admin.svg',
      children: [
        {
          path: '/administrador/companias',
          label: 'Compañías',
          children: [
            { path: '/administrador/companias/mantenimiento-companias', label: 'Mantenimiento de compañías' }
          ]
        },
        {
          path: '/administrador/personal-sistemas',
          label: 'Personal de sistemas',
          children: [
            { path: '/administrador/personal-sistemas/compilador', label: 'Compilador' },
            { path: '/administrador/personal-sistemas/mantenimiento-proyecto', label: 'Mantenimiento proyecto' },
            { path: '/administrador/personal-sistemas/mantenimiento-identif-cliente', label: 'Mantenimiento identif. cliente' },
            { path: '/administrador/personal-sistemas/reporte-proyecto', label: 'Reporte proyecto' },
            { path: '/administrador/personal-sistemas/reporte-campos-clasificacion', label: 'Reporte campos clasificacion' },
            { path: '/administrador/personal-sistemas/reporte-programa-selectivo', label: 'Reporte programa selectivo' },
            { path: '/administrador/personal-sistemas/reporte-etiquetas', label: 'Reporte de etiquetas' }
          ]
        },
        {
          path: '/administrador/companias-reportes',
          label: 'Compañías - Reportes',
          children: [
            { path: '/administrador/companias-reportes/reporte-companias', label: 'Reporte de compañias' },
            { path: '/administrador/companias/mantenimiento-companias', label: 'Mantenimiento de compañias' }
          ]
        },
        {
          path: '/administrador/autorizacion-usuarios',
          label: 'Autorización a usuarios',
          children: [
            { path: '/administrador/autorizacion-usuarios/asignacion-opciones-usuario', label: 'Asignacion opciones x usuario' },
            { path: '/administrador/autorizacion-usuarios/prohibicion-acceso-compania', label: 'Prohibicion acceso a compañia' },
            { path: '/administrador/autorizacion-usuarios/cambio-password', label: 'Cambio de password' },
            { path: '/administrador/autorizacion-usuarios/reiniciar-password', label: 'Reiniciar password' },
            { path: '/administrador/autorizacion-usuarios/asignacion-opciones-perfil', label: 'Asignacion de opciones x perfil' },
            { path: '/administrador/autorizacion-usuarios/desbloqueo-claves', label: 'Desbloqueo de claves' },
            { path: '/administrador/autorizacion-usuarios/copia-asignaciones-login', label: 'Copia asignaciones otro login' },
            { path: '/administrador/autorizacion-usuarios/reporte-prohibicion-companias', label: 'Reporte prohibicion compaqias' },
            { path: '/administrador/autorizacion-usuarios/reporte-usuarios', label: 'Reporte de usuarios' },
            { path: '/administrador/autorizacion-usuarios/reporte-asignacion-opciones', label: 'Reporte asignacion de opciones' },
            { path: '/administrador/autorizacion-usuarios/mantenimiento-usuarios', label: 'Mantenimiento de usuarios' },
            { path: '/administrador/autorizacion-usuarios/reporte-usuarios-perfil', label: 'Reporte de usuarios con perfil' },
            { path: '/administrador/autorizacion-usuarios/reporte-opcion-perfil', label: 'Reporte de opcion con perfil' }
          ]
        },
        {
          path: '/administrador/fase-evaluacion',
          label: 'Fase evaluación',
          children: [
            { path: '/administrador/fase-evaluacion/mantenimiento-sonido', label: 'Mantenimiento sonido' }
          ]
        },
        {
          path: '/administrador/menu-sistema',
          label: 'Menu del sistema',
          children: [
            { path: '/administrador/menu-sistema/mantenimiento-sistemas', label: 'Mantenimiento de sistemas' },
            { path: '/administrador/menu-sistema/mantenimiento-menu', label: 'Mantenimiento de menú' },
            { path: '/administrador/menu-sistema/reporte-sistemas', label: 'Reporte de sistemas' },
            { path: '/administrador/menu-sistema/reporte-menu', label: 'Reporte de menú' }
          ]
        },
        {
          path: '/administrador/programas-especiales',
          label: 'Programas especiales',
          children: [
            { path: '/administrador/programas-especiales/mantenimiento-errores', label: 'Mantenimiento errores' },
            { path: '/administrador/programas-especiales/blanqueo-logs', label: 'Blanqueo de logs' },
            { path: '/administrador/programas-especiales/usuarios-trabajando', label: 'Usuarios trabajando' },
            { path: '/administrador/programas-especiales/mantenimiento-parametros', label: 'Mantenimiento parametros' },
            { path: '/administrador/programas-especiales/reporte-errores', label: 'Reporte de errores' },
            { path: '/administrador/programas-especiales/reporte-logs', label: 'Reporte de logs' },
            { path: '/administrador/programas-especiales/reporte-errores-soluciones', label: 'Reporte de errores/soluciones' },
            { path: '/administrador/programas-especiales/reporte-login', label: 'Reporte de login' },
            { path: '/administrador/programas-especiales/reporte-tasas-cambio', label: 'Reporte tasas de cambio' },
            { path: '/administrador/programas-especiales/reporte-auditoria-opciones-perfil', label: 'Reporte auditoria cambios opciones x perfil' },
            { path: '/administrador/programas-especiales/reporte-auditoria-perfiles-login', label: 'Reporte auditoria cambios perfiles x login' },
            { path: '/administrador/programas-especiales/reporte-auditoria-restriccion-cias', label: 'Reporte auditoria restriccion cias' },
            { path: '/administrador/programas-especiales/ejecutor-programas', label: 'Ejecutor de programas' }
          ]
        },
        {
          path: '/administrador/procesos-eventuales',
          label: 'Procesos eventuales',
          children: [
            { path: '/administrador/procesos-eventuales/mantenimiento-tasa-reexpresion', label: 'Mantenimiento tasa reexpresion' },
            { path: '/administrador/procesos-eventuales/mant-nit', label: 'Mant. N.I.T.' },
            { path: '/administrador/procesos-eventuales/mant-actividad-economica', label: 'Mant. actividad economica' },
            { path: '/administrador/procesos-eventuales/mant-administracion-impuestos', label: 'Mant. administracion impuestos' },
            { path: '/administrador/procesos-eventuales/manten-retencion-fuente', label: 'Manten. retencion fuente' },
            { path: '/administrador/procesos-eventuales/reporte-nit', label: 'Reporte N.I.T.' },
            { path: '/administrador/procesos-eventuales/reporte-actividad-economica', label: 'Reporte actividad economica' },
            { path: '/administrador/procesos-eventuales/reporte-administracion-impuestos', label: 'Reporte administracion impuest' },
            { path: '/administrador/procesos-eventuales/reporte-retencion-fuente', label: 'Reporte retencion fuente' }
          ]
        },
        {
          path: '/administrador/opciones-sistema',
          label: 'Opciones de sistema',
          children: [
            { path: '/administrador/opciones-sistema/mantenimiento-clasificaciones', label: 'Mantenimiento clasificaciones' },
            { path: '/administrador/opciones-sistema/mant-programas-seleccion', label: 'Mant. programas de seleccion' },
            { path: '/administrador/opciones-sistema/mantenimiento-etiquetas', label: 'Mantenimiento de etiquetas' }
          ]
        }
      ]
    },
    {
      path: '/cuentas-por-cobrar',
      label: 'Cuentas x Cobrar',
      icon: 'team.svg',
      children: [
        {
          path: '/cuentas-por-cobrar/procesos-principales',
          label: 'Procesos principales',
          children: [
            { path: '/cuentas-por-cobrar/procesos-principales/carga-cobranza', label: 'Carga de cobranza' },
            { path: '/transacciones', label: 'Carga transacciones' },
            { path: '/cuentas-por-cobrar/procesos-principales/conversion-documentos', label: 'Conversión de documentos' },
            { path: '/cuentas-por-cobrar/procesos-principales/consulta-clientes', label: 'Consulta de clientes' },
            { path: '/cuentas-por-cobrar/procesos-principales/ajustes-documentos', label: 'Ajustes de documentos' },
            { path: '/cuentas-por-cobrar/procesos-principales/cambio-limite-credito', label: 'Cambio límite de crédito' },
            { path: '/cuentas-por-cobrar/procesos-principales/mant-clientes-transito', label: 'Mant. clientes en tránsito' },
            { path: '/cuentas-por-cobrar/procesos-principales/mant-talonarios-cobro', label: 'Mant. talonarios de cobro' },
            { path: '/cuentas-por-cobrar/procesos-principales/ajustes-automaticos', label: 'Ajustes automáticos' },
            { path: '/cuentas-por-cobrar/procesos-principales/mant-documentos-entregar', label: 'Mant. documentos a entregar' },
            { path: '/cuentas-por-cobrar/procesos-principales/carga-forma-cobranza', label: 'Carga forma de cobranza' },
            { path: '/cuentas-por-cobrar/procesos-principales/consulta-facturas-cliente', label: 'Consulta de facturas por cliente' },
            { path: '/cuentas-por-cobrar/procesos-principales/mantenimiento-clientes', label: 'Mantenimiento de clientes' },
            { path: '/cuentas-por-cobrar/procesos-principales/auditoria-correos-facturacion', label: 'Auditoría correos facturación electrónica' },
            { path: '/cuentas-por-cobrar/procesos-principales/carga-clientes-automatico', label: 'Carga de clientes automático' },
            { path: '/cuentas-por-cobrar/procesos-principales/carga-anulacion-recibos', label: 'Carga anulación de recibos de caja' },
            { path: '/cuentas-por-cobrar/procesos-principales/mantenimiento-contactos', label: 'Mantenimiento contactos' }
          ]
        },
        {
          path: '/cuentas-por-cobrar/reportes-principales',
          label: 'Reportes principales',
      children: [
            { path: '/cuentas-por-cobrar/reportes-principales/recaudo-consolidado-product-group', label: 'Recaudo consolidado por product group' },
            { path: '/cuentas-por-cobrar/reportes-principales/informe-ingresos-trimestre-pg', label: 'Informe de ingresos por trimestre PG' },
            { path: '/cuentas-por-cobrar/reportes-principales/facturacion-recaudo-socio-mensual', label: 'Facturación y recaudo por socio mensual' },
            { path: '/cuentas-por-cobrar/reportes-principales/reporte-fact-recaudo-gerente', label: 'Reporte fact. y recaudo por gerente' },
            { path: '/cuentas-por-cobrar/reportes-principales/reporte-movimiento-dia', label: 'Reporte movimiento del día' },
            { path: '/cuentas-por-cobrar/reportes-principales/reporte-movimiento-mensual', label: 'Reporte movimiento mensual' },
            { path: '/cuentas-por-cobrar/reportes-principales/analisis-detallado', label: 'Análisis detallado' },
            { path: '/cuentas-por-cobrar/reportes-principales/analisis-vencimientos-especiales', label: 'Análisis vencimientos especiales corte' },
            { path: '/cuentas-por-cobrar/reportes-principales/estado-cuenta-historico', label: 'Estado de cuenta histórico' },
            { path: '/cuentas-por-cobrar/reportes-principales/estado-cuenta-pendiente', label: 'Estado de cuenta pendiente' },
            { path: '/cuentas-por-cobrar/reportes-principales/carta-clientes', label: 'Carta de clientes' },
            { path: '/cuentas-por-cobrar/reportes-principales/clientes-morosos', label: 'Clientes morosos' },
            { path: '/cuentas-por-cobrar/reportes-principales/cobranza-dia', label: 'Cobranza del día' },
            { path: '/cuentas-por-cobrar/reportes-principales/cobranza-mes', label: 'Cobranza del mes' },
            { path: '/cuentas-por-cobrar/reportes-principales/resumen-cuentas-cobrar', label: 'Resumen cuentas por cobrar' },
            { path: '/cuentas-por-cobrar/reportes-principales/estado-cta-hist-consolidado', label: 'Estado cta. hist. consolidado' },
            { path: '/cuentas-por-cobrar/reportes-principales/estado-cta-pend-consolidado', label: 'Estado cta. pend. consolidado' },
            { path: '/cuentas-por-cobrar/reportes-principales/comprobantes-documentos', label: 'Comprobantes de documentos' },
            { path: '/cuentas-por-cobrar/reportes-principales/documentos-entregar', label: 'Documentos a entregar' },
            { path: '/cuentas-por-cobrar/reportes-principales/movimiento-lote-selectivo', label: 'Movimiento por lote selectivo' },
            { path: '/cuentas-por-cobrar/reportes-principales/movimiento-lote', label: 'Movimiento por lote' },
            { path: '/cuentas-por-cobrar/reportes-principales/movimiento-lote-mensual', label: 'Movimiento por lote mensual' },
            { path: '/cuentas-por-cobrar/reportes-principales/estado-documento-cobro-aler', label: 'Estado documento al cobro ALER' },
            { path: '/cuentas-por-cobrar/reportes-principales/resumen-documento-cobro', label: 'Resumen documento al cobro' },
            { path: '/cuentas-por-cobrar/reportes-principales/relacion-contable-doc-cobrado', label: 'Relación contable doc. cobrado' },
            { path: '/cuentas-por-cobrar/reportes-principales/estado-cuenta-historico-otra-moneda', label: 'Estado de cuenta histórico en otr moneda' },
            { path: '/cuentas-por-cobrar/reportes-principales/analisis-por-moneda', label: 'Análisis por moneda' },
            { path: '/cuentas-por-cobrar/reportes-principales/rep-fact-recaudo-ciudad-pg', label: 'Rep. fact. y recaudo por ciudad y PG' },
            { path: '/cuentas-por-cobrar/reportes-principales/rep-fact-recaudo-pg', label: 'Rep. fact y recaudo por PG' },
            { path: '/cuentas-por-cobrar/reportes-principales/reporte-moneda-extranjera-dane', label: 'Reporte moneda extranjera DANE' },
            { path: '/cuentas-por-cobrar/reportes-principales/notas-rango-modificacion-facturas', label: 'Notas rango modificación detalle facturas' },
            { path: '/cuentas-por-cobrar/reportes-principales/generacion-archivo-factura-electronica', label: 'Generación archivo factura electrónica' },
            { path: '/cuentas-por-cobrar/reportes-principales/parametros-facturacion', label: 'Parámetros de facturación' },
            { path: '/cuentas-por-cobrar/reportes-principales/configuracion-clientes-electronicos', label: 'Configuración clientes electrónicos x CIA' },
            { path: '/cuentas-por-cobrar/reportes-principales/otros-datos-facturacion-electronica', label: 'Otros datos facturación electrónica' },
            { path: '/cuentas-por-cobrar/reportes-principales/observacion-generales', label: 'Observación generales' },
            { path: '/cuentas-por-cobrar/reportes-principales/nota-credito-total', label: 'Nota crédito total' },
            { path: '/cuentas-por-cobrar/reportes-principales/registro-ordenes-facturacion', label: 'Registro órdenes de facturación' },
            { path: '/cuentas-por-cobrar/reportes-principales/actualiza-indicativo-f-electronica', label: 'Actualiza indicativo f-electrónica x CIA' },
            { path: '/cuentas-por-cobrar/reportes-principales/mantenimiento-detalles-generales', label: 'Mantenimiento detalles generales' },
            { path: '/cuentas-por-cobrar/reportes-principales/reimpresion-facturas', label: 'Reimpresión de facturas' },
            { path: '/cuentas-por-cobrar/reportes-principales/generacion-facturacion-recurrente', label: 'Generación facturación recurrente' },
            { path: '/cuentas-por-cobrar/reportes-principales/reporte-facturacion-recurrente', label: 'Reporte de facturación recurrente' },
            { path: '/cuentas-por-cobrar/reportes-principales/importacion-ordenes-facturacion', label: 'Importación órdenes de facturación' },
            { path: '/cuentas-por-cobrar/reportes-principales/reporte-gastos-facturacion', label: 'Reporte gastos de facturación' },
            { path: '/cuentas-por-cobrar/reportes-principales/reporte-facturacion-ofa-rango-fecha', label: 'Reporte facturación OFA por rango de fecha' },
            { path: '/cuentas-por-cobrar/reportes-principales/facturas-anuladas-fuera-sistema', label: 'Facturas anuladas fuera del sistema' },
            { path: '/cuentas-por-cobrar/reportes-principales/facturacion-asobancaria', label: 'Facturación Asobancaria' },
            { path: '/cuentas-por-cobrar/reportes-principales/elimina-notas-credito-debito', label: 'Elimina notas crédito o débito' },
            { path: '/cuentas-por-cobrar/reportes-principales/verifica-diferencias-facturacion-recurrente', label: 'Verifica diferencias de facturación recurrente' },
            { path: '/cuentas-por-cobrar/reportes-principales/carga-codigos-cufe-facturas', label: 'Carga códigos CUFE a facturas electrónicas' },
            { path: '/cuentas-por-cobrar/reportes-principales/reporte-facturas-sin-codigo-cufe', label: 'Reporte de facturas sin código CUFE UBL2 Dic 19' },
            { path: '/cuentas-por-cobrar/reportes-principales/carga-recurrente-email-gerente-socio', label: 'Carga recurrente email de gerente y socio' },
            { path: '/cuentas-por-cobrar/reportes-principales/carga-anexos-facturacion', label: 'Carga anexos de facturación' },
            { path: '/cuentas-por-cobrar/reportes-principales/actualiza-campo-llave-recurrente', label: 'Actualiza campo llave recurrente' },
            { path: '/cuentas-por-cobrar/reportes-principales/elimina-recurrente-excel', label: 'Elimina recurrente por Excel' },
            { path: '/cuentas-por-cobrar/reportes-principales/parametros-observaciones-ingles', label: 'Parámetros observaciones en inglés' },
            { path: '/cuentas-por-cobrar/reportes-principales/mantenimiento-distribucion-facturas', label: 'Mantenimiento distribución facturas' },
            { path: '/cuentas-por-cobrar/reportes-principales/facturacion-rango-fechas', label: 'Facturación rango de fechas' },
            { path: '/cuentas-por-cobrar/reportes-principales/reporte-diferencia-cambio-cxc-detallado', label: 'Reporte diferencia en cambio CxC detallado' },
            { path: '/cuentas-por-cobrar/reportes-principales/reporte-relacion-facturas', label: 'Reporte relación de facturas' },
            { path: '/cuentas-por-cobrar/reportes-principales/listado-clientes-municipio', label: 'Listado de clientes por municipio' }
          ]
        },
        {
          path: '/cuentas-por-cobrar/procesos-facturacion',
          label: 'Procesos facturación',
      children: [
            { path: '/cuentas-por-cobrar/procesos-facturacion/modificacion-detalle-facturas', label: 'Modificación detalle facturas' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/generacion-archivo-factura-electronica', label: 'Generación archivo factura electrónica' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/parametros-facturacion', label: 'Parámetros de facturación' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/configuracion-clientes-electronicos', label: 'Configuración clientes electrónicos x CIA' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/otros-datos-facturacion-electronica', label: 'Otros datos facturación electrónica' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/observacion-generales', label: 'Observación generales' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/nota-credito-total', label: 'Nota crédito total' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/registro-ordenes-facturacion', label: 'Registro órdenes de facturación' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/actualiza-indicativo-f-electronica', label: 'Actualiza indicativo f-electrónica x CIA' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/mantenimiento-detalles-generales', label: 'Mantenimiento detalles generales' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/reimpresion-facturas', label: 'Reimpresión de facturas' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/generacion-facturacion-recurrente', label: 'Generación facturación recurrente' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/reporte-facturacion-recurrente', label: 'Reporte de facturación recurrente' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/importacion-ordenes-facturacion', label: 'Importación órdenes de facturación' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/reporte-gastos-facturacion', label: 'Reporte gastos de facturación' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/reporte-facturacion-ofa-rango-fecha', label: 'Reporte facturación OFA por rango de fecha' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/facturas-anuladas-fuera-sistema', label: 'Facturas anuladas fuera del sistema' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/facturacion-asobancaria', label: 'Facturación Asobancaria' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/elimina-notas-credito-debito', label: 'Elimina notas crédito o débito' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/verifica-diferencias-facturacion-recurrente', label: 'Verifica diferencias de facturación recurrente' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/carga-codigos-cufe-facturas', label: 'Carga códigos CUFE a facturas electrónicas' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/reporte-facturas-sin-codigo-cufe', label: 'Reporte de facturas sin código CUFE UBL2 Dic 19' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/carga-recurrente-email-gerente-socio', label: 'Carga recurrente email de gerente y socio' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/carga-anexos-facturacion', label: 'Carga anexos de facturación' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/actualiza-campo-llave-recurrente', label: 'Actualiza campo llave recurrente' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/elimina-recurrente-excel', label: 'Elimina recurrente por Excel' },
            { path: '/cuentas-por-cobrar/procesos-facturacion/parametros-observaciones-ingles', label: 'Parámetros observaciones en inglés' }
          ]
        },
        {
          path: '/cuentas-por-cobrar/procesos-cierre',
          label: 'Procesos de cierre',
      children: [
            { path: '/cuentas-por-cobrar/procesos-cierre/proceso-diario', label: 'Proceso diario' },
            { path: '/cuentas-por-cobrar/procesos-cierre/proceso-mensual', label: 'Proceso mensual' },
            { path: '/cuentas-por-cobrar/procesos-cierre/proceso-anual', label: 'Proceso anual' }
          ]
        },
        {
          path: '/cuentas-por-cobrar/generadores',
          label: 'Generadores',
      children: [
            { path: '/cuentas-por-cobrar/generadores/crea-ruta-calculo', label: 'Crea ruta cálculo' },
            { path: '/cuentas-por-cobrar/generadores/crea-ruta-contable', label: 'Crea ruta contable' },
            { path: '/cuentas-por-cobrar/generadores/generador-excel', label: 'Generador Excel' },
            { path: '/cuentas-por-cobrar/generadores/reporte-ruta-calculo', label: 'Reporte ruta cálculo' },
            { path: '/cuentas-por-cobrar/generadores/reporte-ruta-contable', label: 'Reporte ruta contable' },
            { path: '/cuentas-por-cobrar/generadores/reporte-especial', label: 'Reporte especial' }
          ]
        }
      ]
    },
  ]);

  constructor(
    private authService: AuthService,
    private menuService: MenuService,
    private toastService: ToastService,
    private router: Router
  ) {
    // No usar effect() - todo se pre-calculará una sola vez
  }

  ngOnInit(): void {
    // Intentar cargar menú desde localStorage primero
    this.loadMenuFromStorage();

    // Check screen size and set initial sidebar state
    this.checkScreenSize();

    // Listen for window resize events
    window.addEventListener('resize', () => this.checkScreenSize());

    // Listen for route changes and close menu on mobile
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Close menu on mobile when navigating to a module
        if (window.innerWidth < 1024 && this.isModuleRoute(event.url)) {
          this.isSidebarOpen.set(false);
        }
      });
  }

  ngOnDestroy(): void {
    // Cleanup si es necesario
    window.removeEventListener('resize', () => this.checkScreenSize());
  }

  private checkScreenSize(): void {
    // On large screens (desktop), sidebar should be open by default
    // On small screens (mobile/tablet), sidebar should be closed by default
    const isLargeScreen = window.innerWidth >= 1024;
    this.isSidebarOpen.set(isLargeScreen);
  }

  private isModuleRoute(url: string): boolean {
    // List of routes that are considered modules (not dashboard or login)
    const moduleRoutes = [
      '/administrador',
      '/cuentas-por-cobrar',
      '/contabilidad-general',
      '/cuentas-por-pagar',
      '/inventory',
      '/purchases',
      '/sales',
      '/reports',
      '/settings',
      '/transacciones',
      '/carga-comprobantes',
      '/consulta-facturas-cliente'
    ];

    // Check if the current URL starts with any module route
    return moduleRoutes.some(route => url.startsWith(route));
  }

  private loadMenuFromStorage(): void {
    // Intentar cargar desde localStorage
    const loadedFromStorage = this.menuService.loadMenuFromLocalStorage();

    if (loadedFromStorage) {
      console.log('✅ Menú cargado desde localStorage');
    } else {
      console.log('⚠️ No hay menú en localStorage');
    }

    // Cargar menú una sola vez
    this.loadDynamicMenu();
  }

  private loadDynamicMenu(): void {
    // Obtener la jerarquía del menú desde el servicio
    const menuHierarchy = this.menuService.getMenuHierarchy();

    if (menuHierarchy.length > 0) {
      console.log('📋 Cargando menú dinámico (una sola vez):', {
        sistemas: menuHierarchy.length,
        timestamp: new Date().toISOString()
      });

      this.dynamicMenuItems.set(menuHierarchy);
    } else {
      console.log('⚠️ No hay menú dinámico disponible, usando menú estático');
    }
  }

  public get user() {
    return this.authService.user;
  }

  public toggleSidebar(): void {
    this.isSidebarOpen.update(open => !open);
  }

  public toggleSidebarCollapse(): void {
    this.isSidebarCollapsed.update(collapsed => !collapsed);
  }

  public toggleUserMenu(): void {
    this.showUserMenu.update(show => !show);
  }

  public toggleSecondMenuLevel2(index: number): void {
    // Solo cambiar el estado, sin re-renderizar
    const current = this.expandedLevel2Items();
    const newSet = new Set(current);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    this.expandedLevel2Items.set(newSet);
  }

  public toggleSecondMenuLevel3(level1Index: number, level2Index: number): void {
    // Solo cambiar el estado, sin re-renderizar
    const key = `${level1Index}-${level2Index}`;
    const current = this.expandedLevel3Items();
    const newSet = new Set(current);
    if (newSet.has(key)) {
      newSet.delete(key);
    } else {
      newSet.add(key);
    }
    this.expandedLevel3Items.set(newSet);
  }

  public isLevel2Expanded(index: number): boolean {
    return this.expandedLevel2Items().has(index);
  }

  public isLevel3Expanded(level1Index: number, level2Index: number): boolean {
    const key = `${level1Index}-${level2Index}`;
    return this.expandedLevel3Items().has(key);
  }

  /**
   * Función trackBy para elementos de nivel 3 que genera claves únicas
   * @param index Índice del elemento
   * @param item Item del menú
   * @returns Clave única para el elemento
   */
  public trackByLevel3Item(index: number, item: MenuLevel3): string {
    return `${index}-${item.nombreMen}`;
  }

  public logout(): void {
    this.showUserMenu.set(false);
    this.authService.logout();
  }


  // Mapeo de rutas pre-calculado (estático para mejor rendimiento)
  private readonly menuRouteMap: { [key: string]: string } = {
    'CONSULTA DE FACTURAS POR CLIENTE': '/cuentas-por-cobrar/procesos-principales/consulta-facturas-cliente',
    'BALANCE COMPROBACION': '/contabilidad-general/reportes-principales/balance-comprobacion',
    'MANTENIMIENTO DE CLIENTES': '/administrador/companias/mantenimiento-companias',
    'MANTENIMIENTO DE USUARIOS': '/administrador/autorizacion-usuarios/mantenimiento-usuarios',
    'MANTENIMIENTO CONTACTOS': '/cuentas-por-cobrar/procesos-principales/mantenimiento-contactos',
    'CARGA DE COBRANZA': '/cuentas-por-cobrar/procesos-principales/carga-cobranza',
    'CARGA COBRANZA (LAS ACACIAS)': '/cuentas-por-cobrar/procesos-principales/carga-cobranza-las-acacias',
    'CARGA TRANSACCIONES': '/transacciones',
    'CONVERSION DE DOCUMENTOS': '/cuentas-por-cobrar/procesos-principales/conversion-documentos',
    'CONSULTA DE CLIENTES': '/cuentas-por-cobrar/procesos-principales/consulta-clientes',
    'AJUSTES DE DOCUMENTOS': '/cuentas-por-cobrar/procesos-principales/ajustes-documentos',
    'CAMBIO LIMITE DE CREDITO': '/cuentas-por-cobrar/procesos-principales/cambio-limite-credito',
    'MANT. CLIENTES EN TRANSITO': '/cuentas-por-cobrar/procesos-principales/mant-clientes-transito',
    'MANT. TALONARIOS DE COBRO': '/cuentas-por-cobrar/procesos-principales/mant-talonarios-cobro',
    'AJUSTES AUTOMATICOS': '/cuentas-por-cobrar/procesos-principales/ajustes-automaticos',
    'MANT. DOCUMENTOS A ENTREGAR': '/cuentas-por-cobrar/procesos-principales/mant-documentos-entregar',
    'CARGA FORMA DE COBRANZA': '/cuentas-por-cobrar/procesos-principales/carga-forma-cobranza',
    'CARGA DE CLIENTES AUTOMATICO': '/cuentas-por-cobrar/procesos-principales/carga-clientes-automatico',
    'AUDITORIA CORREOS FACTURACION': '/cuentas-por-cobrar/procesos-principales/auditoria-correos-facturacion',
    'CARGA ANULACION DE RECIBOS DE CAJA': '/cuentas-por-cobrar/procesos-principales/carga-anulacion-recibos',
  };

  /**
   * Genera la ruta para un item del menú dinámico (optimizado)
   * @param item Item del menú de nivel 3
   * @returns Ruta generada para el item
   */
  public getMenuPath(item: MenuLevel3): string {
    // Buscar la ruta en el mapeo pre-calculado
    const mappedRoute = this.menuRouteMap[item.nombreMen];

    if (mappedRoute) {
      return mappedRoute;
    }

    // Si no hay mapeo, generar una ruta genérica (sin logs para mejor rendimiento)
    const basePath = '/cuentas-por-cobrar';
    const itemPath = item.nombreMen.toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    return `${basePath}/${itemPath}`;
  }

  /**
   * Get the appropriate icon for each system
   */
  getSystemIcon(sistAbrev: string): string {
    const iconMap: { [key: string]: string } = {
      'CC': 'dollar.svg',           // CUENTAS POR COBRAR
      'CP': 'billing.svg',          // CUENTAS POR PAGAR
      'CG': 'analytics.svg',        // CONTABILIDAD GENERAL
      'AD': 'admin.svg',            // ADMINISTRADOR
      'IN': 'briefcase.svg',        // INVENTARIO
      'CO': 'purchases.svg',        // COMPRAS
      'VE': 'pay.svg',              // VENTAS
      'RE': 'charts.svg',           // REPORTES
      'CF': 'settings.svg',         // CONFIGURACIÓN
      'TE': 'financial.svg',         // TESORERÍA
      'Ge': 'admin.svg',         // ADMINISTRACION DEL SISTEMA
      'NF': 'niif.svg',         // NIIF
      'SY': 'especial.svg',         // ESPECIAL


    };

    // Buscar coincidencia exacta
    if (iconMap[sistAbrev]) {
      return iconMap[sistAbrev];
    }

    // Icono por defecto
    return 'admin.svg';
  }

  /**
   * Toggle between primary and secondary menu
   */
  toggleMenuView(): void {
    this.showSecondaryMenu.set(!this.showSecondaryMenu());
  }
}
