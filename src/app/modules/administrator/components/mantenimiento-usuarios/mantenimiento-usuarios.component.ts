import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { UsersService } from '../../../../core/services/users.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { PerfilData, UserData, UpdateUserData } from '../../../../core/interfaces/auth.interface';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-mantenimiento-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './mantenimiento-usuarios.component.html',
  styleUrls: ['./mantenimiento-usuarios.component.css']
})
export class MantenimientoUsuariosComponent implements OnInit {
  userForm: FormGroup;
  showPopup = signal<boolean>(false);
  popupTitle = signal('');
  searchType = signal('login');
  searchCriteria = signal('contenga');
  searchTerm = signal('');
  filteredUsers = signal<UserData[]>([]);
  allUsers = signal<UserData[]>([]);
  isLoading = signal(false);

  // Signals para perfiles
  filteredPerfiles = signal<PerfilData[]>([]);
  allPerfiles = signal<PerfilData[]>([]);

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private authService: AuthService,
    private toastService: ToastService
  ) {
    this.userForm = this.fb.group({
      login: [''],
      nombre: [''],
      perfil: [''],
      codigoPerfil: [''],
      password: [''],
      passwordConfirm: [''],
      supervisor: [''],
      creaParadinamico: [''],
      guid: [''],
      codEmpleado: [''],
      fechaInicio: [''],
      fechaFinal: [''],
      fechaPass: [''],
      inventario: [''],
      gerente: [''],
      mantenimientoGuardar: [''],
      mantenimientoModificar: [''],
      mantenimientoEliminar: [''],
      mantenimientoConsultar: [''],
      comentario: ['']
    });
  }

  ngOnInit(): void {
    console.log('🔧 MantenimientoUsuariosComponent initialized:', {
      showPopup: this.showPopup(),
      popupTitle: this.popupTitle(),
      isLoading: this.isLoading(),
      filteredUsersLength: this.filteredUsers().length
    });
  }

  openPopup(type: string): void {
    this.showPopup.set(true);
    this.popupTitle.set(type === 'login' ? 'Seleccionar Usuario' : type === 'perfil' ? 'Seleccionar Perfil' : 'Seleccionar Código de Perfil');

    if (type === 'login') {
      this.loadUsers();
    } else if (type === 'perfil') {
      this.loadPerfiles();
    } else {
      // For other types, use mock data for now
      this.filteredUsers.set([
        {
          Agrega: '',
          'Agrega-Clav': '',
          'bgcolfil-gen': 0,
          'bgcolfra-gen': 0,
          'bgcoltex-gen': 0,
          Bloqueo: false,
          Codper: '001',
          Contador: 0,
          CrudCons: true,
          CrudElim: true,
          CrudMod: true,
          CrudSave: true,
          'date-ctrl': '2024-01-01',
          'fecfin-clav': '2024-12-31',
          'fecini-clav': '2024-01-01',
          Fecpass: '2024-06-01',
          'fgcolfil-gen': 0,
          'fgcolfra-gen': 0,
          'fgcolre1-gen': 0,
          'fgcolre2-gen': 0,
          'fgcoltex-gen': 0,
          'idioma-gen': 'ESPAÑOL',
        login: 'user1',
          'login-ctrl': 'ADM',
          'nombre-clav': 'Usuario 1',
          Nuevo: false,
          'password-clav': 'password123',
          'password-clav2': '',
          Perfil: false,
          'runpel-gen': true,
          'runson-gen': true,
          'super-clav': true,
          'text-clav': 'Usuario de prueba',
          tperfil: 'Admin',
          tparent: 'ADM'
        }
      ]);
    }
  }

  private loadUsers(): void {
    const currentUser = this.authService.user();
    if (!currentUser || !currentUser.pcToken || !currentUser.pcLogin || currentUser.pcSuper === undefined) {
      console.error('❌ No user authentication data available:', {
        hasUser: !!currentUser,
        hasToken: !!currentUser?.pcToken,
        hasLogin: !!currentUser?.pcLogin,
        hasSuper: currentUser?.pcSuper !== undefined,
        pcSuper: currentUser?.pcSuper
      });
      this.filteredUsers.set([]);
      return;
    }

    this.isLoading.set(true);
    this.usersService.getUsers(currentUser.pcLogin, currentUser.pcToken, currentUser.pcSuper).subscribe({
      next: (users) => {
        console.log('📊 Processing users data:', {
          usersLength: users.length,
          firstUser: users[0],
          timestamp: new Date().toISOString()
        });

        this.allUsers.set(users);
        this.filteredUsers.set(users);
        this.isLoading.set(false);

        console.log('✅ Users loaded successfully:', {
          allUsersLength: this.allUsers().length,
          filteredUsersLength: this.filteredUsers().length,
          isLoading: this.isLoading()
        });
      },
      error: (error) => {
        console.error('❌ Error loading users:', error);
        this.filteredUsers.set([]);
        this.isLoading.set(false);
      }
    });
  }

  private loadPerfiles(): void {
    const currentUser = this.authService.user();
    if (!currentUser || !currentUser.pcToken || !currentUser.pcLogin || currentUser.pcSuper === undefined) {
      console.error('❌ No user authentication data available for perfiles:', {
        hasUser: !!currentUser,
        hasToken: !!currentUser?.pcToken,
        hasLogin: !!currentUser?.pcLogin,
        hasSuper: currentUser?.pcSuper !== undefined,
        pcSuper: currentUser?.pcSuper
      });
      this.filteredPerfiles.set([]);
      return;
    }

    this.isLoading.set(true);
    this.usersService.getPerfiles(currentUser.pcLogin, currentUser.pcToken, currentUser.pcSuper).subscribe({
      next: (perfiles) => {
        console.log('📊 Processing perfiles data:', {
          perfilesLength: perfiles.length,
          firstPerfil: perfiles[0],
          timestamp: new Date().toISOString()
        });

        this.allPerfiles.set(perfiles);
        this.filteredPerfiles.set(perfiles);
        this.isLoading.set(false);

        console.log('✅ Perfiles loaded successfully:', {
          allPerfilesLength: this.allPerfiles().length,
          filteredPerfilesLength: this.filteredPerfiles().length,
          isLoading: this.isLoading()
        });
      },
      error: (error) => {
        console.error('❌ Error loading perfiles:', error);
        this.filteredPerfiles.set([]);
        this.isLoading.set(false);
      }
    });
  }

  selectUser(user: UserData): void {
    if (this.popupTitle().includes('Usuario')) {
      console.log('👤 Loading user data into form:', {
        user: user,
        timestamp: new Date().toISOString()
      });

      // Extraer el perfil del campo Agrega (número final)
      const perfil = this.extractPerfilFromAgrega(user.Agrega);

      // Extraer datos del campo Agrega: inventario, supervisor, GUID y código empleado
      const agregaData = this.extractDataFromAgrega(user.Agrega);

      console.log('🔍 Extracted data from Agrega:', {
        agrega: user.Agrega,
        perfil: perfil,
        agregaData: agregaData
      });

      this.userForm.patchValue({
        // Datos básicos
        login: user.login,
        nombre: user['nombre-clav'],

        // Contraseñas
        password: user['password-clav'] || '',
        passwordConfirm: user['password-clav'] || '',

        // Perfil y código
        perfil: perfil,
        codigoPerfil: user.Codper,

        // GUID y código empleado (extraídos del campo Agrega)
        guid: agregaData.guid || user['Agrega-Clav'] || '',
        codEmpleado: agregaData.codEmpleado || perfil,

        // Fechas
        fechaInicio: user['fecini-clav'] || '',
        fechaFinal: user['fecfin-clav'] || '',
        fechaPass: user.Fecpass || '',

        // Supervisor (extraído del campo Agrega)
        supervisor: agregaData.supervisor || (user['super-clav'] ? 'SI' : 'NO'),

        // Crea Paradinámico (super-clav)
        creaParadinamico: user['super-clav'] ? 'SI' : 'NO',

        // Permisos CRUD
        mantenimientoGuardar: user.CrudSave ? 'SI' : 'NO',
        mantenimientoModificar: user.CrudMod ? 'SI' : 'NO',
        mantenimientoEliminar: user.CrudElim ? 'SI' : 'NO',
        mantenimientoConsultar: user.CrudCons ? 'SI' : 'NO',

        // Comentarios
        comentario: user['text-clav'] || '',

        // Campos adicionales (extraídos del campo Agrega)
        inventario: agregaData.inventario || '',
        gerente: agregaData.supervisor || ''
      });

      console.log('✅ User data loaded into form successfully');
    } else {
      this.userForm.patchValue({
        codigoPerfil: user.Codper
      });
    }
    this.closePopup();
  }

  closePopup(): void {
    console.log('🚪 Closing popup:', {
      before: this.showPopup(),
      timestamp: new Date().toISOString()
    });
    this.showPopup.set(false);
    this.searchTerm.set('');
    this.isLoading.set(false);
    this.filteredUsers.set([]);
    this.allUsers.set([]);
    this.filteredPerfiles.set([]);
    this.allPerfiles.set([]);
    console.log('✅ Popup closed:', {
      after: this.showPopup(),
      timestamp: new Date().toISOString()
    });
  }

  forceClosePopup(): void {
    console.log('🔧 Force closing popup');
    this.showPopup.set(false);
    this.searchTerm.set('');
    this.isLoading.set(false);
    this.filteredUsers.set([]);
    this.allUsers.set([]);
  }

  /**
   * Extrae el perfil (número final) del campo Agrega
   * Ejemplo: "                                                                                                        aalfonso001                   995                           " -> "995"
   */
  private extractPerfilFromAgrega(agrega: string): string {
    if (!agrega) return '';

    // Limpiar espacios y dividir por espacios
    const cleaned = agrega.trim();
    const parts = cleaned.split(/\s+/).filter(part => part.length > 0);

    // El perfil es el último elemento que sea un número
    for (let i = parts.length - 1; i >= 0; i--) {
      const part = parts[i];
      if (/^\d+$/.test(part)) {
        return part;
      }
    }

    return '';
  }

  /**
   * Extrae datos del campo Agrega: inventario, supervisor, GUID y código empleado
   * Ejemplo: "NONOatrianarom001                 79200" -> {inventario: "NO", supervisor: "NO", guid: "atrianarom001", codEmpleado: "79200"}
   */
  private extractDataFromAgrega(agrega: string): {inventario: string, supervisor: string, guid: string, codEmpleado: string} {
    if (!agrega) return {inventario: '', supervisor: '', guid: '', codEmpleado: ''};

    const cleaned = agrega.trim();
    console.log('🔍 Parsing Agrega field:', {original: agrega, cleaned: cleaned});

    // Buscar patrones de inventario y supervisor al inicio
    let inventario = '';
    let supervisor = '';
    let remaining = cleaned;

    // Verificar si empieza con NO/NO, NO/SI, SI/NO, SI/SI
    const patterns = ['NONO', 'NOSI', 'SINO', 'SISI'];
    for (const pattern of patterns) {
      if (cleaned.startsWith(pattern)) {
        inventario = pattern.substring(0, 2);
        supervisor = pattern.substring(2, 4);
        remaining = cleaned.substring(4);
        break;
      }
    }

    // Si no se encontró patrón, buscar solo NO o SI al inicio
    if (!inventario && (cleaned.startsWith('NO') || cleaned.startsWith('SI'))) {
      inventario = cleaned.substring(0, 2);
      remaining = cleaned.substring(2);
    }

    // Extraer GUID (primer valor alfanumérico después de los indicadores)
    const guidMatch = remaining.match(/^([a-zA-Z0-9]+)/);
    const guid = guidMatch ? guidMatch[1] : '';

    // Remover el GUID del string restante
    if (guid) {
      remaining = remaining.substring(guid.length);
    }

    // Extraer código empleado (último número en el string)
    const codEmpleadoMatch = remaining.match(/(\d+)/);
    const codEmpleado = codEmpleadoMatch ? codEmpleadoMatch[1] : '';

    console.log('🔍 Extracted data:', {
      inventario,
      supervisor,
      guid,
      codEmpleado,
      remaining
    });

    return {inventario, supervisor, guid, codEmpleado};
  }

  selectPerfil(perfil: PerfilData): void {
    if (this.popupTitle().includes('Perfil')) {
      console.log('👤 Loading perfil data into form:', {
        perfil: perfil,
        timestamp: new Date().toISOString()
      });

      this.userForm.patchValue({
        codigoPerfil: perfil.Codper
      });

      this.closePopup();
      console.log('✅ Perfil data loaded into form successfully');
    }
  }

  onSearch(): void {
    if (this.popupTitle().includes('Usuario') && this.allUsers().length > 0) {
      const filtered = this.usersService.filterUsers(
        this.allUsers(),
        this.searchTerm(),
        'all', // Search in all fields
        'contenga' // Always use "contains" search
      );
      this.filteredUsers.set(filtered);
      console.log('🔍 Filtered users:', filtered.length);
    } else if (this.popupTitle().includes('Perfil') && this.allPerfiles().length > 0) {
      const filtered = this.usersService.filterPerfiles(
        this.allPerfiles(),
        this.searchTerm(),
        'all', // Search in all fields
        'contenga' // Always use "contains" search
      );
      this.filteredPerfiles.set(filtered);
      console.log('🔍 Filtered perfiles:', filtered.length);
    }
  }

  onSearchClear(): void {
    this.searchTerm.set('');
    if (this.popupTitle().includes('Usuario')) {
      this.filteredUsers.set(this.allUsers());
    } else if (this.popupTitle().includes('Perfil')) {
      this.filteredPerfiles.set(this.allPerfiles());
    }
  }

  onSubmit(): void {
    console.log('🚀 === INICIANDO PROCESO DE GUARDADO ===');
    console.log('📋 Form valid:', this.userForm.valid);
    console.log('📋 Form value:', this.userForm.value);
    console.log('📋 Form errors:', this.userForm.errors);

    if (this.userForm.valid) {
      console.log('✅ Formulario válido, procediendo con el guardado');

      const currentUser = this.authService.user();
      console.log('👤 Current user data:', {
        hasUser: !!currentUser,
        pcLogin: currentUser?.pcLogin,
        pcToken: currentUser?.pcToken,
        pcSuper: currentUser?.pcSuper
      });

      if (!currentUser || !currentUser.pcToken || !currentUser.pcLogin || currentUser.pcSuper === undefined) {
        console.error('❌ No user authentication data available');
        return;
      }

      // Convertir datos del formulario al formato del API
      console.log('🔄 Iniciando conversión de datos del formulario...');
      const userData = this.convertFormToUpdateUserData();

      console.log('📤 Datos convertidos para el API:', userData);
      console.log('📤 URL del endpoint:', `${environment.apiUrl}/UpdateUsuarios?pcLogin=${currentUser.pcLogin}&pcSuper=${currentUser.pcSuper}&pcToken=${currentUser.pcToken}`);

      this.usersService.updateUser(userData, currentUser.pcLogin, currentUser.pcToken, currentUser.pcSuper).subscribe({
        next: (response) => {
          console.log('✅ === USUARIO ACTUALIZADO EXITOSAMENTE ===');
          console.log('📥 Respuesta del servidor:', response);

          // Limpiar el formulario
          this.clearForm();
          console.log('🧹 Formulario limpiado después del guardado exitoso');

          // Mostrar toast de éxito
          this.showSuccessToast('Usuario guardado exitosamente');
        },
        error: (error) => {
          console.error('❌ === ERROR AL ACTUALIZAR USUARIO ===');
          console.error('📥 Error completo:', error);
          console.error('📥 Error message:', error.message);
          console.error('📥 Error status:', error.status);

          // Mostrar toast de error
          this.showErrorToast('Error al guardar el usuario. Por favor, intente nuevamente.');
        }
      });
    } else {
      console.warn('⚠️ === FORMULARIO INVÁLIDO ===');
      console.warn('📋 Errores del formulario:', this.userForm.errors);
      console.warn('📋 Estado de cada campo:');
      Object.keys(this.userForm.controls).forEach(key => {
        const control = this.userForm.get(key);
        console.warn(`  - ${key}: valid=${control?.valid}, errors=`, control?.errors);
      });
    }
  }

  /**
   * Convierte los datos del formulario al formato requerido por el API UpdateUsuarios
   */
  private convertFormToUpdateUserData(): UpdateUserData {
    console.log('🔄 === INICIANDO CONVERSIÓN DE DATOS ===');
    const formValue = this.userForm.value;
    console.log('📋 Valores del formulario:', formValue);

    // Obtener el usuario logueado del localStorage
    const currentUser = this.authService.user();
    const loggedInUser = currentUser?.pcLogin || '';
    const loggedInUserUpper = loggedInUser.toUpperCase();

    console.log('👤 Usuario logueado:', {
      original: loggedInUser,
      uppercase: loggedInUserUpper
    });

    // Extraer datos del campo Agrega para reconstruir la cadena original
    const inventario = formValue.inventario || 'NO';
    const supervisor = formValue.gerente || 'NO';
    const guid = formValue.guid || '';
    const codEmpleado = formValue.codEmpleado || '';

    console.log('🔧 Datos extraídos para Agrega:', {
      inventario,
      supervisor,
      guid,
      codEmpleado
    });

    // Reconstruir el campo Agrega
    const agrega = `${inventario}${supervisor}${guid}                  ${codEmpleado}`;
    console.log('🔧 Campo Agrega reconstruido:', `"${agrega}"`);

    const userData = {
      Agrega: agrega,
      'Agrega-Clav': formValue.guid || '',
      'bgcolfil-gen': 0,
      'bgcolfra-gen': 0,
      'bgcoltex-gen': 0,
      Bloqueo: false,
      Codper: formValue.codigoPerfil || '',
      Contador: 0,
      CrudCons: formValue.mantenimientoConsultar === 'SI',
      CrudElim: formValue.mantenimientoEliminar === 'SI',
      CrudMod: formValue.mantenimientoModificar === 'SI',
      CrudSave: formValue.mantenimientoGuardar === 'SI',
      'date-ctrl': new Date().toISOString().split('T')[0],
      'fecfin-clav': formValue.fechaFinal || '',
      'fecini-clav': formValue.fechaInicio || '',
      Fecpass: formValue.fechaPass || '',
      'fgcolfil-gen': 0,
      'fgcolfra-gen': 0,
      'fgcolre1-gen': 0,
      'fgcolre2-gen': 0,
      'fgcoltex-gen': 0,
      'idioma-gen': 'ESPAÑOL',
      login: formValue.login || '',
      'login-ctrl': loggedInUserUpper,
      'nombre-clav': formValue.nombre || '',
      Nuevo: false,
      'password-clav': formValue.password || '',
      'password-clav2': formValue.password || '',
      Perfil: formValue.perfil === 'SI',
      'runpel-gen': false,
      'runson-gen': false,
      'super-clav': formValue.supervisor === 'SI',
      'text-clav': formValue.comentario || '',
      tperfil: formValue.perfil || '',
      tparent: loggedInUserUpper,
      'agrega-userWin': '',
      'agrega-emailinter': '',
      'agrega-accinv': '',
      'agrega-indgen': '',
      'agrega-GUID': formValue.guid || '',
      'agrega-CodEmpleado': formValue.codEmpleado || ''
    };

    console.log('📤 === OBJETO COMPLETO PARA EL API ===');
    console.log('📤 Estructura completa:', JSON.stringify(userData, null, 2));
    console.log('📤 Campos principales:', {
      login: userData.login,
      'nombre-clav': userData['nombre-clav'],
      Codper: userData.Codper,
      'super-clav': userData['super-clav'],
      Agrega: userData.Agrega,
      'Agrega-Clav': userData['Agrega-Clav'],
      'agrega-GUID': userData['agrega-GUID'],
      'agrega-CodEmpleado': userData['agrega-CodEmpleado'],
      'fecini-clav': userData['fecini-clav'],
      'fecfin-clav': userData['fecfin-clav'],
      Fecpass: userData.Fecpass,
      'text-clav': userData['text-clav'],
      CrudSave: userData.CrudSave,
      CrudMod: userData.CrudMod,
      CrudElim: userData.CrudElim,
      CrudCons: userData.CrudCons
    });
    console.log('✅ === CONVERSIÓN COMPLETADA ===');

    return userData;
  }

  onDelete(): void {
    // Handle delete operation
    console.log('Delete operation triggered');
    // Add confirmation dialog and delete logic here
  }

  onClear(): void {
    // Clear all form fields
    this.clearForm();
    console.log('Form cleared');
  }

  /**
   * Limpia el formulario estableciendo valores por defecto apropiados
   */
  private clearForm(): void {
    this.userForm.patchValue({
      login: '',
      nombre: '',
      perfil: '',
      codigoPerfil: '',
      password: '',
      passwordConfirm: '',
      supervisor: '',
      creaParadinamico: '',
      guid: '',
      codEmpleado: '',
      fechaInicio: '',
      fechaFinal: '',
      fechaPass: '',
      inventario: '',
      gerente: '',
      mantenimientoGuardar: '',
      mantenimientoModificar: '',
      mantenimientoEliminar: '',
      mantenimientoConsultar: '',
      comentario: ''
    });

    // Marcar todos los campos como no tocados para limpiar errores de validación
    Object.keys(this.userForm.controls).forEach(key => {
      this.userForm.get(key)?.markAsUntouched();
    });
  }

  /**
   * Muestra un toast de éxito
   */
  private showSuccessToast(message: string): void {
    // Crear elemento de toast
    const toast = document.createElement('div');
    toast.className = 'toast-success';
    toast.textContent = message;

    // Estilos del toast
    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#10B981',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: '9999',
      fontSize: '14px',
      fontWeight: '500',
      minWidth: '250px',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease-in-out'
    });

    // Agregar al DOM
    document.body.appendChild(toast);

    // Animar entrada
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);

    // Remover después de 3 segundos
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  /**
   * Muestra un toast de error
   */
  private showErrorToast(message: string): void {
    // Crear elemento de toast
    const toast = document.createElement('div');
    toast.className = 'toast-error';
    toast.textContent = message;

    // Estilos del toast
    Object.assign(toast.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      backgroundColor: '#EF4444',
      color: 'white',
      padding: '12px 20px',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      zIndex: '9999',
      fontSize: '14px',
      fontWeight: '500',
      minWidth: '250px',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease-in-out'
    });

    // Agregar al DOM
    document.body.appendChild(toast);

    // Animar entrada
    setTimeout(() => {
      toast.style.transform = 'translateX(0)';
    }, 100);

    // Remover después de 4 segundos
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, 4000);
  }

  /**
   * Maneja el evento de presionar Enter en el campo de login
   * @param event Evento del teclado
   */
  onLoginEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();
      this.searchUserByLogin();
    }
  }

  /**
   * Maneja el evento de perder el foco en el campo de login
   */
  onLoginBlur(): void {
    this.searchUserByLogin();
  }

  /**
   * Busca un usuario por login usando el API
   */
  private searchUserByLogin(): void {
    const loginValue = this.userForm.get('login')?.value?.trim();

    if (!loginValue) {
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    if (!currentUser) {
      this.toastService.showError('No se pudo obtener la información del usuario actual');
      return;
    }

    this.isLoading.set(true);

    this.usersService.getUserByLogin(
      loginValue,
      currentUser.pcLogin || '',
      currentUser.pcSuper || false,
      currentUser.pcToken || ''
    ).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.handleUserSearchResponse(response);
      },
      error: (error) => {
        this.isLoading.set(false);
        console.error('Error searching user:', error);
        this.toastService.showError('Error al buscar el usuario');
        this.clearLoginRelatedFields();
      }
    });
  }

  /**
   * Maneja la respuesta de la búsqueda de usuario
   * @param response Respuesta del API
   */
  private handleUserSearchResponse(response: any): void {
    // Verificar si hay errores en la respuesta
    if (response.terrores && response.terrores.length > 0) {
      const error = response.terrores[0];
      this.toastService.showError(error.descripcion || 'No se encontró el usuario');
      this.clearLoginRelatedFields();
      return;
    }

    // Verificar si hay datos de usuario en la respuesta
    if (response.dsRespuesta && response.dsRespuesta.tgeclaves && response.dsRespuesta.tgeclaves.length > 0) {
      const userData = response.dsRespuesta.tgeclaves[0];
      this.populateFormWithUserData(userData);
      this.toastService.showSuccess('Usuario encontrado y cargado exitosamente');
    } else {
      this.toastService.showError('No se encontró el usuario');
      this.clearLoginRelatedFields();
    }
  }

  /**
   * Pobla el formulario con los datos del usuario encontrado
   * @param userData Datos del usuario
   */
  private populateFormWithUserData(userData: any): void {
    this.userForm.patchValue({
      login: userData.login || '',
      nombre: userData['nombre-clav'] || '',
      perfil: userData['agrega-CodEmpleado']?.trim() || '',
      codigoPerfil: userData.Codper || '',
      supervisor: userData['super-clav'] ? 'SI' : 'NO',
      creaParadinamico: userData['runpel-gen'] ? 'SI' : 'NO',
      guid: userData['agrega-GUID']?.trim() || '',
      codEmpleado: userData['agrega-CodEmpleado']?.trim() || '',
      fechaInicio: userData['fecini-clav'] || '',
      fechaFinal: userData['fecfin-clav'] || '',
      fechaPass: userData.Fecpass || '',
      inventario: userData['agrega-accinv']?.trim() === 'SI' ? 'SI' : 'NO',
      gerente: userData['agrega-indgen']?.trim() === 'SI' ? 'SI' : 'NO',
      mantenimientoGuardar: userData.CrudSave ? 'SI' : 'NO',
      mantenimientoModificar: userData.CrudMod ? 'SI' : 'NO',
      mantenimientoEliminar: userData.CrudElim ? 'SI' : 'NO',
      mantenimientoConsultar: userData.CrudCons ? 'SI' : 'NO',
      comentario: userData['text-clav'] || ''
    });
  }

  /**
   * Limpia los campos relacionados con el login
   */
  private clearLoginRelatedFields(): void {
    this.userForm.patchValue({
      login: '',
      nombre: '',
      perfil: '',
      codigoPerfil: '',
      supervisor: '',
      creaParadinamico: '',
      guid: '',
      codEmpleado: '',
      fechaInicio: '',
      fechaFinal: '',
      fechaPass: '',
      inventario: '',
      gerente: '',
      mantenimientoGuardar: '',
      mantenimientoModificar: '',
      mantenimientoEliminar: '',
      mantenimientoConsultar: '',
      comentario: ''
    });
  }
}
