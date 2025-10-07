import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { UsersApiResponse, UserData, PerfilData, PerfilesApiResponse, UpdateUserData } from '../interfaces/auth.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de usuarios del sistema
   * @param apiUrl URL completa del endpoint
   * @returns Observable con la lista de usuarios
   */
  getUsers(apiUrl: string): Observable<UserData[]> {
    return this.http.get<UsersApiResponse>(apiUrl).pipe(
      map(response => {
        if (response.dsRespuesta && response.dsRespuesta.tgeclaves2) {
          return response.dsRespuesta.tgeclaves2;
        } else {
          return [];
        }
      }),
      catchError(error => {
        return of([]);
      })
    );
  }

  /**
   * Filtra usuarios basado en criterios de búsqueda
   * @param users Lista de usuarios
   * @param searchTerm Término de búsqueda
   * @param searchType Tipo de búsqueda (login, nombre)
   * @param searchCriteria Criterio de búsqueda (contenga, comience)
   * @returns Lista filtrada de usuarios
   */
  filterUsers(users: UserData[], searchTerm: string, searchType: string, searchCriteria: string): UserData[] {
    if (!searchTerm.trim()) {
      return users;
    }

    const term = searchTerm.toLowerCase().trim();

    return users.filter(user => {
      // If searchType is 'all', search in all relevant fields
      if (searchType === 'all') {
        const searchableFields = [
          user.login?.toLowerCase() || '',
          user['nombre-clav']?.toLowerCase() || '',
          user['super-clav'] ? 'si' : 'no',
          user.Codper?.toLowerCase() || '',
          user.tperfil?.toLowerCase() || '',
          user['fecini-clav']?.toLowerCase() || '',
          user['fecfin-clav']?.toLowerCase() || '',
          user.Fecpass?.toLowerCase() || ''
        ];

        return searchableFields.some(field => field.includes(term));
      }

      // Original specific field search logic
      let fieldValue = '';

      if (searchType === 'login') {
        fieldValue = user.login?.toLowerCase() || '';
      } else if (searchType === 'nombre') {
        fieldValue = user['nombre-clav']?.toLowerCase() || '';
      }

      if (searchCriteria === 'contenga') {
        return fieldValue.includes(term);
      } else if (searchCriteria === 'comience') {
        return fieldValue.startsWith(term);
      }

      return false;
    });
  }

  /**
   * Obtiene la lista de perfiles del sistema
   * @param apiUrl URL completa del endpoint
   * @returns Observable con la lista de perfiles
   */
  getPerfiles(apiUrl: string): Observable<PerfilData[]> {
    return this.http.get<PerfilesApiResponse>(apiUrl).pipe(
      map(response => {
        if (response.dsRespuesta && response.dsRespuesta.tgeclaves3) {
          return response.dsRespuesta.tgeclaves3;
        } else {
          return [];
        }
      }),
      catchError(error => {
        return of([]);
      })
    );
  }

  /**
   * Filtra perfiles basado en criterios de búsqueda
   * @param perfiles Lista de perfiles
   * @param searchTerm Término de búsqueda
   * @param searchType Tipo de búsqueda (codper, login-ctrl)
   * @param searchCriteria Criterio de búsqueda (contenga, comience)
   * @returns Lista filtrada de perfiles
   */
  filterPerfiles(perfiles: PerfilData[], searchTerm: string, searchType: string, searchCriteria: string): PerfilData[] {
    if (!searchTerm.trim()) {
      return perfiles;
    }

    const term = searchTerm.toLowerCase().trim();

    return perfiles.filter(perfil => {
      // If searchType is 'all', search in all relevant fields
      if (searchType === 'all') {
        const searchableFields = [
          perfil.Codper?.toLowerCase() || '',
          perfil['login-ctrl']?.toLowerCase() || '',
          perfil.tparent?.toLowerCase() || ''
        ];

        return searchableFields.some(field => field.includes(term));
      }

      // Original specific field search logic
      let fieldValue = '';

      if (searchType === 'codper') {
        fieldValue = perfil.Codper?.toLowerCase() || '';
      } else if (searchType === 'login-ctrl') {
        fieldValue = perfil['login-ctrl']?.toLowerCase() || '';
      }

      if (searchCriteria === 'contenga') {
        return fieldValue.includes(term);
      } else if (searchCriteria === 'comience') {
        return fieldValue.startsWith(term);
      }

      return false;
    });
  }

  /**
   * Obtiene un usuario específico por login
   * @param apiUrl URL completa del endpoint
   * @returns Observable con la respuesta del servidor
   */
  getUserByLogin(apiUrl: string): Observable<any> {
    return this.http.get(apiUrl).pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  /**
   * Actualiza un usuario en el sistema
   * @param userData Datos del usuario a actualizar
   * @param apiUrl URL completa del endpoint
   * @returns Observable con la respuesta del servidor
   */
  updateUser(userData: UpdateUserData, apiUrl: string): Observable<any> {
    const requestBody = {
      tgeclaves: [userData]
    };

    return this.http.put(apiUrl, requestBody).pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        throw error;
      })
    );
  }
}
