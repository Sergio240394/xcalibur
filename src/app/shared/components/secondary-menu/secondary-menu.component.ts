import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

interface SecondaryMenuItem {
  path: string;
  label: string;
  icon?: string;
  children?: SecondaryMenuItem[];
}

@Component({
  selector: 'app-secondary-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, SvgIconComponent],
  templateUrl: './secondary-menu.component.html',
  styleUrls: ['./secondary-menu.component.css']
})
export class SecondaryMenuComponent {
  public readonly expandedItems = signal<Set<number>>(new Set());

  public readonly menuItems = signal<SecondaryMenuItem[]>([
    {
      path: '/administrador',
      label: 'Administrador del sistema',
      icon: 'admin.svg',
      children: [
        { path: '/administrador/autorizacion-usuarios/mantenimiento-usuarios', label: 'Mantenimientos de usuarios' }
      ]
    },
    {
      path: '/cuentas-por-cobrar',
      label: 'Contabilidad general',
      icon: 'team.svg',
      children: [
        { path: '/administrador/companias/mantenimiento-companias', label: 'Mantenimiento de empresas' },
        { path: '/cuentas-por-cobrar/procesos-principales/consulta-facturas-cliente', label: 'Consulta de facturas por cliente' },
        { path: '/transacciones', label: 'Carga de transacciones' },
      ]
    },
    {
      path: '/cuentas-por-pagar',
      label: 'Cuentas por pagar',
      icon: 'dollar.svg',
      children: [
        { path: '/contabilidad-general/reportes-principales/balance-comprobacion', label: 'Balance de comprobación' },
        { path: '/cuentas-por-pagar/procesos-principales/carga-comprobantes', label: 'Carga de comprobantes' }
      ]
    }
  ]);

  public toggleItem(index: number): void {
    const current = this.expandedItems();
    const newSet = new Set(current);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    this.expandedItems.set(newSet);
  }

  public isExpanded(index: number): boolean {
    return this.expandedItems().has(index);
  }
}
