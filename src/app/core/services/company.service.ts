import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CompanyResponse {
  dsRespuesta: {
    tgecias: Company[];
    errores?: ErrorResponse[];
  };
}

export interface Company {
  cia: number;
  'nombre-cia': string;
  nit: string;
  'direc-cia': string;
  'telefo-cia': string;
  'telex-cia': string;
  'nomrep-cia': string;
  [key: string]: any;
}

export interface ErrorResponse {
  descripcion: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private baseUrl = environment.apiUrl;

  // Mock data for testing - replace with actual auth service integration
  private readonly pcLogin = 'testuser';
  private readonly pcSuper = 'admin';
  private readonly pcToken = 'testtoken';

  constructor(private http: HttpClient) {}

  /**
   * Get all companies
   */
  public getCompanies(): Observable<Company[]> {
    const params = new HttpParams()
      .set('pcLogin', this.pcLogin)
      .set('pcSuper', this.pcSuper)
      .set('pcToken', this.pcToken);

    return this.http.get<CompanyResponse>(`${this.baseUrl}/GetCECompanias`, { params })
      .pipe(
        map(response => {
          // Check for errors in response
          if (response.dsRespuesta.errores && response.dsRespuesta.errores.length > 0) {
            const error = response.dsRespuesta.errores[0];
            if (error.descripcion.toLowerCase().includes('no encontró registro')) {
              throw new Error(error.descripcion);
            }
          }
          return response.dsRespuesta.tgecias || [];
        }),
        catchError(error => {
          console.error('Error fetching companies:', error);
          return of([]);
        })
      );
  }

  /**
   * Get company by code (Leave event)
   */
  public getCompanyByCode(pcCompania: string): Observable<Company | null> {
    const params = new HttpParams()
      .set('pcCompania', pcCompania)
      .set('pcLogin', this.pcLogin)
      .set('pcSuper', this.pcSuper)
      .set('pcToken', this.pcToken);

    return this.http.get<CompanyResponse>(`${this.baseUrl}/GetLeaveGEcias`, { params })
      .pipe(
        map(response => {
          // Check for errors in response
          if (response.dsRespuesta.errores && response.dsRespuesta.errores.length > 0) {
            const error = response.dsRespuesta.errores[0];
            if (error.descripcion.toLowerCase().includes('no encontró registro')) {
              throw new Error(error.descripcion);
            }
          }

          const companies = response.dsRespuesta.tgecias || [];
          return companies.length > 0 ? companies[0] : null;
        }),
        catchError(error => {
          console.error('Error fetching company by code:', error);
          throw error;
        })
      );
  }
}
