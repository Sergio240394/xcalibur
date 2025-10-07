import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';

// Import all module components
// import { AccountsReceivableComponent } from './modules/accounts-receivable/accounts-receivable.component';

// import { CompaniesComponent } from './modules/companies/companies.component';
import { CompanyMaintenanceComponent } from './modules/CC/company-maintenance/company-maintenance.component';
import { TransactionLoadComponent } from './modules/CC/transaction-load/transaction-load.component';
// import { ContabilidadGeneralComponent } from './modules/contabilidad-general/contabilidad-general.component';
import { BalanceComprobacionComponent } from './modules/CG/balance-comprobacion/balance-comprobacion.component';

// Import Administrator level 3 components

import { MantenimientoUsuariosComponent } from './modules/GE/mantenimiento-usuarios/mantenimiento-usuarios.component';

// import { MantenimientoErroresComponent, BlanqueoLogsComponent, UsuariosTrabajandoComponent, MantenimientoParametrosComponent, ReporteErroresComponent, ReporteLogsComponent, ReporteErroresSolucionesComponent, ReporteLoginComponent, ReporteTasasCambioComponent, ReporteAuditoriaOpcionesPerfilComponent, ReporteAuditoriaPerfilesLoginComponent, ReporteAuditoriaRestriccionCiasComponent, EjecutorProgramasComponent, MantenimientoTasaReexpresionComponent, MantNitComponent, MantActividadEconomicaComponent, MantAdministracionImpuestosComponent, MantenRetencionFuenteComponent, ReporteNitComponent, ReporteActividadEconomicaComponent, ReporteAdministracionImpuestosComponent, ReporteRetencionFuenteComponent, MantenimientoClasificacionesComponent, MantProgramasSeleccionComponent, MantenimientoEtiquetasComponent } from './modules/administrator/components-2';

// Import Accounts Receivable level 3 components - Solo el que existe
import { ConsultaFacturasClienteComponent } from './modules/CC/consulta-facturas-cliente/consulta-facturas-cliente.component';
import { CargaComprobantesComponent } from './modules/CG/carga-comprobantes/carga-comprobantes.component';

// import { ObservacionGeneralesComponent, NotaCreditoTotalComponent, RegistroOrdenesFacturacionComponent, ActualizaIndicativoFElectronicaCiaComponent, MantenimientoDetallesGeneralesComponent, ReimpresionFacturasComponent, GeneracionFacturacionRecurrenteComponent, ReporteFacturacionRecurrenteComponent, ImportacionOrdenesFacturacionComponent, ReporteGastosFacturacionComponent, ReporteFacturacionOfaRangoFechaComponent, FacturasAnuladasFueraSistemaComponent, FacturacionAsobancariaComponent, EliminaNotasCreditoDebitoComponent, VerificaDiferenciasFacturacionRecurrenteComponent, CargaCodigosCufeFacturasElectronicasComponent, ReporteFacturasSinCodigoCufeUbl2Dic19Component, CargaRecurrenteEmailGerenteSocioComponent, CargaAnexosFacturacionComponent, ActualizaCampoLlaveRecurrenteComponent, EliminaRecurrenteExcelComponent, ParametrosObservacionesInglesComponent, MantenimientoDistribucionFacturasComponent, FacturacionRangoFechasComponent, ReporteDiferenciaCambioCxcDetalladoComponent, ReporteRelacionFacturasComponent, ListadoClientesMunicipioComponent, ModificacionDetalleFacturasComponent, ProcesoDiarioComponent, ProcesoMensualComponent, ProcesoAnualComponent, CreaRutaCalculoComponent, CreaRutaContableComponent, GeneradorExcelComponent, ReporteRutaCalculoComponent, ReporteRutaContableComponent, ReporteEspecialComponent } from './modules/accounts-receivable/components-2';

