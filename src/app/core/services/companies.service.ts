import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

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

export interface CompaniesApiResponse {
  dsRespuesta: {
    tgecias: CompanyData[];
  };
}

export interface SearchItem {
  codigo: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de compañías del sistema
   * @param pcLogin Login del usuario actual
   * @param pcSuper Valor de super-clav del usuario actual
   * @returns Observable con la lista de compañías
   */
  getCompanies(pcLogin: string, pcSuper: boolean): Observable<SearchItem[]> {
    const apiUrl = `${this.baseUrl}/GetCECompanias?pcLogin=${pcLogin}&pcSuper=${pcSuper}`;

    console.log('🔍 Fetching companies from API:', {
      url: apiUrl,
      pcLogin: pcLogin,
      pcSuper: pcSuper,
      timestamp: new Date().toISOString()
    });

    return this.http.get<CompaniesApiResponse>(apiUrl).pipe(
      map(response => {
        console.log('📊 Processing companies data:', {
          response: response,
          timestamp: new Date().toISOString()
        });

        if (response.dsRespuesta && response.dsRespuesta.tgecias) {
          // Convert company data to SearchItem format
          const companies = response.dsRespuesta.tgecias.map(company => ({
            codigo: company.cia.toString(),
            descripcion: company['nombre-cia']
          }));

          console.log('✅ Companies converted successfully:', {
            companiesLength: companies.length,
            firstCompany: companies[0],
            timestamp: new Date().toISOString()
          });

          return companies;
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
   * @param companies Lista de compañías
   * @param searchTerm Término de búsqueda
   * @returns Lista filtrada de compañías
   */
  filterCompanies(companies: SearchItem[], searchTerm: string): SearchItem[] {
    if (!searchTerm.trim()) {
      return companies;
    }

    const term = searchTerm.toLowerCase().trim();

    return companies.filter(company => {
      return company.codigo.toLowerCase().includes(term) ||
             company.descripcion.toLowerCase().includes(term);
    });
  }
}
