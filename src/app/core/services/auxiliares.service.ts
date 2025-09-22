import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface AuxiliarItem {
  'Agrega-Maea': string;
  auxiliar: number;
  cia: number;
  'nombre-cia': string;
  cuenta: string;
  'date-ctrl': string | null;
  'login-ctrl': string;
  nit: string;
  'nombre-aux': string;
  'text-aux': string;
  tparent: string;
  terrores?: Array<{
    codigo: string;
    descripcion: string;
    tPARENT: string;
  }>;
}

export interface AuxiliarResponse {
  dsRespuesta?: {
    tcgmaeaux?: AuxiliarItem[];
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
export class AuxiliaresService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAuxiliarByCode(
    pcCompania: string,
    pcCuentaC: string,
    pcAuxiliar: string,
    pcLogin: string,
    pcSuper: boolean,
    pcToken: string
  ): Observable<AuxiliarResponse> {
    const apiUrl = `${this.baseUrl}/GetLeaveAuxiliarCxC?pcCompania=${pcCompania}&pcCuentaC=${pcCuentaC}&pcAuxiliar=${pcAuxiliar}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;

    console.log('🔍 === BUSCANDO AUXILIAR ESPECÍFICO ===');
    console.log('🌐 Endpoint:', apiUrl);
    console.log('📤 Parámetros:', { pcCompania, pcCuentaC, pcAuxiliar, pcLogin, pcSuper, pcToken });

    return this.http.get<AuxiliarResponse>(apiUrl).pipe(
      map(response => {
        console.log('✅ === RESPUESTA EXITOSA DEL API GetLeaveAuxiliarCxC ===');
        console.log('📥 Respuesta completa:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ === ERROR EN LA PETICIÓN AL API GetLeaveAuxiliarCxC ===');
        console.error('📥 Error completo:', error);
        throw error;
      })
    );
  }

  getAuxiliaresList(
    pcCompania: string,
    pcCuentaC: string,
    pcLogin: string,
    pcSuper: boolean,
    pcToken: string
  ): Observable<AuxiliarResponse> {
    const apiUrl = `${this.baseUrl}/GetCEAuxiliarCxC?pcCompania=${pcCompania}&pcCuentaC=${pcCuentaC}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;

    console.log('🔍 === BUSCANDO LISTA DE AUXILIARES ===');
    console.log('🌐 Endpoint:', apiUrl);
    console.log('📤 Parámetros:', { pcCompania, pcCuentaC, pcLogin, pcSuper, pcToken });

    return this.http.get<AuxiliarResponse>(apiUrl).pipe(
      map(response => {
        console.log('✅ === RESPUESTA EXITOSA DEL API GetCEAuxiliarCxC ===');
        console.log('📥 Respuesta completa:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ === ERROR EN LA PETICIÓN AL API GetCEAuxiliarCxC ===');
        console.error('📥 Error completo:', error);
        throw error;
      })
    );
  }
}
