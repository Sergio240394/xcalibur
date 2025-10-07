import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface CentroCostoItem {
  'Agrega-Cenc': string;
  centro: number;
  cia: number;
  'nombre-cia': string;
  'date-ctrl': string;
  'login-ctrl': string;
  'nombre-cen': string;
  'text-cen': string;
  tparent: string;
  terrores?: Array<{
    codigo: string;
    descripcion: string;
    tPARENT: string;
  }>;
}

export interface CentroCostoResponse {
  dsRespuesta?: {
    tgecencos?: CentroCostoItem[];
  };
  terrores?: {
    codigo: string;
    descripcion: string;
    tPARENT: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class CentroCostosService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCentroCostoByCode(
    pcCompania: string,
    pcCuentaC: string,
    pcCentro: string,
    pcLogin: string,
    pcSuper: string,
    pcToken: string
  ): Observable<CentroCostoResponse> {
    const apiUrl = `${this.baseUrl}/GetLeaveCentroCCxC?pcCompania=${pcCompania}&pcCuentaC=${pcCuentaC}&pcCentro=${pcCentro}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;

    console.log('🔍 === BUSCANDO CENTRO DE COSTO ESPECÍFICO ===');
    console.log('🌐 Endpoint:', apiUrl);
    console.log('📤 Parámetros:', { pcCompania, pcCuentaC, pcCentro, pcLogin, pcSuper, pcToken });

    return this.http.get<CentroCostoResponse>(apiUrl).pipe(
      map(response => {
        console.log('✅ === RESPUESTA EXITOSA DEL API GetLeaveCentroCCxC ===');
        console.log('📥 Respuesta completa:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ === ERROR EN LA PETICIÓN AL API GetLeaveCentroCCxC ===');
        console.error('📥 Error completo:', error);
        throw error;
      })
    );
  }

  getCentrosCostoList(
    pcCompania: string,
    pcLogin: string,
    pcSuper: string,
    pcToken: string
  ): Observable<CentroCostoResponse> {
    const apiUrl = `${this.baseUrl}/GetCECentroCCxC?pcCompania=${pcCompania}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;

    console.log('🔍 === BUSCANDO LISTA DE CENTROS DE COSTO ===');
    console.log('🌐 Endpoint:', apiUrl);
    console.log('📤 Parámetros:', { pcCompania, pcLogin, pcSuper, pcToken });

    return this.http.get<CentroCostoResponse>(apiUrl).pipe(
      map(response => {
        console.log('✅ === RESPUESTA EXITOSA DEL API GetCECentroCCxC ===');
        console.log('📥 Respuesta completa:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ === ERROR EN LA PETICIÓN AL API GetCECentroCCxC ===');
        console.error('📥 Error completo:', error);
        throw error;
      })
    );
  }
}
