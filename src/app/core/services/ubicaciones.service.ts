import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface UbicacionItem {
  'Agrega-Ubic': string;
  cia: number;
  'nombre-cia': string;
  Clasif: number;
  'date-ctrl': string;
  'login-ctrl': string;
  'nombre-ubic': string;
  'text-ubic': string;
  ubicacion: number;
  zona: number;
  tparent: string;
  terrores?: Array<{
    codigo: string;
    descripcion: string;
    tPARENT: string;
  }>;
}

export interface UbicacionResponse {
  dsRespuesta?: {
    tcgubicac?: UbicacionItem[];
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
export class UbicacionesService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUbicacionByCode(
    pcCompania: string,
    pcCuentaC: string,
    pcUbicacion: string,
    pcLogin: string,
    pcSuper: string,
    pcToken: string
  ): Observable<UbicacionResponse> {
    const apiUrl = `${this.baseUrl}/GetLeaveUbicacionCxC?pcCompania=${pcCompania}&pcCuentaC=${pcCuentaC}&pcUbicacion=${pcUbicacion}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;

    console.log('🔍 === BUSCANDO UBICACIÓN ESPECÍFICA ===');
    console.log('🌐 Endpoint:', apiUrl);
    console.log('📤 Parámetros:', { pcCompania, pcCuentaC, pcUbicacion, pcLogin, pcSuper, pcToken });

    return this.http.get<UbicacionResponse>(apiUrl).pipe(
      map(response => {
        console.log('✅ === RESPUESTA EXITOSA DEL API GetLeaveUbicacionCxC ===');
        console.log('📥 Respuesta completa:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ === ERROR EN LA PETICIÓN AL API GetLeaveUbicacionCxC ===');
        console.error('📥 Error completo:', error);
        throw error;
      })
    );
  }

  getUbicacionesList(
    pcCompania: string,
    pcLogin: string,
    pcSuper: string,
    pcToken: string
  ): Observable<UbicacionResponse> {
    const apiUrl = `${this.baseUrl}/GetCEUbicacionCxC?pcCompania=${pcCompania}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;

    console.log('🔍 === BUSCANDO LISTA DE UBICACIONES ===');
    console.log('🌐 Endpoint:', apiUrl);
    console.log('📤 Parámetros:', { pcCompania, pcLogin, pcSuper, pcToken });

    return this.http.get<UbicacionResponse>(apiUrl).pipe(
      map(response => {
        console.log('✅ === RESPUESTA EXITOSA DEL API GetCEUbicacionCxC ===');
        console.log('📥 Respuesta completa:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ === ERROR EN LA PETICIÓN AL API GetCEUbicacionCxC ===');
        console.error('📥 Error completo:', error);
        throw error;
      })
    );
  }
}
