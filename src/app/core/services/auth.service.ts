import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoginCredentials, User, LoginApiResponse } from '../interfaces/auth.interface';
import { MenuService } from './menu.service';
import { MenuResponse } from '../interfaces/menu.interface';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly _isAuthenticated = signal<boolean>(false);
  private readonly _user = signal<User | null>(null);
  private readonly _errorMessage = signal<string>('');

  public readonly isAuthenticated = this._isAuthenticated.asReadonly();
  public readonly user = this._user.asReadonly();
  public readonly errorMessage = this._errorMessage.asReadonly();

  constructor(
    private router: Router,
    private http: HttpClient,
    private menuService: MenuService
  ) {
    // Check if user is already logged in (from localStorage) - only in browser
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedUser = localStorage.getItem('xcalibur_user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          this._user.set(user);
          this._isAuthenticated.set(true);
        } catch (error) {
          // Invalid JSON in localStorage, clear it
          localStorage.removeItem('xcalibur_user');
        }
      }
    }
  }

  public login(credentials: LoginCredentials): Observable<boolean> {
    const apiUrl = `${environment.apiUrl}/GetGemenu?pcLogin=${credentials.username}&pClave=${credentials.password}`;

    console.log('🚀 Sending login request to API:', {
      url: apiUrl,
      username: credentials.username,
      password: credentials.password,
      timestamp: new Date().toISOString()
    });

    return this.http.get<LoginApiResponse>(apiUrl).pipe(
      map(response => {
        console.log('📥 Received response from API:', {
          response: response,
          hasDsRespuesta: !!response.dsRespuesta,
          dsRespuestaKeys: response.dsRespuesta ? Object.keys(response.dsRespuesta) : [],
          hasTgemenu: !!(response.dsRespuesta && response.dsRespuesta.tgemenu),
          menuItemsCount: response.dsRespuesta?.tgemenu?.length || 0,
          timestamp: new Date().toISOString()
        });

        // Check if the response indicates successful login
        // Valid login: dsRespuesta exists and has tgemenu array with items
        // Invalid login: dsRespuesta is empty object {} or doesn't have tgemenu
        const isValidLogin = response.dsRespuesta &&
                           response.dsRespuesta.tgemenu &&
                           Array.isArray(response.dsRespuesta.tgemenu) &&
                           response.dsRespuesta.tgemenu.length > 0;

        console.log('🔍 Login validation:', {
          isValidLogin: isValidLogin,
          dsRespuestaExists: !!response.dsRespuesta,
          tgemenuExists: !!(response.dsRespuesta && response.dsRespuesta.tgemenu),
          tgemenuIsArray: !!(response.dsRespuesta && response.dsRespuesta.tgemenu && Array.isArray(response.dsRespuesta.tgemenu)),
          tgemenuLength: response.dsRespuesta?.tgemenu?.length || 0
        });

        if (isValidLogin) {
          // Get the first menu item to extract token and tparent
          const firstMenuItem = response.dsRespuesta.tgemenu[0];

          console.log('✅ Login successful - extracting user data:', {
            firstMenuItem: firstMenuItem,
            extractedToken: firstMenuItem.token,
            extractedTparent: firstMenuItem.tparent,
            extractedSuperClav: firstMenuItem['super-clav']
          });

          const user: User = {
            id: credentials.username,
            username: credentials.username,
            name: credentials.username,
            role: 'user',
            pcToken: firstMenuItem.token,
            pcLogin: firstMenuItem.tparent,
            pcSuper: String(firstMenuItem['super-clav'])
          };

          console.log('👤 User object created:', user);

          // Establecer los datos del menú en el servicio de menú
          // Convertir MenuItem[] a MenuItemData[]
          const menuItemsData = response.dsRespuesta.tgemenu.map(item => ({
            sistema: item.sistema,
            sistAbrev: item['sist-abrev'],
            grupoMen: item['grupo-men'],
            nombreMen: item['nombre-men'],
            loginCtrl: item['login-ctrl'],
            token: item.token,
            superClav: item['super-clav'],
            tparent: item.tparent
          }));

          const menuResponse: MenuResponse = {
            dsRespuesta: {
              tgemenu: menuItemsData
            }
          };

          this.menuService.setMenuData(menuResponse);
          console.log('📋 Menu data set in MenuService:', {
            originalItems: response.dsRespuesta.tgemenu.length,
            convertedItems: menuItemsData.length,
            firstConvertedItem: menuItemsData[0]
          });

          this._user.set(user);
          this._isAuthenticated.set(true);
          this._errorMessage.set('');

          // Save to localStorage - only in browser
          if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('xcalibur_user', JSON.stringify(user));
            console.log('💾 User data saved to localStorage');
          }

          return true;
        } else {
          // Empty response means invalid credentials
          console.log('❌ Login failed - empty response or no menu items');
          this._errorMessage.set('Credenciales incorrectas. Intente nuevamente.');
          return false;
        }
      }),
      catchError(error => {
        console.error('💥 Login API error:', {
          error: error,
          message: error.message,
          status: error.status,
          timestamp: new Date().toISOString()
        });
        this._errorMessage.set('Error de conexión. Intente nuevamente.');
        return of(false);
      })
    );
  }

  public logout(): void {
    this._user.set(null);
    this._isAuthenticated.set(false);
    this._errorMessage.set('');

    // Limpiar datos del menú
    this.menuService.clearMenu();
    console.log('🗑️ Menu data cleared on logout');

    // Clear localStorage - only in browser
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('xcalibur_user');
    }

    this.router.navigate(['/login']);
  }

  public clearError(): void {
    this._errorMessage.set('');
  }
}
