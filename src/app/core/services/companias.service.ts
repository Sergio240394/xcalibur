import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface CompaniaItem {
  codigo: string;
  descripcion: string;
  nombre: string;
  responsable: string;
  nit: string;
}

export interface CompanyData {
  'Agrega-Cias': string;
  cia: number;
  'ClaveResolucion': string;
  'date-ctrl': string;
  'direc-cia': string;
  'DS_BRANCH_ID': string;
  'DS_ClaveResolucion': number;
  'DS_FechaFinResolucion': string | null;
  'DS_FechaIniResolucion': string | null;
  'DS_MatMercantil': string;
  'DS_NroResolucionDian': string;
  'DS_Prefijo': string;
  'DS_RangoFinResolucion': number;
  'DS_RangoIniResolucion': number;
  'fax-cia': string;
  'FechaFinResolucion': string | null;
  'FechaIniResolucion': string | null;
  'login-ctrl': string;
  'MatMercantil': string;
  nit: string;
  'nombre-cia': string;
  'nomrep-cia': string;
  'NroResolucionDian': string;
  'ObserParametros': string;
  'Prefijo01': string;
  'Prefijo02': string;
  'Prefijo03': string;
  'RangoFinResolucion': number;
  'RangoIniResolucion': number;
  'Resolucion01': string;
  'Resolucion03': string;
  'Resolucion04': string;
  'Resolucion05': string;
  'rif-cia': string;
  'RutaFormatos': string;
  'telefo-cia': string;
  'telex-cia': string;
  'text-cia': string | null;
  'zonpos-cia': string;
  'fecperi-his': string | null;
  'fecmov-his': string | null;
  cuadre: boolean;
  tparent: string;
}

export interface CompaniasApiResponse {
  dsRespuesta: {
    tgecias: CompanyData[];
  };
}

@Injectable({
  providedIn: 'root'
})
export class CompaniasService {
  private readonly baseUrl = environment.apiUrl;
  private todasLasCompanias: CompaniaItem[] = []; // Almacenar todos los registros para búsqueda

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de compañías del sistema
   * @param pcLogin Login del usuario actual
   * @param pcSuper Valor de super-clav del usuario actual
   * @param pcToken Token de autenticación
   * @returns Observable con la lista de compañías
   */
  getCompanias(pcLogin: string, pcSuper: boolean, pcToken: string): Observable<CompaniaItem[]> {
    const apiUrl = `${this.baseUrl}/GetCECompanias?pcLogin=${pcLogin}&pcSuper=${pcSuper}`;

    console.log('🔍 Fetching companias from API:', {
      url: apiUrl,
      pcLogin: pcLogin,
      pcSuper: pcSuper,
      pcToken: pcToken,
      timestamp: new Date().toISOString()
    });

    return this.http.get<CompaniasApiResponse>(apiUrl).pipe(
      map(response => {
        console.log('📊 Processing companias data:', {
          response: response,
          timestamp: new Date().toISOString()
        });

        if (response.dsRespuesta && response.dsRespuesta.tgecias) {
          // Convert company data to CompaniaItem format
          const companias = response.dsRespuesta.tgecias.map(company => ({
            codigo: company.cia.toString(),
            descripcion: company['nombre-cia'],
            nombre: company['nombre-cia'],
            responsable: company['nomrep-cia'] || '',
            nit: company.nit || ''
          }));

          // Almacenar todos los registros para búsqueda
          this.todasLasCompanias = companias;

          console.log('✅ Companias converted successfully:', {
            companiasLength: companias.length,
            firstCompania: companias[0],
            timestamp: new Date().toISOString()
          });

          return companias;
        } else {
          console.warn('No hay compañías en la respuesta');
          return [];
        }
      }),
      catchError(error => {
        console.error('Error recibiendo compañías:', {
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
   * Filtra compañías basado en criterios de búsqueda
   * @param searchTerm Término de búsqueda
   * @returns Lista filtrada de compañías
   */
  filterCompanias(searchTerm: string): CompaniaItem[] {
    if (!searchTerm.trim()) {
      return this.todasLasCompanias;
    }

    const term = searchTerm.toLowerCase().trim();

    console.log('🔍 Buscando en todas las compañías:', {
      terminoBusqueda: searchTerm,
      totalCompaniasDisponibles: this.todasLasCompanias.length,
      timestamp: new Date().toISOString()
    });

    const resultadosFiltrados = this.todasLasCompanias.filter(compania => {
      return compania.codigo.toLowerCase().includes(term) ||
             compania.descripcion.toLowerCase().includes(term);
    });

    console.log('🔍 Resultados de búsqueda:', {
      terminoBusqueda: searchTerm,
      resultadosEncontrados: resultadosFiltrados.length,
      timestamp: new Date().toISOString()
    });

    return resultadosFiltrados;
  }

  /**
   * Busca una compañía específica por su código usando el endpoint GetLeaveGEcias
   * @param pcCompania Código de la compañía a buscar
   * @param pcLogin Login del usuario actual
   * @param pcSuper Valor de super-clav del usuario actual
   * @param pcToken Token de autenticación
   * @returns Observable con la respuesta completa del API
   */
  getCompaniaByCode(
    pcCompania: string,
    pcLogin: string,
    pcSuper: string,
    pcToken: string
  ): Observable<any> {
    const url = `${this.baseUrl}/GetLeaveGEcias`;
    const params = {
      pcCompania,
      pcLogin,
      pcSuper,
      pcToken
    };

    console.log('🌐 [Compañía Service] URL:', url);
    console.log('🌐 [Compañía Service] Parámetros:', params);

    return this.http.get<any>(url, { params }).pipe(
      catchError(error => {
        console.error('Error al buscar compañía:', error);
        return of({ terrores: [{ codigo: 'NETWORK_ERROR', descripcion: 'Error de conexión' }] });
      })
    );
  }
}
