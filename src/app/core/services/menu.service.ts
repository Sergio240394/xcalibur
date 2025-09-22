import { Injectable, signal } from '@angular/core';
import { MenuItemData, MenuResponse, MenuLevel1, MenuLevel2, MenuLevel3 } from '../interfaces/menu.interface';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private readonly menuData = signal<MenuItemData[]>([]);
  private readonly menuHierarchy = signal<MenuLevel1[]>([]);

  /**
   * Establece los datos del menú desde la respuesta del login
   * @param menuResponse Respuesta del endpoint de login
   */
  setMenuData(menuResponse: MenuResponse): void {
    if (menuResponse.dsRespuesta && menuResponse.dsRespuesta.tgemenu) {
      console.log('📋 Estableciendo datos del menú:', {
        totalItems: menuResponse.dsRespuesta.tgemenu.length,
        firstItem: menuResponse.dsRespuesta.tgemenu[0],
        timestamp: new Date().toISOString()
      });

      this.menuData.set(menuResponse.dsRespuesta.tgemenu);
      this.buildMenuHierarchy();

      // Guardar en localStorage
      this.saveMenuToLocalStorage();
    } else {
      console.warn('⚠️ No hay datos de menú en la respuesta:', menuResponse);
      this.menuData.set([]);
      this.menuHierarchy.set([]);
    }
  }

  /**
   * Obtiene los datos del menú
   * @returns Array de items del menú
   */
  getMenuData(): MenuItemData[] {
    return this.menuData();
  }

  /**
   * Obtiene la jerarquía del menú organizada
   * @returns Jerarquía del menú (Sistema -> Grupo -> Items)
   */
  getMenuHierarchy(): MenuLevel1[] {
    return this.menuHierarchy();
  }

  /**
   * Construye la jerarquía del menú a partir de los datos planos
   */
  private buildMenuHierarchy(): void {
    const menuItems = this.menuData();

    if (menuItems.length === 0) {
      this.menuHierarchy.set([]);
      return;
    }

    console.log('🏗️ Construyendo jerarquía del menú:', {
      totalItems: menuItems.length,
      timestamp: new Date().toISOString()
    });

    // Agrupar por sistema (Nivel 1)
    const sistemasMap = new Map<string, MenuLevel1>();

    menuItems.forEach(item => {
      const sistemaKey = item.sistema;

      if (!sistemasMap.has(sistemaKey)) {
        sistemasMap.set(sistemaKey, {
          sistema: item.sistema,
          sistAbrev: item.sistAbrev,
          grupos: []
        });
      }

      const sistema = sistemasMap.get(sistemaKey)!;

      // Buscar o crear el grupo (Nivel 2)
      let grupo = sistema.grupos.find(g => g.grupoMen === item.grupoMen);
      if (!grupo) {
        grupo = {
          grupoMen: item.grupoMen,
          items: []
        };
        sistema.grupos.push(grupo);
      }

      // Agregar el item (Nivel 3)
      const menuItem: MenuLevel3 = {
        nombreMen: item.nombreMen,
        loginCtrl: item.loginCtrl,
        token: item.token,
        superClav: item.superClav,
        tparent: item.tparent
      };

      grupo.items.push(menuItem);
    });

    const hierarchy = Array.from(sistemasMap.values());

    console.log('✅ Jerarquía del menú construida:', {
      sistemas: hierarchy.length,
      totalGrupos: hierarchy.reduce((sum, s) => sum + s.grupos.length, 0),
      totalItems: hierarchy.reduce((sum, s) => sum + s.grupos.reduce((gSum, g) => gSum + g.items.length, 0), 0),
      timestamp: new Date().toISOString()
    });

    this.menuHierarchy.set(hierarchy);
  }

  /**
   * Obtiene todos los sistemas disponibles
   * @returns Array de sistemas
   */
  getSistemas(): string[] {
    const hierarchy = this.menuHierarchy();
    return hierarchy.map(s => s.sistema);
  }

  /**
   * Obtiene los grupos de un sistema específico
   * @param sistema Nombre del sistema
   * @returns Array de grupos del sistema
   */
  getGruposBySistema(sistema: string): MenuLevel2[] {
    const hierarchy = this.menuHierarchy();
    const sistemaData = hierarchy.find(s => s.sistema === sistema);
    return sistemaData ? sistemaData.grupos : [];
  }

  /**
   * Obtiene los items de un grupo específico
   * @param sistema Nombre del sistema
   * @param grupo Nombre del grupo
   * @returns Array de items del grupo
   */
  getItemsByGrupo(sistema: string, grupo: string): MenuLevel3[] {
    const grupos = this.getGruposBySistema(sistema);
    const grupoData = grupos.find(g => g.grupoMen === grupo);
    return grupoData ? grupoData.items : [];
  }

  /**
   * Limpia los datos del menú
   */
  clearMenu(): void {
    this.menuData.set([]);
    this.menuHierarchy.set([]);

    // Limpiar también del localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('xcalibur_menu_data');
      localStorage.removeItem('xcalibur_menu_hierarchy');
    }

    console.log('🗑️ Datos del menú limpiados');
  }

  /**
   * Guarda los datos del menú en localStorage
   */
  private saveMenuToLocalStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const menuData = this.menuData();
        const menuHierarchy = this.menuHierarchy();

        localStorage.setItem('xcalibur_menu_data', JSON.stringify(menuData));
        localStorage.setItem('xcalibur_menu_hierarchy', JSON.stringify(menuHierarchy));

        console.log('💾 Menú guardado en localStorage:', {
          menuDataLength: menuData.length,
          menuHierarchyLength: menuHierarchy.length,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('❌ Error guardando menú en localStorage:', error);
      }
    }
  }

  /**
   * Carga los datos del menú desde localStorage
   */
  loadMenuFromLocalStorage(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const savedMenuData = localStorage.getItem('xcalibur_menu_data');
        const savedMenuHierarchy = localStorage.getItem('xcalibur_menu_hierarchy');

        if (savedMenuData && savedMenuHierarchy) {
          const menuData = JSON.parse(savedMenuData);
          const menuHierarchy = JSON.parse(savedMenuHierarchy);

          this.menuData.set(menuData);
          this.menuHierarchy.set(menuHierarchy);

          console.log('📂 Menú cargado desde localStorage:', {
            menuDataLength: menuData.length,
            menuHierarchyLength: menuHierarchy.length,
            timestamp: new Date().toISOString()
          });

          return true;
        }
      } catch (error) {
        console.error('❌ Error cargando menú desde localStorage:', error);
        // Limpiar datos corruptos
        localStorage.removeItem('xcalibur_menu_data');
        localStorage.removeItem('xcalibur_menu_hierarchy');
      }
    }

    return false;
  }
}
