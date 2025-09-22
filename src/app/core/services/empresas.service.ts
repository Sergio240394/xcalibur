import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface EmpresaData {
  'abrenom-emp': string;
  'Agrega-Empr': string;
  'bacord-emp': boolean;
  'cappag-emp': number;
  'capsus-emp': number;
  'causa-susp': number;
  cia: number;
  ciudad: string;
  clacob: string;
  claven: string;
  cobrador: number;
  'codigo-cob1': number;
  'codigo-cob2': number;
  'codigo-cob3': number;
  'codigo-cob4': number;
  'codigo-cob5': number;
  condpago: number;
  'contri-emp': number;
  'date-ctrl': string;
  'diacaj-emp': number;
  'direc-emp': string;
  'dirent-emp': string;
  'email-emp': string;
  empresa: number;
  'fax-emp': string;
  'fecauli-emp': string | null;
  'fecing-emp': string;
  'fecmdreg-emp': string | null;
  'fecreg-emp': string | null;
  'limite-emp': number;
  localidad: number;
  'login-ctrl': string;
  moneda: number;
  negocio: number;
  nit: string;
  'nombre-emp': string;
  'nomcon-emp': string;
  pais: string;
  'pordes-emp': number;
  'razsoc-emp': string;
  'regmer-emp': string;
  'rif-emp': string;
  ruta: number;
  sector: number;
  'secuen-emp': number;
  'telefo-emp': string;
  'telex-emp': string;
  'text-emp': string;
  tipocli: number;
  'tippre-emp': number;
  transporte: number;
  vendedor: number;
  zona: number;
  'zonpos-emp': string;
  tparent: string;
}

export interface EmpresasApiResponse {
  dsRespuesta: {
    // Estructura real del endpoint GetCEEmpresa
    empresas?: EmpresaData[];
    tccempres2?: any[]; // Array de empresas que devuelve realmente el endpoint
  };
}

export interface SearchItem {
  codigo: string;
  descripcion: string;
}

