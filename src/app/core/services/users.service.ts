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
   * @param pcLogin Login del usuario actual
   * @param pcToken Token de autenticación
   * @param pcSuper Valor de super-clav del usuario actual
   * @returns Observable con la lista de usuarios
   */
  getUsers(pcLogin: string, pcToken: string, pcSuper: boolean): Observable<UserData[]> {
    const apiUrl = `${this.baseUrl}/GetCEUsuarios?pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;

    console.log('🔍 Fetching users from API:', {
      url: apiUrl,
      pcLogin: pcLogin,
      pcToken: pcToken,
      pcSuper: pcSuper,
      timestamp: new Date().toISOString()
    });

    return this.http.get<UsersApiResponse>(apiUrl).pipe(
      map(response => {

        if (response.dsRespuesta && response.dsRespuesta.tgeclaves2) {
          return response.dsRespuesta.tgeclaves2;
        } else {
          console.warn('No hay usuarios en la respuesta');
          return [];
        }
      }),
      catchError(error => {
        console.error('Error recibiendo usuarios:', {
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
   * @param pcLogin Login del usuario actual
   * @param pcToken Token de autenticación
   * @param pcSuper Valor de super-clav del usuario actual
   * @returns Observable con la lista de perfiles
   */
  getPerfiles(pcLogin: string, pcToken: string, pcSuper: boolean): Observable<PerfilData[]> {
    const apiUrl = `${this.baseUrl}/GetCEPerfil?pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;

    console.log('🔍 Fetching perfiles from API:', {
      url: apiUrl,
      pcLogin: pcLogin,
      pcToken: pcToken,
      pcSuper: pcSuper,
      timestamp: new Date().toISOString()
    });

    return this.http.get<PerfilesApiResponse>(apiUrl).pipe(
      map(response => {
        if (response.dsRespuesta && response.dsRespuesta.tgeclaves3) {
          return response.dsRespuesta.tgeclaves3;
        } else {
          console.warn('No hay perfiles en la respuesta');
          return [];
        }
      }),
      catchError(error => {
        console.error('Error recibiendo perfiles:', {
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
   * @param pcLoginP Login del usuario a buscar
   * @param pcLogin Login del usuario actual
   * @param pcSuper Valor de super-clav del usuario actual
   * @param pcToken Token de autenticación
   * @returns Observable con la respuesta del servidor
   */
  getUserByLogin(pcLoginP: string, pcLogin: string, pcSuper: boolean, pcToken: string): Observable<any> {
    const apiUrl = `${this.baseUrl}/GetUsuarios?pcLoginP=${pcLoginP}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;

    console.log('🔍 Fetching user by login from API:', {
      url: apiUrl,
      pcLoginP: pcLoginP,
      pcLogin: pcLogin,
      pcToken: pcToken,
      pcSuper: pcSuper,
      timestamp: new Date().toISOString()
    });

    return this.http.get(apiUrl).pipe(
      map(response => {
        console.log('✅ User search response:', response);
        return response;
      }),
      catchError(error => {
        console.error('❌ Error searching user by login:', {
          error: error,
          message: error.message,
          status: error.status,
          timestamp: new Date().toISOString()
        });
        throw error;
      })
    );
  }

  /**
   * Actualiza un usuario en el sistema
   * @param userData Datos del usuario a actualizar
   * @param pcLogin Login del usuario actual
   * @param pcToken Token de autenticación
   * @param pcSuper Valor de super-clav del usuario actual
   * @returns Observable con la respuesta del servidor
   */
  updateUser(userData: UpdateUserData, pcLogin: string, pcToken: string, pcSuper: boolean): Observable<any> {
    const apiUrl = `${this.baseUrl}/UpdateUsuarios?pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;

    const requestBody = {
      tgeclaves: [userData]
    };

    console.log('🌐 === ENVIANDO PETICIÓN AL API ===');
    console.log('🌐 URL completa:', apiUrl);
    console.log('🌐 Método: PUT');
    console.log('🌐 Parámetros de URL:', {
      pcLogin,
      pcSuper,
      pcToken: pcToken.substring(0, 10) + '...' // Solo mostrar parte del token por seguridad
    });
    console.log('🌐 Body de la petición:', JSON.stringify(requestBody, null, 2));
    console.log('🌐 Timestamp:', new Date().toISOString());

    return this.http.put(apiUrl, requestBody).pipe(
      map(response => {
        console.log('✅ === RESPUESTA EXITOSA DEL API ===');
        console.log('📥 Respuesta completa:', response);
        console.log('📥 Tipo de respuesta:', typeof response);
        console.log('📥 Timestamp:', new Date().toISOString());
        return response;
      }),
      catchError(error => {
        console.error('❌ === ERROR EN LA PETICIÓN AL API ===');
        console.error('📥 Error completo:', error);
        console.error('📥 Error message:', error.message);
        console.error('📥 Error status:', error.status);
        console.error('📥 Error statusText:', error.statusText);
        console.error('📥 Error url:', error.url);
        console.error('📥 Timestamp:', new Date().toISOString());
        throw error;
      })
    );
  }
}
