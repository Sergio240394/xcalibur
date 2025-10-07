import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface CondicionPagoData {
  'Agrega-Conp': string;
  'cancuo-cpag': number;
  cia: number;
  'nombre-cia': string;
  condpago: number;
  'date-ctrl': string;
  'diacuo-cpag': number;
  'diapla-cpag': number;
  'login-ctrl': string;
  'nombre-cpag': string;
  'porfin-cpag': number;
  'porini-cpag': number;
  'text-cpag': string;
  tparent: string;
  terrores?: Array<{
    codigo: string;
    descripcion: string;
    tPARENT: string;
  }>;
}

export interface CondicionPagoItem {
  codigo: string;
  descripcion: string;
  nombre: string;
  condpago: number;
  // Campos adicionales del objeto original para referencia
  condicionPagoData: CondicionPagoData;
}

@Injectable({
  providedIn: 'root'
})
export class CondicionesPagoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /**
   * Obtiene la lista de condiciones de pago desde el endpoint GetCECondPago
   * @param pcCompania Código de la compañía
   * @param pcLogin Login del usuario
   * @param pcSuper Super usuario (true o false)
   * @param pcToken Token de autenticación
   * @returns Observable con la lista de condiciones de pago
   */
  getCondicionesPago(pcCompania: string, pcLogin: string, pcSuper: string, pcToken: string): Observable<CondicionPagoItem[]> {
    const url = `${this.baseUrl}/GetCECondPago`;

    // Construir parámetros de la URL
    const params = new URLSearchParams({
      pcCompania: pcCompania,
      pcLogin: pcLogin,
      pcSuper: pcSuper.toString(),
      pcToken: pcToken
    });

    const fullUrl = `${url}?${params.toString()}`;

    return this.http.get<any>(fullUrl).pipe(
      map(response => {
        // Procesar la respuesta según la estructura esperada
        if (response && response.dsRespuesta) {
          return this.processCondicionesPagoResponse(response.dsRespuesta);
        } else {
          return [];
        }
      }),
      catchError(error => {
        console.error('Error al obtener condiciones de pago:', error);
        return of([]);
      })
    );
  }

  /**
   * Procesa la respuesta del endpoint para convertirla al formato esperado
   * @param dsRespuesta Respuesta del endpoint
   * @returns Array de condiciones de pago en el formato esperado
   */
  private processCondicionesPagoResponse(dsRespuesta: any): CondicionPagoItem[] {
    if (!dsRespuesta || Object.keys(dsRespuesta).length === 0) {
      return [];
    }

    // Procesar los datos del endpoint GetCECondPago
    if (dsRespuesta.tccconpag && Array.isArray(dsRespuesta.tccconpag)) {
      const condicionesPago: CondicionPagoItem[] = dsRespuesta.tccconpag.map((condicion: CondicionPagoData) => ({
        codigo: condicion.condpago?.toString() || '',
        descripcion: condicion['nombre-cpag'] || '',
        nombre: condicion['nombre-cpag'] || '',
        condpago: condicion.condpago || 0,
        condicionPagoData: condicion
      }));

      return condicionesPago;
    }

    return [];
  }

  /**
   * Filtra las condiciones de pago basado en el término de búsqueda
   * @param condicionesPago Lista de condiciones de pago
   * @param searchTerm Término de búsqueda
   * @returns Lista filtrada de condiciones de pago
   */
  filterCondicionesPago(condicionesPago: CondicionPagoItem[], searchTerm: string): CondicionPagoItem[] {
    if (!searchTerm || searchTerm.trim() === '') {
      return condicionesPago;
    }

    const term = searchTerm.toLowerCase().trim();
    return condicionesPago.filter(condicion =>
      condicion.codigo.toLowerCase().includes(term) ||
      condicion.descripcion.toLowerCase().includes(term)
    );
  }

  /**
   * Busca una condición de pago específica por código
   * @param pcCompania Código de la compañía
   * @param pcCondPago Código de la condición de pago a buscar
   * @param pcLogin Login del usuario actual
   * @param pcSuper Valor de super-clav del usuario actual
   * @param pcToken Token de autenticación
   * @returns Observable con la respuesta completa del API
   */
  getCondicionPagoByCode(
    pcCompania: string,
    pcCondPago: string,
    pcLogin: string,
    pcSuper: string,
    pcToken: string
  ): Observable<any> {
    const url = `${this.baseUrl}/GetLeaveCondPago`;
    const params = {
      pcCompania,
      pcCondPago,
      pcLogin,
      pcSuper,
      pcToken
    };

    return this.http.get<any>(url, { params }).pipe(
      catchError(error => {
        console.error('Error al buscar condición de pago:', error);
        return of({ terrores: [{ codigo: 'NETWORK_ERROR', descripcion: 'Error de conexión' }] });
      })
    );
  }
}