// Import Demo Secondary Menu Component
import { DemoSecondaryMenuComponent } from './demo-secondary-menu/demo-secondary-menu.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },

      // Administrador del Sistema routes
      // { path: 'administrador', component: AdministratorComponent },

      // Compañías routes
      // { path: 'administrador/companias', component: CompaniesComponent },
      { path: 'administrador/companias/mantenimiento-companias', component: CompanyMaintenanceComponent },

      // Personal de sistemas
      // { path: 'administrador/personal-sistemas/compilador', component: CompiladorComponent },
      // { path: 'administrador/personal-sistemas/mantenimiento-proyecto', component: MantenimientoProyectoComponent },
      // { path: 'administrador/personal-sistemas/mantenimiento-identif-cliente', component: MantenimientoIdentifClienteComponent },

      // Autorización a usuarios
      { path: 'administrador/autorizacion-usuarios/mantenimiento-usuarios', component: MantenimientoUsuariosComponent },

      // Programas especiales
      // { path: 'administrador/programas-especiales/mantenimiento-errores', component: MantenimientoErroresComponent },
      // { path: 'administrador/programas-especiales/blanqueo-logs', component: BlanqueoLogsComponent },
      // { path: 'administrador/programas-especiales/usuarios-trabajando', component: UsuariosTrabajandoComponent },
      // { path: 'administrador/programas-especiales/mantenimiento-parametros', component: MantenimientoParametrosComponent },
      // { path: 'administrador/programas-especiales/reporte-errores', component: ReporteErroresComponent },
      // { path: 'administrador/programas-especiales/reporte-logs', component: ReporteLogsComponent },
      // { path: 'administrador/programas-especiales/reporte-errores-soluciones', component: ReporteErroresSolucionesComponent },
      // { path: 'administrador/programas-especiales/reporte-login', component: ReporteLoginComponent },
      // { path: 'administrador/programas-especiales/reporte-tasas-cambio', component: ReporteTasasCambioComponent },
      // { path: 'administrador/programas-especiales/reporte-auditoria-opciones-perfil', component: ReporteAuditoriaOpcionesPerfilComponent },
      // { path: 'administrador/programas-especiales/reporte-auditoria-perfiles-login', component: ReporteAuditoriaPerfilesLoginComponent },
      // { path: 'administrador/programas-especiales/reporte-auditoria-restriccion-cias', component: ReporteAuditoriaRestriccionCiasComponent },
      // { path: 'administrador/programas-especiales/ejecutor-programas', component: EjecutorProgramasComponent },

      // Procesos eventuales
      // { path: 'administrador/procesos-eventuales/mantenimiento-tasa-reexpresion', component: MantenimientoTasaReexpresionComponent },
      // { path: 'administrador/procesos-eventuales/mant-nit', component: MantNitComponent },
      // { path: 'administrador/procesos-eventuales/mant-actividad-economica', component: MantActividadEconomicaComponent },
      // { path: 'administrador/procesos-eventuales/mant-administracion-impuestos', component: MantAdministracionImpuestosComponent },
      // { path: 'administrador/procesos-eventuales/manten-retencion-fuente', component: MantenRetencionFuenteComponent },
      // { path: 'administrador/procesos-eventuales/reporte-nit', component: ReporteNitComponent },
      // { path: 'administrador/procesos-eventuales/reporte-actividad-economica', component: ReporteActividadEconomicaComponent },
      // { path: 'administrador/procesos-eventuales/reporte-administracion-impuestos', component: ReporteAdministracionImpuestosComponent },
      // { path: 'administrador/procesos-eventuales/reporte-retencion-fuente', component: ReporteRetencionFuenteComponent },

      // Opciones de sistema
      // { path: 'administrador/opciones-sistema/mantenimiento-clasificaciones', component: MantenimientoClasificacionesComponent },
      // { path: 'administrador/opciones-sistema/mant-programas-seleccion', component: MantProgramasSeleccionComponent },
      // { path: 'administrador/opciones-sistema/mantenimiento-etiquetas', component: MantenimientoEtiquetasComponent },

      // Cuentas x Cobrar routes
      // { path: 'cuentas-por-cobrar', component: AccountsReceivableComponent },

      // Contabilidad General routes
      // { path: 'contabilidad-general', component: ContabilidadGeneralComponent },
      { path: 'contabilidad-general/reportes-principales/balance-comprobacion', component: BalanceComprobacionComponent },

      // Transacciones routes
      { path: 'transacciones', component: TransactionLoadComponent },

      // Procesos principales - Solo la ruta que existe
      { path: 'cuentas-por-cobrar/procesos-principales/consulta-facturas-cliente', component: ConsultaFacturasClienteComponent },
      { path: 'cuentas-por-pagar/procesos-principales/carga-comprobantes', component: CargaComprobantesComponent },

      // Reportes principales - Comentados hasta que se creen los componentes
      // { path: 'cuentas-por-cobrar/reportes-principales/recaudo-consolidado-product-group', component: RecaudoConsolidadoProductGroupComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/informe-ingresos-trimestre-pg', component: InformeIngresosTrimestrePgComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/facturacion-recaudo-socio-mensual', component: FacturacionRecaudoSocioMensualComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/reporte-fact-recaudo-gerente', component: ReporteFactRecaudoGerenteComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/reporte-movimiento-dia', component: ReporteMovimientoDiaComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/reporte-movimiento-mensual', component: ReporteMovimientoMensualComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/analisis-detallado', component: AnalisisDetalladoComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/analisis-vencimientos-especiales', component: AnalisisVencimientosEspecialesComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/estado-cuenta-historico', component: EstadoCuentaHistoricoComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/estado-cuenta-pendiente', component: EstadoCuentaPendienteComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/carta-clientes', component: CartaClientesComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/clientes-morosos', component: ClientesMorososComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/cobranza-dia', component: CobranzaDiaComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/cobranza-mes', component: CobranzaMesComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/resumen-cuentas-cobrar', component: ResumenCuentasCobrarComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/estado-cta-hist-consolidado', component: EstadoCtaHistConsolidadoComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/estado-cta-pend-consolidado', component: EstadoCtaPendConsolidadoComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/comprobantes-documentos', component: ComprobantesDocumentosComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/documentos-entregar', component: DocumentosEntregarComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/movimiento-lote-selectivo', component: MovimientoLoteSelectivoComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/movimiento-lote', component: MovimientoLoteComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/movimiento-lote-mensual', component: MovimientoLoteMensualComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/estado-documento-cobro-aler', component: EstadoDocumentoCobroAlerComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/resumen-documento-cobro', component: ResumenDocumentoCobroComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/relacion-contable-doc-cobrado', component: RelacionContableDocCobradoComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/estado-cuenta-historico-otra-moneda', component: EstadoCuentaHistoricoOtraMonedaComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/analisis-por-moneda', component: AnalisisPorMonedaComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/rep-fact-recaudo-ciudad-pg', component: RepFactRecaudoCiudadPgComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/rep-fact-recaudo-pg', component: RepFactRecaudoPgComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/reporte-moneda-extranjera-dane', component: ReporteMonedaExtranjeraDaneComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/notas-rango-modificacion-facturas', component: NotasRangoModificacionFacturasComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/generacion-archivo-factura-electronica', component: GeneracionArchivoFacturaElectronicaComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/parametros-facturacion', component: ParametrosFacturacionComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/configuracion-clientes-electronicos', component: ConfiguracionClientesElectronicosComponent },
      // { path: 'cuentas-por-cobrar/reportes-principales/otros-datos-facturacion-electronica', component: OtrosDatosFacturacionElectronicaComponent },

      // Procesos facturación
      // { path: 'cuentas-por-cobrar/procesos-facturacion/modificacion-detalle-facturas', component: ModificacionDetalleFacturasComponent },

      // Procesos de cierre
      // { path: 'cuentas-por-cobrar/cierre/proceso-diario', component: ProcesoDiarioComponent },
      // { path: 'cuentas-por-cobrar/cierre/proceso-mensual', component: ProcesoMensualComponent },
      // { path: 'cuentas-por-cobrar/cierre/proceso-anual', component: ProcesoAnualComponent },

      // Generadores
      // { path: 'cuentas-por-cobrar/generadores/crea-ruta-calculo', component: CreaRutaCalculoComponent },
      // { path: 'cuentas-por-cobrar/generadores/crea-ruta-contable', component: CreaRutaContableComponent },
      // { path: 'cuentas-por-cobrar/generadores/generador-excel', component: GeneradorExcelComponent },
      // { path: 'cuentas-por-cobrar/generadores/reporte-ruta-calculo', component: ReporteRutaCalculoComponent },
      // { path: 'cuentas-por-cobrar/generadores/reporte-ruta-contable', component: ReporteRutaContableComponent },
      // { path: 'cuentas-por-cobrar/generadores/reporte-especial', component: ReporteEspecialComponent },

      // Demo Secondary Menu
      { path: 'demo-secondary-menu', component: DemoSecondaryMenuComponent },

      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ]
  }
];
