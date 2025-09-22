import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface NitData {
  'Agrega-Nit': string;
  cia: number;
  'nombre-cia': string;
  'date-ctrl': string;
  'login-ctrl': string;
  nit: string;
  'nombre-nit': string;
  'text-nit': string;
  tparent: string;
}

export interface NitItem {
  codigo: string;
  descripcion: string;
  nombre: string;
  nit: string;
}

export interface NitsApiResponse {
  dsRespuesta: {
    tgenit: NitData[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class NitsService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de NITs desde el endpoint GetCEGenit
   * @param pcCompania Código de la compañía
   * @param pcLogin Login del usuario
   * @param pcSuper Valor de super-clav del usuario
   * @param pcToken Token de autenticación
   * @returns Observable con la lista de NITs
   */
  getNits(pcCompania: string, pcLogin: string, pcSuper: boolean, pcToken: string): Observable<NitItem[]> {
    const apiUrl = `${this.baseUrl}/GetCEGenit?pcCompania=${pcCompania}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;

    console.log('🔍 Fetching NITs from API:', {
      url: apiUrl,
      pcCompania: pcCompania,
      pcLogin: pcLogin,
      pcSuper: pcSuper,
      pcToken: pcToken,
      timestamp: new Date().toISOString()
    });

    return this.http.get<NitsApiResponse>(apiUrl).pipe(
      map(response => {
        console.log('📊 Processing NITs data:', {
          response: response,
          timestamp: new Date().toISOString()
        });

        if (response.dsRespuesta && response.dsRespuesta.tgenit) {
          // Convert NIT data to NitItem format
          const nits = response.dsRespuesta.tgenit.map(nit => ({
            codigo: nit.nit,
            descripcion: nit['nombre-nit'],
            nombre: nit['nombre-nit'],
            nit: nit.nit
          }));

          console.log('✅ NITs converted successfully:', {
            nitsLength: nits.length,
            firstNit: nits[0],
            timestamp: new Date().toISOString()
          });

          return nits;
        } else {
          console.warn('No hay NITs en la respuesta');
          return [];
        }
      }),
      catchError(error => {
        console.error('Error recibiendo NITs:', {
          error: error,
          message: error.message,
          status: error.status,
          timestamp: new Date().toISOString()
        });
        return of([]);
      })
    );
  }

  /**
   * Filtra NITs basado en criterios de búsqueda
   * @param searchTerm Término de búsqueda
   * @param nits Lista de NITs a filtrar
   * @returns Lista filtrada de NITs
   */
  filterNits(searchTerm: string, nits: NitItem[]): NitItem[] {
    if (!searchTerm.trim()) {
      return nits;
    }

    const term = searchTerm.toLowerCase().trim();
    return nits.filter(nit =>
      nit.codigo.toLowerCase().includes(term) ||
      nit.descripcion.toLowerCase().includes(term) ||
      nit.nit.toLowerCase().includes(term)
    );
  }

  /**
   * Busca un NIT específico por código
   * @param nitCode Código del NIT a buscar
   * @param pcLogin Login del usuario
   * @param pcSuper Valor de super-clav del usuario
   * @param pcToken Token de autenticación
   * @returns Observable con la respuesta del API
   */
  getNitByCode(nitCode: string, pcLogin: string, pcSuper: string, pcToken: string): Observable<any> {
    const apiUrl = `${this.baseUrl}/GetLeaveNIT?pcNIT=${nitCode}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;

    console.log('🔍 Fetching NIT by code from API:', {
      url: apiUrl,
      nitCode: nitCode,
      pcLogin: pcLogin,
      pcSuper: pcSuper,
      pcToken: pcToken,
      timestamp: new Date().toISOString()
    });

    return this.http.get<any>(apiUrl).pipe(
      map(response => {
        console.log('📊 Processing NIT by code data:', {
          response: response,
          timestamp: new Date().toISOString()
        });
        return response;
      }),
      catchError(error => {
        console.error('Error buscando NIT por código:', {
          error: error,
          message: error.message,
          status: error.status,
          timestamp: new Date().toISOString()
        });
        return of(null);
      })
    );
  }
}
