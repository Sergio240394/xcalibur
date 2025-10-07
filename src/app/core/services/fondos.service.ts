import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface FondoItem {
  'Agrega-Utif': string;
  cia: number;
  'nombre-cia': string;
  'ctarep-ufon': number;
  'date-ctrl': string;
  'login-ctrl': string;
  'nombre-ufon': string;
  'text-ufon': string | null;
  'tipo-ufon': string;
  utilfon: number;
  tparent: string;
  terrores?: Array<{
    codigo: string;
    descripcion: string;
    tPARENT: string;
  }>;
}

export interface FondoResponse {
  dsRespuesta?: {
    tcgutifon?: FondoItem[];
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
export class FondosService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getFondoByCode(
    pcCompania: string,
    pcCuentaC: string,
    pcUtifon: string,
    pcLogin: string,
    pcSuper: string,
    pcToken: string
  ): Observable<FondoResponse> {
    const apiUrl = `${this.baseUrl}/GetLeaveUtifonCxC?pcCompania=${pcCompania}&pcCuentaC=${pcCuentaC}&pcUtifon=${pcUtifon}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;

    console.log('🔍 === BUSCANDO FONDO ESPECÍFICO ===');
    console.log('🌐 Endpoint:', apiUrl);
    console.log('📤 Parámetros:', { pcCompania, pcCuentaC, pcUtifon, pcLogin, pcSuper, pcToken });

    return this.http.get<FondoResponse>(apiUrl).pipe(
      map(response => {
        console.log('✅ === RESPUESTA EXITOSA DEL API GetLeaveUtifonCxC ===');
        console.log('📥 Respuesta completa:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ === ERROR EN LA PETICIÓN AL API GetLeaveUtifonCxC ===');
        console.error('📥 Error completo:', error);
        throw error;
      })
    );
  }

  getFondosList(
    pcCompania: string,
    pcLogin: string,
    pcSuper: string,
    pcToken: string
  ): Observable<FondoResponse> {
    const apiUrl = `${this.baseUrl}/GetCEUtifondoCxC?pcCompania=${pcCompania}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;

    console.log('🔍 === BUSCANDO LISTA DE FONDOS ===');
    console.log('🌐 Endpoint:', apiUrl);
    console.log('📤 Parámetros:', { pcCompania, pcLogin, pcSuper, pcToken });

    return this.http.get<FondoResponse>(apiUrl).pipe(
      map(response => {
        console.log('✅ === RESPUESTA EXITOSA DEL API GetCEUtifondoCxC ===');
        console.log('📥 Respuesta completa:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ === ERROR EN LA PETICIÓN AL API GetCEUtifondoCxC ===');
        console.error('📥 Error completo:', error);
        throw error;
      })
    );
  }
}
