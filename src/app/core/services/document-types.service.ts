import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface DocumentTypeData {
  'afecxc-tdoc': boolean;
  'afeinv-tdoc': boolean;
  'afesta-tdoc': boolean;
  'Agrega-Tipd': string | null;
  auxiliarm1: number;
  centrom1: number;
  cia: number;
  'nombre-cia': string;
  'clase-tdoc': number;
  cuentam1: string;
  'date-ctrl': string;
  'login-ctrl': string;
  'nombre-tdoc': string;
  'numfac-tdoc': number;
  'numped-tdoc': number;
  'profac-tdoc': number;
  'siglas-tdoc': string;
  'text-tdoc': string;
  tipcomi: number;
  tipodoc: number;
  ubicacionm1: number;
  'saldo-doc': number;
  'fecemi-doc': string | null;
  'fecven-doc': string | null;
  descripcion: string;
  tparent: string;
}

export interface DocumentTypesApiResponse {
  dsRespuesta: {
    tcctipdoc: DocumentTypeData[];
  };
}

export interface SearchItem {
  codigo: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentTypesService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de tipos de documento del sistema
   * @param pcCompania Código de la compañía
   * @param pcToken Token del usuario actual
   * @returns Observable con la lista de tipos de documento
   */
  getDocumentTypes(pcCompania: string, pcToken: string): Observable<SearchItem[]> {
    const apiUrl = `${this.baseUrl}/GetCETipodoc?pcCompania=${pcCompania}&pcToken=${pcToken}`;

    console.log('🔍 Fetching document types from API:', {
      url: apiUrl,
      pcCompania: pcCompania,
      pcToken: pcToken,
      timestamp: new Date().toISOString()
    });

    return this.http.get<DocumentTypesApiResponse>(apiUrl).pipe(
      map(response => {
        console.log('📊 Processing document types data:', {
          response: response,
          timestamp: new Date().toISOString()
        });

        if (response.dsRespuesta && response.dsRespuesta.tcctipdoc) {
          // Convert document type data to SearchItem format
          const documentTypes = response.dsRespuesta.tcctipdoc.map(docType => ({
            codigo: docType.tipodoc.toString(),
            descripcion: docType['nombre-tdoc']
          }));

          console.log('✅ Document types converted successfully:', {
            documentTypesLength: documentTypes.length,
            firstDocumentType: documentTypes[0],
            timestamp: new Date().toISOString()
          });

          return documentTypes;
        } else {
          console.warn('No hay tipos de documento en la respuesta');
          return [];
        }
      }),
      catchError(error => {
        console.error('Error recibiendo tipos de documento:', {
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
   * Filtra tipos de documento basado en criterios de búsqueda
   * @param documentTypes Lista de tipos de documento
   * @param searchTerm Término de búsqueda
   * @returns Lista filtrada de tipos de documento
   */
  filterDocumentTypes(documentTypes: SearchItem[], searchTerm: string): SearchItem[] {
    if (!searchTerm.trim()) {
      return documentTypes;
    }

    const term = searchTerm.toLowerCase().trim();

    return documentTypes.filter(docType => {
      return docType.codigo.toLowerCase().includes(term) ||
             docType.descripcion.toLowerCase().includes(term);
    });
  }
}
