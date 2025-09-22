import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface CuentaItem {
  'Agrega-Cont': string;
  ajuste: boolean;
  'auxili-cta': boolean;
  cia: number | null;
  'nombre-cia': string;
  'clase-cta': string;
  'columna-cta': number;
  'compar-cta': string;
  'consol-cta': boolean;
  'ctapre-cta': string;
  'ctarep-cta': string;
  cuenta: string;
  'date-ctrl': string | null;
  'Fasb-Cta': number;
  fiscal: number;
  gravable: boolean;
  gruaju: number;
  'login-ctrl': string;
  'maacar-cta': string;
  'manCla-cta': boolean;
  'mancos-cta': boolean;
  'manubi-cta': boolean;
  'manufo-cta': boolean;
  moneda: number;
  'nombre-cta': string;
  'reexpre-cta': number;
  'secuen-cta': number;
  'text-cta': string;
  'tipo-cta': string;
  'Unidad-Cta': string;
  valfis: number;
  tparent: string;
  terrores?: Array<{
    codigo: string;
    descripcion: string;
    tPARENT: string;
  }>;
}

export interface CuentaResponse {
  dsRespuesta: {
    tcgcontab: CuentaItem[];
  };
  terrores?: Array<{
    codigo: string;
    descripcion: string;
    tPARENT: string;
  }>;
}

@Injectable({
  providedIn: 'root'
})
export class CuentasService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCuentaByCode(
    pcCompania: string,
    pcCuentaC: string,
    pcLogin: string,
    pcSuper: boolean,
    pcToken: string
  ): Observable<CuentaResponse> {
    const apiUrl = `${this.baseUrl}/GetLeaveCuentaCCxC?pcCompania=${pcCompania}&pcCuentaC=${pcCuentaC}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;

    console.log('🔍 === BUSCANDO CUENTA ESPECÍFICA ===');
    console.log('🌐 Endpoint:', apiUrl);
    console.log('📤 Parámetros:', { pcCompania, pcCuentaC, pcLogin, pcSuper, pcToken });

    return this.http.get<CuentaResponse>(apiUrl).pipe(
      map(response => {
        console.log('✅ === RESPUESTA EXITOSA DEL API GetLeaveCuentaCCxC ===');
        console.log('📥 Respuesta completa:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ === ERROR EN LA PETICIÓN AL API GetLeaveCuentaCCxC ===');
        console.error('📥 Error completo:', error);
        throw error;
      })
    );
  }

  getCuentasList(
    pcCompania: string,
    pcLogin: string,
    pcSuper: boolean,
    pcToken: string
  ): Observable<CuentaResponse> {
    const apiUrl = `${this.baseUrl}/GetCECuentaCCxC?pcCompania=${pcCompania}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;

    console.log('🔍 === BUSCANDO LISTA DE CUENTAS ===');
    console.log('🌐 Endpoint:', apiUrl);
    console.log('📤 Parámetros:', { pcCompania, pcLogin, pcSuper, pcToken });

    return this.http.get<CuentaResponse>(apiUrl).pipe(
      map(response => {
        console.log('✅ === RESPUESTA EXITOSA DEL API GetCECuentaCCxC ===');
        console.log('📥 Respuesta completa:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ === ERROR EN LA PETICIÓN AL API GetCECuentaCCxC ===');
        console.error('📥 Error completo:', error);
        throw error;
      })
    );
  }
}