export interface EmpresaItem {
  codigo: string;
  descripcion: string;
  nombre: string;
  vendedor: number;
  condicionPago: number;
  direccion: string;
  telefono: string;
  fax: string;
  zonaPostal: string;
  rif: string;
  nit: string;
  // Campos adicionales del objeto original para referencia
  empresaData: EmpresaData;
}

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {
  private readonly baseUrl = environment.apiUrl;
  private todasLasEmpresas: SearchItem[] = []; // Almacenar todos los registros para búsqueda

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de empresas del sistema
   * @param pcCompania Código de la compañía
   * @param pcLogin Login del usuario actual
   * @param pcSuper Valor de super-clav del usuario actual
   * @param pcToken Token de autenticación
   * @returns Observable con la lista de empresas
   */
  getEmpresas(pcCompania: string, pcLogin: string, pcSuper: boolean, pcToken: string): Observable<EmpresaItem[]> {
    const apiUrl = `${this.baseUrl}/GetCEEmpresa?pcCompania=${pcCompania}&pcLogin=${pcLogin}&pcSuper=${pcSuper}`;

    console.log('🔍 Fetching empresas from API:', {
      url: apiUrl,
      pcCompania: pcCompania,
      pcLogin: pcLogin,
      pcSuper: pcSuper,
      timestamp: new Date().toISOString()
    });

    return this.http.get<EmpresasApiResponse>(apiUrl).pipe(
      map(response => {
        console.log('📊 Processing empresas data:', {
          response: response,
          timestamp: new Date().toISOString()
        });

        // Log detallado de la estructura de datos
        if (response.dsRespuesta && response.dsRespuesta.tccempres2) {
          console.log('🔍 Estructura de datos de empresas:', {
            totalItems: response.dsRespuesta.tccempres2.length,
            firstItem: response.dsRespuesta.tccempres2[0],
            sampleKeys: response.dsRespuesta.tccempres2[0] ? Object.keys(response.dsRespuesta.tccempres2[0]) : [],
            timestamp: new Date().toISOString()
          });
        }

        // Procesar la respuesta real del endpoint
        if (response.dsRespuesta && response.dsRespuesta.tccempres2) {
          const todasLasEmpresas: EmpresaItem[] = response.dsRespuesta.tccempres2.map((empresa: EmpresaData) => ({
            codigo: empresa.empresa?.toString() || '',
            descripcion: empresa['nombre-emp'] || '',
            nombre: empresa['nombre-emp'] || '',
            vendedor: empresa.vendedor || 0,
            condicionPago: empresa.condpago || 0,
            direccion: empresa['direc-emp'] || '',
            telefono: empresa['telefo-emp'] || '',
            fax: empresa['fax-emp'] || '',
            zonaPostal: empresa['zonpos-emp'] || '',
            rif: empresa['rif-emp'] || '',
            nit: empresa.nit || '',
            empresaData: empresa
          }));

          // Almacenar todos los registros para búsqueda (convertir a SearchItem para compatibilidad)
          this.todasLasEmpresas = todasLasEmpresas.map(emp => ({
            codigo: emp.codigo,
            descripcion: emp.descripcion
          }));

          // Limitar a los primeros 300 registros para mostrar inicialmente
          const empresasLimitadas = todasLasEmpresas.slice(0, 300);

          console.log('✅ Empresas processed successfully:', {
            totalEmpresas: todasLasEmpresas.length,
            empresasMostradas: empresasLimitadas.length,
            empresasAlmacenadasParaBusqueda: this.todasLasEmpresas.length,
            firstEmpresa: empresasLimitadas[0],
            timestamp: new Date().toISOString()
          });

          // Retornar solo los primeros 300 para evitar problemas de rendimiento
          return empresasLimitadas;
        } else {
          console.warn('⚠️ No hay empresas en la respuesta. Estructura recibida:', {
            hasDsRespuesta: !!response.dsRespuesta,
            dsRespuestaKeys: response.dsRespuesta ? Object.keys(response.dsRespuesta) : [],
            fullResponse: response
          });
          return [];
        }
      }),
      catchError(error => {
        console.error('Error recibiendo empresas:', {
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
   * Filtra empresas basado en criterios de búsqueda
   * Busca en TODOS los registros devueltos por el endpoint, no solo en los mostrados
   * @param empresas Lista de empresas mostradas (no se usa para la búsqueda)
   * @param searchTerm Término de búsqueda
   * @returns Lista filtrada de empresas (máximo 300 resultados)
   */
  filterEmpresas(empresas: SearchItem[], searchTerm: string): SearchItem[] {
    if (!searchTerm.trim()) {
      // Si no hay término de búsqueda, devolver los primeros 300
      return this.todasLasEmpresas.slice(0, 300);
    }

    const term = searchTerm.toLowerCase().trim();

    console.log('🔍 Buscando en todas las empresas:', {
      terminoBusqueda: searchTerm,
      totalEmpresasDisponibles: this.todasLasEmpresas.length,
      timestamp: new Date().toISOString()
    });

    // Buscar en TODOS los registros almacenados
    const resultadosFiltrados = this.todasLasEmpresas.filter(empresa => {
      return empresa.codigo.toLowerCase().includes(term) ||
             empresa.descripcion.toLowerCase().includes(term);
    });

    // Limitar los resultados a 300 para evitar problemas de rendimiento
    const resultadosLimitados = resultadosFiltrados.slice(0, 300);

    console.log('🔍 Resultados de búsqueda:', {
      terminoBusqueda: searchTerm,
      resultadosEncontrados: resultadosFiltrados.length,
      resultadosMostrados: resultadosLimitados.length,
      timestamp: new Date().toISOString()
    });

    return resultadosLimitados;
  }

  /**
   * Busca una empresa específica por código
   * @param pcCompania Código de la compañía
   * @param pcLogin Login del usuario actual
   * @param pcSuper Valor de super-clav del usuario actual
   * @param pcToken Token de autenticación
   * @param pcEmpresa Código de la empresa a buscar
   * @returns Observable con la respuesta completa del API
   */
  getEmpresaByCode(
    pcCompania: string,
    pcLogin: string,
    pcSuper: string,
    pcToken: string,
    pcEmpresa: string
  ): Observable<any> {
    const url = `${this.baseUrl}/GetEmpresa`;
    const params = {
      pcCompania,
      pcLogin,
      pcSuper,
      pcToken,
      pcEmpresa
    };

    return this.http.get<any>(url, { params }).pipe(
      catchError(error => {
        console.error('Error al buscar empresa:', error);
        return of({ terrores: [{ codigo: 'NETWORK_ERROR', descripcion: 'Error de conexión' }] });
      })
    );
  }
}
