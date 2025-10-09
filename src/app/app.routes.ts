import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';

import { CompanyMaintenanceComponent } from './modules/CC/company-maintenance/company-maintenance.component';
import { TransactionLoadComponent } from './modules/CC/transaction-load/transaction-load.component';
import { BalanceComprobacionComponent } from './modules/CG/balance-comprobacion/balance-comprobacion.component';

import { MantenimientoUsuariosComponent } from './modules/GE/mantenimiento-usuarios/mantenimiento-usuarios.component';

import { ConsultaFacturasClienteComponent } from './modules/CC/consulta-facturas-cliente/consulta-facturas-cliente.component';
import { CargaComprobantesComponent } from './modules/CG/carga-comprobantes/carga-comprobantes.component';

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
      // Autorización a usuarios
      { path: 'administrador/autorizacion-usuarios/mantenimiento-usuarios', component: MantenimientoUsuariosComponent },

      { path: 'contabilidad-general/reportes-principales/balance-comprobacion', component: BalanceComprobacionComponent },

      // Transacciones routes
      { path: 'transacciones', component: TransactionLoadComponent },

      // Procesos principales - Solo la ruta que existe
      { path: 'cuentas-por-cobrar/procesos-principales/consulta-facturas-cliente', component: ConsultaFacturasClienteComponent },
      { path: 'cuentas-por-pagar/procesos-principales/carga-comprobantes', component: CargaComprobantesComponent },

      // Demo Secondary Menu
      { path: 'demo-secondary-menu', component: DemoSecondaryMenuComponent },

      { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
    ]
  }
];
