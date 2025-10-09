import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface MonedaItem {
  'Agrega-Mone': string;
  'date-ctrl': string;
  'login-ctrl': string;
  moneda: number;
  'nombre-mon': string;
  'text-mon': string;
  tparent: string;
}

export interface MonedaResponse {
  dsRespuesta: {
    tgemoneda: MonedaItem[];
    terrores?: Array<{
      descripcion: string;
    }>;
  };
}

export interface LeaveMonedaResponse {
  dsRespuesta: {
    tgemoneda: MonedaItem[];
    terrores?: Array<{
      descripcion: string;
    }>;
  };
}

@Injectable({
  providedIn: 'root'
})
export class MonedasService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Obtiene todas las monedas disponibles
   */
  getMonedas(pcLogin: string, pcSuper: string, pcToken: string) {
    const url = `${this.apiUrl}/GetCEgemoneda?pcLogin=${encodeURIComponent(pcLogin)}&pcSuper=${encodeURIComponent(pcSuper)}&pcToken=${encodeURIComponent(pcToken)}`;

    console.log('🔍 Obteniendo monedas:', { pcLogin, pcSuper, pcToken });
    console.log('📡 URL:', url);

    return this.http.get<MonedaResponse>(url);
  }

  /**
   * Valida una moneda específica
   */
  validateMoneda(pcMoneda: string, pcLogin: string, pcSuper: string, pcToken: string) {
    const url = `${this.apiUrl}/GetLeaveMoneda?pcMoneda=${encodeURIComponent(pcMoneda)}&pcLogin=${encodeURIComponent(pcLogin)}&pcSuper=${encodeURIComponent(pcSuper)}&pcToken=${encodeURIComponent(pcToken)}`;

    console.log('🔍 Validando moneda:', { pcMoneda, pcLogin, pcSuper, pcToken });
    console.log('📡 URL:', url);

    return this.http.get<LeaveMonedaResponse>(url);
  }
}
