import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface VendedorData {
  'Agrega-Vend': string;
  auxiliarcp: number;
  auxiliargc: number;
  auxiliargv: number;
  centro: number;
  centrocp: number;
  centrogc: number;
  centrogv: number;
  cia: number;
  'nombre-cia': string;
  codsuper: number;
  'comcob-vend': number;
  'comis1-vend': number;
  'comis2-vend': number;
  'comisi-vend': number;
  cuentacp: string;
  cuentagc: string;
  cuentagv: string;
  'date-ctrl': string;
  'login-ctrl': string;
  'nombre-vend': string;
  'text-vend': string;
  tipvend: number;
  ubicacion: number;
  ubicacioncp: number;
  ubicaciongc: number;
  ubicaciongv: number;
  vendedor: number;
  zona: number;
  tparent: string;
}

export interface VendedorItem {
  codigo: string;
  descripcion: string;
  nombre: string;
  vendedor: number;
  // Campos adicionales del objeto original para referencia
  vendedorData: VendedorData;
}

@Injectable({
  providedIn: 'root'
})
export class VendedoresService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /**
   * Obtiene la lista de vendedores desde el endpoint GetCEVendedor
   * @param pcCompania Código de la compañía
   * @param pcLogin Login del usuario
   * @param pcSuper Super usuario (true o false)
   * @param pcToken Token de autenticación
   * @returns Observable con la lista de vendedores
   */
  getVendedores(pcCompania: string, pcLogin: string, pcSuper: boolean, pcToken: string): Observable<VendedorItem[]> {
    const url = `${this.baseUrl}/GetCEVendedor`;

    // Construir parámetros de la URL
    const params = new URLSearchParams({
      pcCompania: pcCompania,
      pcLogin: pcLogin,
      pcSuper: pcSuper.toString(),
      pcToken: pcToken
    });

    const fullUrl = `${url}?${params.toString()}`;

    console.log('🚀 Llamando endpoint GetCEVendedor:', {
      url: fullUrl,
      pcCompania,
      pcLogin,
      pcSuper,
      pcToken: pcToken.substring(0, 10) + '...', // Solo mostrar parte del token por seguridad
      timestamp: new Date().toISOString()
    });

    return this.http.get<any>(fullUrl).pipe(
      map(response => {
        console.log('📥 Respuesta recibida de GetCEVendedor:', response);

        // Procesar la respuesta según la estructura esperada
        if (response && response.dsRespuesta) {
          // Si la respuesta tiene la estructura esperada, procesarla
          const vendedores = this.processVendedoresResponse(response.dsRespuesta);
          console.log('📊 Vendedores procesados:', vendedores);
          return vendedores;
        } else {
          console.warn('⚠️ Respuesta inesperada del endpoint GetCEVendedor:', response);
          return [];
        }
      })
    );
  }

  /**
   * Procesa la respuesta del endpoint para convertirla al formato esperado
   * @param dsRespuesta Respuesta del endpoint
   * @returns Array de vendedores en el formato esperado
   */
  private processVendedoresResponse(dsRespuesta: any): VendedorItem[] {
    // Si la respuesta está vacía, retornar array vacío
    if (!dsRespuesta || Object.keys(dsRespuesta).length === 0) {
      console.log('📭 Respuesta vacía del endpoint GetCEVendedor');
      return [];
    }

    // Procesar los datos del endpoint GetCEVendedor
    if (dsRespuesta.tccvended && Array.isArray(dsRespuesta.tccvended)) {
      const vendedores: VendedorItem[] = dsRespuesta.tccvended.map((vendedor: VendedorData) => ({
        codigo: vendedor.vendedor?.toString() || '',
        descripcion: vendedor['nombre-vend'] || '',
        nombre: vendedor['nombre-vend'] || '',
        vendedor: vendedor.vendedor || 0,
        vendedorData: vendedor
      }));

      console.log('📊 Vendedores procesados desde tccvended:', {
        totalVendedores: dsRespuesta.tccvended.length,
        vendedoresProcesados: vendedores.length,
        primerVendedor: vendedores[0],
        timestamp: new Date().toISOString()
      });

      return vendedores;
    }

    console.warn('⚠️ Estructura de respuesta inesperada en GetCEVendedor:', {
      hasTccvended: !!dsRespuesta.tccvended,
      tccvendedType: typeof dsRespuesta.tccvended,
      dsRespuestaKeys: Object.keys(dsRespuesta),
      timestamp: new Date().toISOString()
    });

    return [];
  }

  /**
   * Filtra los vendedores basado en el término de búsqueda
   * @param vendedores Lista de vendedores
   * @param searchTerm Término de búsqueda
   * @returns Lista filtrada de vendedores
   */
  filterVendedores(vendedores: VendedorItem[], searchTerm: string): VendedorItem[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return vendedores;
    }

    const term = searchTerm.toLowerCase().trim();
    return vendedores.filter(vendedor =>
      vendedor.codigo.toLowerCase().includes(term) ||
      vendedor.descripcion.toLowerCase().includes(term)
    );
  }

  /**
   * Busca un vendedor específico por código
   * @param pcCompania Código de la compañía
   * @param pcVendedor Código del vendedor a buscar
   * @param pcLogin Login del usuario actual
   * @param pcSuper Valor de super-clav del usuario actual
   * @param pcToken Token de autenticación
   * @returns Observable con la respuesta completa del API
   */
  getVendedorByCode(
    pcCompania: string,
    pcVendedor: string,
    pcLogin: string,
    pcSuper: string,
    pcToken: string
  ): Observable<any> {
    const url = `${this.baseUrl}/GetLeaveVendedor`;
    const params = {
      pcCompania,
      pcVendedor,
      pcLogin,
      pcSuper,
      pcToken
    };

    return this.http.get<any>(url, { params }).pipe(
      catchError(error => {
        console.error('Error al buscar vendedor:', error);
        return of({ terrores: [{ codigo: 'NETWORK_ERROR', descripcion: 'Error de conexión' }] });
      })
    );
  }
}
