import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UsersService } from '../../../core/services/users.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ModalService } from '../../../core/services/modal.service';
import { PerfilData, UserData, UpdateUserData } from '../../../core/interfaces/auth.interface';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-mantenimiento-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ConfirmationDialogComponent],
  templateUrl: './mantenimiento-usuarios.component.html',
  styleUrls: ['./mantenimiento-usuarios.component.css']
})
export class MantenimientoUsuariosComponent implements OnInit {
  @ViewChild(ConfirmationDialogComponent) confirmDialog!: ConfirmationDialogComponent;

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
    private http: HttpClient,
    private usersService: UsersService,
    private authService: AuthService,
    private toastService: ToastService,
    private modalService: ModalService
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
  }

  openPopup(type: string): void {
    this.showPopup.set(true);
    this.modalService.openModal();
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
    if (!currentUser || !currentUser.pcToken || !currentUser.pcLogin || !currentUser.pcSuper) {
      this.filteredUsers.set([]);
      return;
    }

    this.isLoading.set(true);
    const apiUrl = `${environment.apiUrl}/GetCEUsuarios?pcLogin=${currentUser.pcLogin}&pcSuper=${currentUser.pcSuper}&pcToken=${currentUser.pcToken}`;
    console.log('🔍 API URL:', apiUrl);
    this.usersService.getUsers(apiUrl).subscribe({
      next: (users) => {
        this.allUsers.set(users);
        this.filteredUsers.set(users);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.filteredUsers.set([]);
        this.isLoading.set(false);
      }
    });
  }

  private loadPerfiles(): void {
    const currentUser = this.authService.user();
    if (!currentUser || !currentUser.pcToken || !currentUser.pcLogin || !currentUser.pcSuper) {
      this.filteredPerfiles.set([]);
      return;
    }

    this.isLoading.set(true);
    const apiUrl = `${environment.apiUrl}/GetCEPerfil?pcLogin=${currentUser.pcLogin}&pcSuper=${currentUser.pcSuper}&pcToken=${currentUser.pcToken}`;
    console.log('🔍 API URL:', apiUrl);
    this.usersService.getPerfiles(apiUrl).subscribe({
      next: (perfiles) => {
        this.allPerfiles.set(perfiles);
        this.filteredPerfiles.set(perfiles);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.filteredPerfiles.set([]);
        this.isLoading.set(false);
      }
    });
  }

  selectUser(user: UserData): void {
    if (this.popupTitle().includes('Usuario')) {
      // Extraer el perfil del campo Agrega (número final)
      const perfil = this.extractPerfilFromAgrega(user.Agrega);

      // Extraer datos del campo Agrega: inventario, supervisor, GUID y código empleado
      const agregaData = this.extractDataFromAgrega(user.Agrega);

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

    } else {
      this.userForm.patchValue({
        codigoPerfil: user.Codper
      });
    }
    this.closePopup();
  }

  closePopup(): void {
    this.showPopup.set(false);
    this.searchTerm.set('');
    this.isLoading.set(false);
    this.filteredUsers.set([]);
    this.allUsers.set([]);
    this.filteredPerfiles.set([]);
    this.allPerfiles.set([]);
    this.modalService.closeModal();
  }

  forceClosePopup(): void {
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


    return {inventario, supervisor, guid, codEmpleado};
  }

  selectPerfil(perfil: PerfilData): void {
    if (this.popupTitle().includes('Perfil')) {

      this.userForm.patchValue({
        codigoPerfil: perfil.Codper
      });

      this.closePopup();
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
    } else if (this.popupTitle().includes('Perfil') && this.allPerfiles().length > 0) {
      const filtered = this.usersService.filterPerfiles(
        this.allPerfiles(),
        this.searchTerm(),
        'all', // Search in all fields
        'contenga' // Always use "contains" search
      );
      this.filteredPerfiles.set(filtered);
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
    // Validar fechas obligatorias
    if (!this.validateRequiredDates()) {
      return;
    }

    if (this.userForm.valid) {
      const currentUser = this.authService.user();

      if (!currentUser || !currentUser.pcToken || !currentUser.pcLogin || !currentUser.pcSuper) {
        return;
      }

      // Convertir datos del formulario al formato del API
      const userData = this.convertFormToUpdateUserData();
      const apiUrl = `${environment.apiUrl}/UpdateUsuarios?pcLogin=${currentUser.pcLogin}&pcSuper=${currentUser.pcSuper}&pcToken=${currentUser.pcToken}`;
      console.log('🔍 API URL:', apiUrl);
      console.log('📤 JSON enviado al guardar:', JSON.stringify(userData, null, 2));
      this.usersService.updateUser(userData, apiUrl).subscribe({
        next: (response) => {
          // Limpiar el formulario
          this.clearForm();
          // Mostrar toast de éxito
          this.toastService.showSuccess('Usuario guardado exitosamente');
        },
        error: (error) => {
          // Mostrar toast de error
          this.toastService.showError('Error al guardar el usuario. Por favor, intente nuevamente.');
        }
      });
    }
  }

  /**
   * Convierte los datos del formulario al formato requerido por el API UpdateUsuarios
   */
  private convertFormToUpdateUserData(): UpdateUserData {
    const formValue = this.userForm.value;

    // Obtener el usuario logueado del localStorage
    const currentUser = this.authService.user();
    const loggedInUser = currentUser?.pcLogin || '';
    const loggedInUserUpper = loggedInUser.toUpperCase();

    // Extraer datos del campo Agrega para reconstruir la cadena original
    const inventario = formValue.inventario || 'NO';
    const supervisor = formValue.gerente || 'NO';
    const guid = formValue.guid || '';
    const codEmpleado = formValue.codEmpleado || '';

    // Reconstruir el campo Agrega
    const agrega = `${inventario}${supervisor}${guid}                  ${codEmpleado}`;

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

    return userData;
  }

  onClear(): void {
    // Clear all form fields
    this.clearForm();
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

    const apiUrl = `${environment.apiUrl}/GetUsuarios?pcLoginP=${loginValue}&pcLogin=${currentUser.pcLogin || ''}&pcSuper=${currentUser.pcSuper || ''}&pcToken=${currentUser.pcToken || ''}`;
    console.log('🔍 API URL:', apiUrl);
    this.usersService.getUserByLogin(apiUrl).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.handleUserSearchResponse(response);
      },
      error: (error) => {
        this.isLoading.set(false);
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

      //this.toastService.showSuccess('Usuario encontrado y cargado exitosamente');
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


    if(userData.login){

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
  }

  /**
   * Valida que las fechas obligatorias estén presentes y sean válidas
   * @returns true si todas las fechas son válidas, false en caso contrario
   */
  private validateRequiredDates(): boolean {
    const formValue = this.userForm.value;
    const fechaInicio = formValue.fechaInicio;
    const fechaFinal = formValue.fechaFinal;
    const fechaPass = formValue.fechaPass;

    // Validar Fecha de Inicio
    if (!fechaInicio || fechaInicio.trim() === '') {
      this.toastService.showWarning('La Fecha de Inicio es obligatoria');
      return false;
    }

    // Validar Fecha Final
    if (!fechaFinal || fechaFinal.trim() === '') {
      this.toastService.showWarning('La Fecha Final es obligatoria');
      return false;
    }

    // Validar Fecha de Contraseña
    if (!fechaPass || fechaPass.trim() === '') {
      this.toastService.showWarning('La Fecha de Contraseña es obligatoria');
      return false;
    }

    // Validar que las fechas sean válidas
    const fechaInicioDate = new Date(fechaInicio);
    const fechaFinalDate = new Date(fechaFinal);
    const fechaPassDate = new Date(fechaPass);

    if (isNaN(fechaInicioDate.getTime())) {
      this.toastService.showWarning('La Fecha de Inicio no es válida');
      return false;
    }

    if (isNaN(fechaFinalDate.getTime())) {
      this.toastService.showWarning('La Fecha Final no es válida');
      return false;
    }

    if (isNaN(fechaPassDate.getTime())) {
      this.toastService.showWarning('La Fecha de Contraseña no es válida');
      return false;
    }

    // Validar que la fecha de inicio sea anterior a la fecha final
    if (fechaInicioDate >= fechaFinalDate) {
      this.toastService.showWarning('La Fecha de Inicio debe ser anterior a la Fecha Final');
      return false;
    }

    return true;
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

  /**
   * Abre el diálogo de confirmación para eliminar usuario
   */
  public onDelete(): void {
    const loginValue = this.userForm.get('login')?.value;

    if (!loginValue) {
      this.toastService.showWarning('Debe seleccionar un usuario para eliminar');
      return;
    }

    this.confirmDialog.open({
      title: '¿Eliminar Usuario?',
      message: `¿Está seguro que desea eliminar el usuario "${loginValue}"? Esta acción no se puede deshacer.`,
      confirmText: 'Eliminar',
      cancelText: 'Cancelar'
    });
  }

  /**
   * Ejecuta la eliminación del usuario
   */
  public onConfirmDelete(): void {
    const loginValue = this.userForm.get('login')?.value;
    const user = this.authService.user();

    if (!loginValue || !user) {
      this.toastService.showError('No se puede eliminar el usuario');
      this.confirmDialog.close();
      return;
    }

    // Construir la URL del endpoint
    const apiUrl = `${environment.apiUrl}/DelUsuarios`;

    // Parámetros de la petición (asegurar que no sean undefined)
    const params = {
      pcLoginP: loginValue,
      pcLogin: user.pcLogin || '',
      pcSuper: user.pcSuper || ''
    };

    console.log('🗑️ Eliminando usuario - Petición a la API:', {
      url: apiUrl,
      params: params,
      timestamp: new Date().toISOString()
    });

    // Mostrar estado de procesamiento en el diálogo
    this.confirmDialog.setProcessing(true);

    // Realizar la petición DELETE
    this.http.delete(apiUrl, { params }).subscribe({
      next: (response) => {
        console.log('✅ Usuario eliminado - Respuesta de la API:', {
          response: response,
          timestamp: new Date().toISOString()
        });

        this.toastService.showSuccess(`Usuario "${loginValue}" eliminado exitosamente`);
        this.confirmDialog.close();

        // Limpiar el formulario después de eliminar
        this.clearLoginRelatedFields();
      },
      error: (error) => {
        console.error('❌ Error al eliminar usuario - Respuesta de la API:', {
          error: error,
          message: error.message,
          status: error.status,
          timestamp: new Date().toISOString()
        });

        this.toastService.showError('Error al eliminar el usuario: ' + (error.error?.message || error.message));
        this.confirmDialog.setProcessing(false);
      }
    });
  }

  /**
   * Cancela la eliminación del usuario
   */
  public onCancelDelete(): void {
    console.log('ℹ️ Eliminación de usuario cancelada por el usuario');
  }
}
