import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { CompaniasService, CompaniaItem } from '../../../core/services/companias.service';
import { EmpresasService, EmpresaItem } from '../../../core/services/empresas.service';
import { VendedoresService, VendedorItem } from '../../../core/services/vendedores.service';
import { CondicionesPagoService, CondicionPagoItem } from '../../../core/services/condiciones-pago.service';
import { NitsService, NitItem } from '../../../core/services/nits.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoadingService } from '../../../core/services/loading.service';
import { ModalService } from '../../../core/services/modal.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-company-maintenance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule],
  templateUrl: './company-maintenance.component.html',
  styleUrls: ['./company-maintenance.component.css']
})
export class CompanyMaintenanceComponent implements OnInit {
  companyForm: FormGroup;
  showPopup = signal<boolean>(false);
  popupTitle = signal<string>('');
  searchType = 'compania';
  searchCriteria = 'contenga';
  searchTerm = signal<string>('');
  filteredCompanies = signal<CompaniaItem[] | EmpresaItem[] | VendedorItem[] | CondicionPagoItem[] | NitItem[]>([]);
  isLoading = signal<boolean>(false);
  companiaName = signal<string>('');
  vendedorName = signal<string>('');
  empresaName = signal<string>('');
  condicionPagoName = signal<string>('');
  nitName = signal<string>('');
  paisName = signal<string>('');
  ciudadName = signal<string>('');
  zonaName = signal<string>('');
  localidadName = signal<string>('');
  negocioName = signal<string>('');
  monedaName = signal<string>('');
  cobradorName = signal<string>('');
  clasificVentaName = signal<string>('');
  clasifXCobroName = signal<string>('');
  causaSuspName = signal<string>('');
  losLineServiceName = signal<string>('');
  subLosSubLineName = signal<string>('');
  productGroupName = signal<string>('');
  affinityName = signal<string>('');
  transporteName = signal<string>('');
  rutaName = signal<string>('');
  sectorName = signal<string>('');
  tipoClienteName = signal<string>('');

  // Section navigation
  currentSection = signal<number>(1);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private companiasService: CompaniasService,
    private empresasService: EmpresasService,
    private vendedoresService: VendedoresService,
    private condicionesPagoService: CondicionesPagoService,
    private nitsService: NitsService,
    private authService: AuthService,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private modalService: ModalService
  ) {
    this.companyForm = this.fb.group({
      compania: [''],
      empresa: [''],
      nombre: [''],
      vendedor: [''],
      condicionPago: [''],
      direccion: [''],
      telefonos: [''],
      fax: [''],
      telex: [''],
      zonaPostal: [''],
      rif: [''],
      nit: [''],
      diaCaja: [''],
      fechaIngreso: [''],
      limite: [''],
      descuento: [''],
      contactos: [''],
      comentarios: [''],
      pais: [''],
      ciudad: [''],
      zona: [''],
      localidad: [''],
      negocio: [''],
      tipoCliente: [''],
      moneda: [''],
      cobrador: [''],
      clasificVenta: [''],
      clasifXCobro: [''],
      causaSusp: [''],
      losLineService: [''],
      subLosSubLine: [''],
      productGroup: [''],
      affinity: [''],
      regMercan: [''],
      fechaRegistro: [''],
      capitalPag: [''],
      capitalSusc: [''],
      nombreAbrev: [''],
      rSocial: [''],
      backOrder: [''],
      transporte: [''],
      ruta: [''],
      sector: [''],
      secuencia: [''],
      precio: [''],
      contribuye: [''],
      fechaAumento: [''],
      direcEntrega: [''],
      correoElectr: [''],
      facturaElectronica: this.fb.group({
        agregaFact01: [false], // 1
        agregaFact02: [false], // 2
        agregaFact03: [false], // 5
        agregaFact04: [false], // 8
        agregaFact05: [false], // 13
        agregaFact06: [false], // 14
        agregaFact07: [false], // 15
        agregaFact08: [false]  // 16
      })
    });
  }

  ngOnInit(): void {
    // Initialize component
    // Asegurar que el modal esté cerrado al inicializar
    this.showPopup.set(false);
    this.popupTitle.set('');
    this.searchTerm.set('');
    this.filteredCompanies.set([]);
  }

  openPopup(type: string): void {
    this.showPopup.set(true);
    this.modalService.openModal();

    // Determinar el título del popup según el tipo
    let title = '';
    switch (type) {
      case 'compania':
        title = 'Seleccionar Compañía';
        break;
      case 'empresa':
        title = 'Seleccionar Empresa';
        break;
      case 'vendedor':
        title = 'Seleccionar Vendedor';
        break;
      case 'condicionPago':
        title = 'Seleccionar Condición de Pago';
        break;
      case 'nit':
        title = 'Seleccionar NIT';
        break;
      case 'pais':
        title = 'Seleccionar País';
        break;
      case 'ciudad':
        title = 'Seleccionar Ciudad';
        break;
      case 'zona':
        title = 'Seleccionar Zona';
        break;
      case 'localidad':
        title = 'Seleccionar Localidad';
        break;
      case 'negocio':
        title = 'Seleccionar Negocio';
        break;
      case 'moneda':
        title = 'Seleccionar Moneda';
        break;
      case 'cobrador':
        title = 'Seleccionar Cobrador';
        break;
      case 'clasificVenta':
        title = 'Seleccionar Clasificación Venta';
        break;
      case 'clasifXCobro':
        title = 'Seleccionar Clasificación por Cobro';
        break;
      case 'causaSusp':
        title = 'Seleccionar Causa de Suspensión';
        break;
      case 'losLineService':
        title = 'Seleccionar LoS Line of Service';
        break;
      case 'subLosSubLine':
        title = 'Seleccionar SubLoS SubLine of Service';
        break;
      case 'productGroup':
        title = 'Seleccionar Product Group';
        break;
      case 'affinity':
        title = 'Seleccionar Affinity';
        break;
      case 'transporte':
        title = 'Seleccionar Transporte';
        break;
      case 'ruta':
        title = 'Seleccionar Ruta';
        break;
      case 'sector':
        title = 'Seleccionar Sector';
        break;
      case 'tipoCliente':
        title = 'Seleccionar Tipo Cliente';
        break;
      default:
        title = 'Seleccionar';
    }

    this.popupTitle.set(title);

    // Limpiar datos anteriores y activar estado de carga
    this.filteredCompanies.set([]);
    this.searchTerm.set('');
    this.isLoading.set(true);

    if (type === 'compania') {
      this.loadCompanias();
    } else if (type === 'empresa') {
      this.loadEmpresas();
    } else if (type === 'vendedor') {
      this.loadVendedores();
    } else if (type === 'condicionPago') {
      this.loadCondicionesPago();
    } else if (type === 'nit') {
      this.loadNits();
    } else if (type === 'pais') {
      this.loadPaises();
    } else if (type === 'ciudad') {
      this.loadCiudades();
    } else if (type === 'zona') {
      this.loadZonas();
    } else if (type === 'localidad') {
      this.loadLocalidades();
    } else if (type === 'negocio') {
      this.loadNegocios();
    } else if (type === 'moneda') {
      this.loadMonedas();
    } else if (type === 'cobrador') {
      this.loadCobradores();
    } else if (type === 'clasificVenta') {
      this.loadClasificVentas();
    } else if (type === 'clasifXCobro') {
      this.loadClasifXCobros();
    } else if (type === 'causaSusp') {
      this.loadCausasSusp();
    } else if (type === 'losLineService') {
      this.loadLosLineServices();
    } else if (type === 'subLosSubLine') {
      this.loadSubLosSubLines();
    } else if (type === 'productGroup') {
      this.loadProductGroups();
    } else if (type === 'affinity') {
      this.loadAffinities();
    } else if (type === 'transporte') {
      this.loadTransportes();
    } else if (type === 'ruta') {
      this.loadRutas();
    } else if (type === 'sector') {
      this.loadSectores();
    } else if (type === 'tipoCliente') {
      this.loadTipoClientes();
    }
  }

  private loadCompanias(): void {
    const currentUser = this.authService.user();
    if (!currentUser || !currentUser.pcLogin || !currentUser.pcToken) {
      console.error('No hay usuario autenticado o faltan datos de autenticación');
      this.isLoading.set(false);
      return;
    }

    this.companiasService.getCompanias(
      currentUser.pcLogin,
      currentUser.pcSuper || '',
      currentUser.pcToken
    ).subscribe({
      next: (companias: CompaniaItem[]) => {
        this.filteredCompanies.set(companias);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('Error al cargar compañías:', error);
        this.filteredCompanies.set([]);
        this.isLoading.set(false);
      }
    });
  }

  private loadEmpresas(): void {
    const currentUser = this.authService.user();
    if (!currentUser || !currentUser.pcLogin || !currentUser.pcToken) {
      console.error('No hay usuario autenticado o faltan datos de autenticación');
      this.isLoading.set(false);
      return;
    }

    // Obtener el código de compañía del formulario
    const companiaCode = this.companyForm.get('compania')?.value;
    if (!companiaCode) {
      console.error('No se ha seleccionado una compañía');
      this.isLoading.set(false);
      return;
    }

    this.empresasService.getEmpresas(
      companiaCode,
      currentUser.pcLogin,
      currentUser.pcSuper || '',
      currentUser.pcToken
    ).subscribe({
      next: (empresas: EmpresaItem[]) => {
        this.filteredCompanies.set(empresas);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('Error al cargar empresas:', error);
        this.filteredCompanies.set([]);
        this.isLoading.set(false);
      }
    });
  }

  private loadVendedores(): void {
    const currentUser = this.authService.user();
    if (!currentUser || !currentUser.pcLogin || !currentUser.pcToken) {
      console.error('No hay usuario autenticado o faltan datos de autenticación');
      this.isLoading.set(false);
      return;
    }

    // Obtener el código de compañía del formulario
    const companiaCode = this.companyForm.get('compania')?.value;
    if (!companiaCode) {
      console.error('No se ha seleccionado una compañía');
      this.isLoading.set(false);
      return;
    }

    this.vendedoresService.getVendedores(
      companiaCode,
      currentUser.pcLogin,
      currentUser.pcSuper || '',
      currentUser.pcToken
    ).subscribe({
      next: (vendedores: VendedorItem[]) => {
        this.filteredCompanies.set(vendedores);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('Error al cargar vendedores:', error);
        this.filteredCompanies.set([]);
        this.isLoading.set(false);
      }
    });
  }

  private loadCondicionesPago(): void {
    const currentUser = this.authService.user();
    if (!currentUser || !currentUser.pcLogin || !currentUser.pcToken) {
      console.error('No hay usuario autenticado o faltan datos de autenticación');
      this.isLoading.set(false);
      return;
    }

    // Obtener el código de compañía del formulario
    const companiaCode = this.companyForm.get('compania')?.value;
    if (!companiaCode) {
      console.error('No se ha seleccionado una compañía');
      this.isLoading.set(false);
      return;
    }

    this.condicionesPagoService.getCondicionesPago(
      companiaCode,
      currentUser.pcLogin,
      currentUser.pcSuper || '',
      currentUser.pcToken
    ).subscribe({
      next: (condicionesPago: CondicionPagoItem[]) => {
        this.filteredCompanies.set(condicionesPago);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('Error al cargar condiciones de pago:', error);
        this.filteredCompanies.set([]);
        this.isLoading.set(false);
      }
    });
  }

  private loadNits(): void {
    const currentUser = this.authService.user();
    if (!currentUser || !currentUser.pcLogin || !currentUser.pcToken) {
      console.error('No hay usuario autenticado o faltan datos de autenticación');
      this.isLoading.set(false);
      return;
    }

    // Obtener el código de la compañía del formulario
    const companiaCode = this.companyForm.get('compania')?.value;
    if (!companiaCode) {
      console.error('No se ha seleccionado una compañía');
      this.isLoading.set(false);
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    this.nitsService.getNits(
      companiaCode,
      currentUser.pcLogin,
      currentUser.pcSuper || '',
      currentUser.pcToken
    ).subscribe({
      next: (nits: NitItem[]) => {
        this.filteredCompanies.set(nits);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error('Error al cargar NITs:', error);
        this.filteredCompanies.set([]);
        this.isLoading.set(false);
      }
    });
  }

  private loadPaises(): void {
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser || !currentUser.pcLogin || !currentUser.pcToken) {
      console.error('No hay usuario autenticado o faltan datos de autenticación');
      this.isLoading.set(false);
      return;
    }

    // Construir la URL con los parámetros
    const url = `${environment.apiUrl}/GetCEGepais?pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.dsRespuesta && response.dsRespuesta.tgepais) {
          // Convertir la respuesta a un formato compatible con el modal
          const paises = response.dsRespuesta.tgepais.map((pais: any) => ({
            codigo: pais.pais,
            nombre: pais['nombre-pai'],
            descripcion: pais['nombre-pai'],
            paisData: pais
          }));
          this.filteredCompanies.set(paises);
          this.isLoading.set(false);
        } else {
          this.filteredCompanies.set([]);
          this.isLoading.set(false);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar países:', error);
        this.filteredCompanies.set([]);
        this.isLoading.set(false);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private loadCiudades(): void {
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser || !currentUser.pcLogin || !currentUser.pcToken) {
      console.error('No hay usuario autenticado o faltan datos de autenticación');
      this.isLoading.set(false);
      return;
    }

    // Obtener el código del país del formulario
    const paisCode = this.companyForm.get('pais')?.value;
    if (!paisCode) {
      console.error('No se ha seleccionado un país');
      this.isLoading.set(false);
      this.toastService.showError('Debe seleccionar un país primero');
      return;
    }

    // Construir la URL con los parámetros
    const url = `${environment.apiUrl}/GetCEGeciudad?pcPais=${paisCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.dsRespuesta && response.dsRespuesta.tgeciudad) {
          // Convertir la respuesta a un formato compatible con el modal
          const ciudades = response.dsRespuesta.tgeciudad.map((ciudad: any) => ({
            codigo: ciudad.ciudad,
            nombre: ciudad['nombre-ciu'],
            descripcion: ciudad['nombre-ciu'],
            ciudadData: ciudad
          }));
          this.filteredCompanies.set(ciudades);
          this.isLoading.set(false);
        } else {
          this.filteredCompanies.set([]);
          this.isLoading.set(false);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar ciudades:', error);
        this.filteredCompanies.set([]);
        this.isLoading.set(false);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private loadZonas(): void {
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser || !currentUser.pcLogin || !currentUser.pcToken) {
      console.error('No hay usuario autenticado o faltan datos de autenticación');
      this.isLoading.set(false);
      return;
    }

    // Obtener el código de la compañía del formulario
    const companiaCode = this.companyForm.get('compania')?.value;
    if (!companiaCode) {
      console.error('No se ha seleccionado una compañía');
      this.isLoading.set(false);
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    // Construir la URL con los parámetros
    const url = `${environment.apiUrl}/GetCEZona?pcCompania=${companiaCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.dsRespuesta && response.dsRespuesta.tcczona) {
          // Convertir la respuesta a un formato compatible con el modal
          const zonas = response.dsRespuesta.tcczona.map((zona: any) => ({
            codigo: zona.zona,
            nombre: zona['nombre-zon'],
            descripcion: zona['nombre-zon'],
            zonaData: zona
          }));
          this.filteredCompanies.set(zonas);
          this.isLoading.set(false);
        } else {
          this.filteredCompanies.set([]);
          this.isLoading.set(false);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar zonas:', error);
        this.filteredCompanies.set([]);
        this.isLoading.set(false);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private loadLocalidades(): void {
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser || !currentUser.pcLogin || !currentUser.pcToken) {
      console.error('No hay usuario autenticado o faltan datos de autenticación');
      this.isLoading.set(false);
      return;
    }

    // Obtener el código de la compañía del formulario
    const companiaCode = this.companyForm.get('compania')?.value;
    if (!companiaCode) {
      console.error('No se ha seleccionado una compañía');
      this.isLoading.set(false);
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    // Construir la URL con los parámetros
    const url = `${environment.apiUrl}/GetCELocalidad?pcCompania=${companiaCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.dsRespuesta && response.dsRespuesta.tcclocali) {
          // Convertir la respuesta a un formato compatible con el modal
          const localidades = response.dsRespuesta.tcclocali.map((localidad: any) => ({
            codigo: localidad.localidad,
            nombre: localidad['nombre-loc'],
            descripcion: localidad['nombre-loc'],
            localidadData: localidad
          }));
          this.filteredCompanies.set(localidades);
          this.isLoading.set(false);
        } else {
          this.filteredCompanies.set([]);
          this.isLoading.set(false);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar localidades:', error);
        this.filteredCompanies.set([]);
        this.isLoading.set(false);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private loadNegocios(): void {
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser || !currentUser.pcLogin || !currentUser.pcToken) {
      console.error('No hay usuario autenticado o faltan datos de autenticación');
      this.isLoading.set(false);
      return;
    }

    // Obtener el código de la compañía del formulario
    const companiaCode = this.companyForm.get('compania')?.value;
    if (!companiaCode) {
      console.error('No se ha seleccionado una compañía');
      this.isLoading.set(false);
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    // Construir la URL con los parámetros
    const url = `${environment.apiUrl}/GetCEGenegocio?pcCompania=${companiaCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.dsRespuesta && response.dsRespuesta.tccnegoci) {
          // Convertir la respuesta a un formato compatible con el modal
          const negocios = response.dsRespuesta.tccnegoci.map((negocio: any) => ({
            codigo: negocio.negocio,
            nombre: negocio['nombre-neg'],
            descripcion: negocio['nombre-neg'],
            negocioData: negocio
          }));
          this.filteredCompanies.set(negocios);
          this.isLoading.set(false);
        } else {
          this.filteredCompanies.set([]);
          this.isLoading.set(false);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar negocios:', error);
        this.filteredCompanies.set([]);
        this.isLoading.set(false);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private loadMonedas(): void {
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser || !currentUser.pcLogin || !currentUser.pcToken) {
      console.error('No hay usuario autenticado o faltan datos de autenticación');
      this.isLoading.set(false);
      return;
    }

    // Obtener el código de la compañía del formulario
    const companiaCode = this.companyForm.get('compania')?.value;
    if (!companiaCode) {
      console.error('No se ha seleccionado una compañía');
      this.isLoading.set(false);
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    // Construir la URL con los parámetros
    const url = `${environment.apiUrl}/GetCEgemoneda?pcCompania=${companiaCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.dsRespuesta && response.dsRespuesta.tgemoneda) {
          // Convertir la respuesta a un formato compatible con el modal
          const monedas = response.dsRespuesta.tgemoneda.map((moneda: any) => ({
            codigo: moneda.moneda,
            nombre: moneda['nombre-mon'],
            descripcion: moneda['nombre-mon'],
            monedaData: moneda
          }));
          this.filteredCompanies.set(monedas);
          this.isLoading.set(false);
        } else {
          this.filteredCompanies.set([]);
          this.isLoading.set(false);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar monedas:', error);
        this.filteredCompanies.set([]);
        this.isLoading.set(false);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private loadCobradores(): void {
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser || !currentUser.pcLogin || !currentUser.pcToken) {
      console.error('No hay usuario autenticado o faltan datos de autenticación');
      this.isLoading.set(false);
      return;
    }

    // Obtener el código de la compañía del formulario
    const companiaCode = this.companyForm.get('compania')?.value;
    if (!companiaCode) {
      console.error('No se ha seleccionado una compañía');
      this.isLoading.set(false);
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    // Construir la URL con los parámetros
    const url = `${environment.apiUrl}/GetCECobrador?pcCompania=${companiaCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.dsRespuesta && response.dsRespuesta.tcccobrad) {
          // Convertir la respuesta a un formato compatible con el modal
          const cobradores = response.dsRespuesta.tcccobrad.map((cobrador: any) => ({
            codigo: cobrador.cobrador,
            nombre: cobrador['nombre-cobr'],
            descripcion: cobrador['nombre-cobr'],
            cobradorData: cobrador
          }));
          this.filteredCompanies.set(cobradores);
          this.isLoading.set(false);
        } else {
          this.filteredCompanies.set([]);
          this.isLoading.set(false);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar cobradores:', error);
        this.filteredCompanies.set([]);
        this.isLoading.set(false);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private loadClasificVentas(): void {
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser || !currentUser.pcLogin || !currentUser.pcToken) {
      console.error('No hay usuario autenticado o faltan datos de autenticación');
      this.isLoading.set(false);
      return;
    }

    // Obtener el código de la compañía del formulario
    const companiaCode = this.companyForm.get('compania')?.value;
    if (!companiaCode) {
      console.error('No se ha seleccionado una compañía');
      this.isLoading.set(false);
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    // Construir la URL con los parámetros
    const url = `${environment.apiUrl}/GetCEClasifVenta?pcCompania=${companiaCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.dsRespuesta && response.dsRespuesta.tccclaven) {
          // Convertir la respuesta a un formato compatible con el modal
          const clasificVentas = response.dsRespuesta.tccclaven.map((clasif: any) => ({
            codigo: clasif.claven,
            nombre: clasif['nombre-cven'],
            descripcion: clasif['nombre-cven'],
            clasificVentaData: clasif
          }));
          this.filteredCompanies.set(clasificVentas);
          this.isLoading.set(false);
        } else {
          this.filteredCompanies.set([]);
          this.isLoading.set(false);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar clasificaciones de venta:', error);
        this.filteredCompanies.set([]);
        this.isLoading.set(false);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private loadClasifXCobros(): void {
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser || !currentUser.pcLogin || !currentUser.pcToken) {
      console.error('No hay usuario autenticado o faltan datos de autenticación');
      this.isLoading.set(false);
      return;
    }

    // Obtener el código de la compañía del formulario
    const companiaCode = this.companyForm.get('compania')?.value;
    if (!companiaCode) {
      console.error('No se ha seleccionado una compañía');
      this.isLoading.set(false);
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    // Construir la URL con los parámetros
    const url = `${environment.apiUrl}/GetCEClasifCobro?pcCompania=${companiaCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.dsRespuesta && response.dsRespuesta.tccclacob) {
          // Convertir la respuesta a un formato compatible con el modal
          const clasifXCobros = response.dsRespuesta.tccclacob.map((clasif: any) => ({
            codigo: clasif.clacob,
            nombre: clasif['nombre-ccob'],
            descripcion: clasif['nombre-ccob'],
            clasifXCobroData: clasif
          }));
          this.filteredCompanies.set(clasifXCobros);
          this.isLoading.set(false);
        } else {
          this.filteredCompanies.set([]);
          this.isLoading.set(false);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar clasificaciones por cobro:', error);
        this.filteredCompanies.set([]);
        this.isLoading.set(false);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private loadCausasSusp(): void {
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser || !currentUser.pcLogin || !currentUser.pcToken) {
      console.error('No hay usuario autenticado o faltan datos de autenticación');
      this.isLoading.set(false);
      return;
    }

    // Obtener el código de la compañía del formulario
    const companiaCode = this.companyForm.get('compania')?.value;
    if (!companiaCode) {
      console.error('No se ha seleccionado una compañía');
      this.isLoading.set(false);
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    // Construir la URL con los parámetros
    const url = `${environment.apiUrl}/GetCECausasusp?pcCompania=${companiaCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.dsRespuesta && response.dsRespuesta.tcccausus) {
          // Convertir la respuesta a un formato compatible con el modal
          const causasSusp = response.dsRespuesta.tcccausus.map((causa: any) => ({
            codigo: causa['causa-susp'],
            nombre: causa['nombre-caus'],
            descripcion: causa['nombre-caus'],
            causaSuspData: causa
          }));
          this.filteredCompanies.set(causasSusp);
          this.isLoading.set(false);
        } else {
          this.filteredCompanies.set([]);
          this.isLoading.set(false);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar causas de suspensión:', error);
        this.filteredCompanies.set([]);
        this.isLoading.set(false);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private loadLosLineServices(): void {
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser || !currentUser.pcLogin || !currentUser.pcToken) {
      console.error('No hay usuario autenticado o faltan datos de autenticación');
      this.isLoading.set(false);
      return;
    }

    // Obtener el código de la compañía del formulario
    const companiaCode = this.companyForm.get('compania')?.value;
    if (!companiaCode) {
      console.error('No se ha seleccionado una compañía');
      this.isLoading.set(false);
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    // Construir la URL con los parámetros
    const url = `${environment.apiUrl}/GetCEcctabla1?pcCompania=${companiaCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.dsRespuesta && response.dsRespuesta.tcctabla1) {
          // Convertir la respuesta a un formato compatible con el modal
          const losLineServices = response.dsRespuesta.tcctabla1.map((los: any) => ({
            codigo: los['codigo-cob1'],
            nombre: los['nombre-cob1'],
            descripcion: los['nombre-cob1'],
            losLineServiceData: los
          }));
          this.filteredCompanies.set(losLineServices);
          this.isLoading.set(false);
        } else {
          this.filteredCompanies.set([]);
          this.isLoading.set(false);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar LoS Line of Services:', error);
        this.filteredCompanies.set([]);
        this.isLoading.set(false);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private loadSubLosSubLines(): void {
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser || !currentUser.pcLogin || !currentUser.pcToken) {
      console.error('No hay usuario autenticado o faltan datos de autenticación');
      this.isLoading.set(false);
      return;
    }

    // Obtener el código de la compañía del formulario
    const companiaCode = this.companyForm.get('compania')?.value;
    if (!companiaCode) {
      console.error('No se ha seleccionado una compañía');
      this.isLoading.set(false);
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    // Construir la URL con los parámetros
    const url = `${environment.apiUrl}/GetCEcctabla2?pcCompania=${companiaCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.dsRespuesta && response.dsRespuesta.tcctabla2) {
          // Convertir la respuesta a un formato compatible con el modal
          const subLosSubLines = response.dsRespuesta.tcctabla2.map((subLos: any) => ({
            codigo: subLos['codigo-cob2'],
            nombre: subLos['nombre-cob2'],
            descripcion: subLos['nombre-cob2'],
            subLosSubLineData: subLos
          }));
          this.filteredCompanies.set(subLosSubLines);
          this.isLoading.set(false);
        } else {
          this.filteredCompanies.set([]);
          this.isLoading.set(false);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar SubLoS SubLine of Services:', error);
        this.filteredCompanies.set([]);
        this.isLoading.set(false);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private loadProductGroups(): void {
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser || !currentUser.pcLogin || !currentUser.pcToken) {
      console.error('No hay usuario autenticado o faltan datos de autenticación');
      this.isLoading.set(false);
      return;
    }

    // Obtener el código de la compañía del formulario
    const companiaCode = this.companyForm.get('compania')?.value;
    if (!companiaCode) {
      console.error('No se ha seleccionado una compañía');
      this.isLoading.set(false);
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    // Construir la URL con los parámetros
    const url = `${environment.apiUrl}/GetCEcctabla3?pcCompania=${companiaCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.dsRespuesta && response.dsRespuesta.tcctabla3) {
          // Convertir la respuesta a un formato compatible con el modal
          const productGroups = response.dsRespuesta.tcctabla3.map((productGroup: any) => ({
            codigo: productGroup['codigo-cob3'],
            nombre: productGroup['nombre-cob3'],
            descripcion: productGroup['nombre-cob3'],
            productGroupData: productGroup
          }));
          this.filteredCompanies.set(productGroups);
          this.isLoading.set(false);
        } else {
          this.filteredCompanies.set([]);
          this.isLoading.set(false);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar Product Groups:', error);
        this.filteredCompanies.set([]);
        this.isLoading.set(false);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private loadAffinities(): void {
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser || !currentUser.pcLogin || !currentUser.pcToken) {
      console.error('No hay usuario autenticado o faltan datos de autenticación');
      this.isLoading.set(false);
      return;
    }

    // Obtener el código de la compañía del formulario
    const companiaCode = this.companyForm.get('compania')?.value;
    if (!companiaCode) {
      console.error('No se ha seleccionado una compañía');
      this.isLoading.set(false);
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    // Construir la URL con los parámetros
    const url = `${environment.apiUrl}/GetCEcctabla4?pcCompania=${companiaCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.dsRespuesta && response.dsRespuesta.tcctabla4) {
          // Convertir la respuesta a un formato compatible con el modal
          const affinities = response.dsRespuesta.tcctabla4.map((affinity: any) => ({
            codigo: affinity['codigo-cob4'],
            nombre: affinity['nombre-cob4'],
            descripcion: affinity['nombre-cob4'],
            affinityData: affinity
          }));
          this.filteredCompanies.set(affinities);
          this.isLoading.set(false);
        } else {
          this.filteredCompanies.set([]);
          this.isLoading.set(false);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar Affinities:', error);
        this.filteredCompanies.set([]);
        this.isLoading.set(false);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private loadTransportes(): void {
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser || !currentUser.pcLogin || !currentUser.pcToken) {
      console.error('No hay usuario autenticado o faltan datos de autenticación');
      this.isLoading.set(false);
      return;
    }

    // Obtener el código de la compañía del formulario
    const companiaCode = this.companyForm.get('compania')?.value;
    if (!companiaCode) {
      console.error('No se ha seleccionado una compañía');
      this.isLoading.set(false);
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    // Construir la URL con los parámetros
    const url = `${environment.apiUrl}/GetCETransporte?pcCompania=${companiaCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.dsRespuesta && response.dsRespuesta.tcctransp) {
          // Convertir la respuesta a un formato compatible con el modal
          const transportes = response.dsRespuesta.tcctransp.map((transporte: any) => ({
            codigo: transporte.transporte,
            nombre: transporte['nombre-tran'],
            descripcion: transporte['nombre-tran'],
            transporteData: transporte
          }));
          this.filteredCompanies.set(transportes);
          this.isLoading.set(false);
        } else {
          this.filteredCompanies.set([]);
          this.isLoading.set(false);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar Transportes:', error);
        this.filteredCompanies.set([]);
        this.isLoading.set(false);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private loadRutas(): void {
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser || !currentUser.pcLogin || !currentUser.pcToken) {
      console.error('No hay usuario autenticado o faltan datos de autenticación');
      this.isLoading.set(false);
      return;
    }

    // Obtener el código de la compañía del formulario
    const companiaCode = this.companyForm.get('compania')?.value;
    if (!companiaCode) {
      console.error('No se ha seleccionado una compañía');
      this.isLoading.set(false);
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    // Obtener el código del transporte del formulario
    const transporteCode = this.companyForm.get('transporte')?.value;
    if (!transporteCode) {
      console.error('No se ha seleccionado un transporte');
      this.isLoading.set(false);
      this.toastService.showError('Debe seleccionar un transporte primero');
      return;
    }

    // Construir la URL con los parámetros
    const url = `${environment.apiUrl}/GetCERuta?pcCompania=${companiaCode}&pcTransporte=${transporteCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.dsRespuesta && response.dsRespuesta.tccruta) {
          // Convertir la respuesta a un formato compatible con el modal
          const rutas = response.dsRespuesta.tccruta.map((ruta: any) => ({
            codigo: ruta.ruta,
            nombre: ruta['nombre-rut'],
            descripcion: ruta['nombre-rut'],
            rutaData: ruta
          }));
          this.filteredCompanies.set(rutas);
          this.isLoading.set(false);
        } else {
          this.filteredCompanies.set([]);
          this.isLoading.set(false);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar Rutas:', error);
        this.filteredCompanies.set([]);
        this.isLoading.set(false);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private loadSectores(): void {
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser || !currentUser.pcLogin || !currentUser.pcToken) {
      console.error('No hay usuario autenticado o faltan datos de autenticación');
      this.isLoading.set(false);
      return;
    }

    // Obtener el código de la compañía del formulario
    const companiaCode = this.companyForm.get('compania')?.value;
    if (!companiaCode) {
      console.error('No se ha seleccionado una compañía');
      this.isLoading.set(false);
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    // Obtener el código del transporte del formulario
    const transporteCode = this.companyForm.get('transporte')?.value;
    if (!transporteCode) {
      console.error('No se ha seleccionado un transporte');
      this.isLoading.set(false);
      this.toastService.showError('Debe seleccionar un transporte primero');
      return;
    }

    // Obtener el código de la ruta del formulario
    const rutaCode = this.companyForm.get('ruta')?.value;
    if (!rutaCode) {
      console.error('No se ha seleccionado una ruta');
      this.isLoading.set(false);
      this.toastService.showError('Debe seleccionar una ruta primero');
      return;
    }

    // Construir la URL con los parámetros
    const url = `${environment.apiUrl}/GetCESector?pcCompania=${companiaCode}&pcTransporte=${transporteCode}&pcRuta=${rutaCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.dsRespuesta && response.dsRespuesta.tccsector) {
          // Convertir la respuesta a un formato compatible con el modal
          const sectores = response.dsRespuesta.tccsector.map((sector: any) => ({
            codigo: sector.sector,
            nombre: sector['nombre-sect'],
            descripcion: sector['nombre-sect'],
            sectorData: sector
          }));
          this.filteredCompanies.set(sectores);
          this.isLoading.set(false);
        } else {
          this.filteredCompanies.set([]);
          this.isLoading.set(false);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar Sectores:', error);
        this.filteredCompanies.set([]);
        this.isLoading.set(false);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private loadTipoClientes(): void {
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser || !currentUser.pcLogin || !currentUser.pcToken) {
      console.error('No hay usuario autenticado o faltan datos de autenticación');
      this.isLoading.set(false);
      return;
    }

    // Obtener el código de la compañía del formulario
    const companiaCode = this.companyForm.get('compania')?.value;
    if (!companiaCode) {
      console.error('No se ha seleccionado una compañía');
      this.isLoading.set(false);
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    // Construir la URL con los parámetros
    const url = `${environment.apiUrl}/GetCETipoCliente?pcCompania=${companiaCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        if (response.dsRespuesta && response.dsRespuesta.tcctipcli) {
          // Convertir la respuesta a un formato compatible con el modal
          const tipoClientes = response.dsRespuesta.tcctipcli.map((tipoCliente: any) => ({
            codigo: tipoCliente.tipocli,
            nombre: tipoCliente['nombre-tipc'],
            descripcion: tipoCliente['nombre-tipc'],
            tipoClienteData: tipoCliente
          }));
          this.filteredCompanies.set(tipoClientes);
          this.isLoading.set(false);
        } else {
          this.filteredCompanies.set([]);
          this.isLoading.set(false);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar Tipo Clientes:', error);
        this.filteredCompanies.set([]);
        this.isLoading.set(false);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  selectCompany(company: CompaniaItem | EmpresaItem | VendedorItem | CondicionPagoItem | NitItem): void {
    if (this.popupTitle().includes('Compañía')) {
      // Es una compañía
      const compania = company as CompaniaItem;
      this.companyForm.patchValue({
        compania: compania.codigo
      });
      // Mostrar el nombre de la compañía
      this.showCompaniaName(compania.descripcion || compania.nombre || '');
    } else if (this.popupTitle().includes('Empresa')) {
      // Es una empresa - limpiar nombres anteriores y mapear todos los campos disponibles
      this.clearAllFieldNames();
      const empresa = company as EmpresaItem;
      const empresaData = empresa.empresaData;

      this.companyForm.patchValue({
        // Campos principales
        empresa: empresa.codigo,
        nombre: empresa.nombre,
        vendedor: empresa.vendedor,
        condicionPago: empresa.condicionPago,
        direccion: empresa.direccion,
        telefonos: empresa.telefono,
        fax: empresa.fax,
        telex: empresaData['telex-emp'] || '',
        zonaPostal: empresa.zonaPostal,
        rif: empresa.rif,
        nit: empresa.nit,

        // Campos adicionales del formulario
        diaCaja: empresaData['diacaj-emp'] || '',
        fechaIngreso: empresaData['fecing-emp'] || '',
        limite: empresaData['limite-emp'] || '',
        descuento: empresaData['pordes-emp'] || '',
        contactos: empresaData['nomcon-emp'] || '',
        comentarios: empresaData['text-emp'] || '',
        pais: empresaData.pais || '',
        ciudad: empresaData.ciudad || '',
        zona: empresaData.zona || '',
        localidad: empresaData.localidad || '',
        negocio: empresaData.negocio || '',
        tipoCliente: empresaData.tipocli || '',
        moneda: empresaData.moneda || '',
        cobrador: empresaData.cobrador || '',
        clasificVenta: empresaData.claven || '', // "claven" para clasificación de venta
        losLineService: empresaData['codigo-cob1'] || '', // "codigo-cob1" para Los Line of Service
        subLosSubLine: empresaData['codigo-cob2'] || '', // "codigo-cob2" para SubLoS SubLine of Service
        productGroup: empresaData['codigo-cob3'] || '', // "codigo-cob3" para Product Group
        affinity: empresaData['codigo-cob4'] || '', // "codigo-cob4" para Affinity
        causaSusp: empresaData['causa-susp'] || '',
        regMercan: empresaData['regmer-emp'] || '',
        fechaRegistro: empresaData['fecreg-emp'] || '',
        capitalPag: empresaData['cappag-emp'] || '',
        capitalSusc: empresaData['capsus-emp'] || '',
        nombreAbrev: empresaData['abrenom-emp'] || '',
        rSocial: empresaData['razsoc-emp'] || '',
        backOrder: empresaData['bacord-emp'] || false, // "bacord-emp" para Back-Order (boolean)
        transporte: empresaData.transporte || '',
        ruta: empresaData.ruta || '',
        sector: empresaData.sector || '',
        secuencia: empresaData['secuen-emp'] || '',
        contribuye: empresaData['contri-emp'] || '',
        direcEntrega: empresaData['dirent-emp'] || '',
        correoElectr: empresaData['email-emp'] || ''
      });

      // Procesar campos de factura electrónica desde Agrega-Empr (modal)
      setTimeout(() => {
        this.processFacturaElectronicaFields(empresaData['Agrega-Empr'] || '');
      }, 100);

      // Mostrar el nombre de la empresa
      this.showEmpresaName(empresaData['nombre-emp'] || '');
    } else if (this.popupTitle().includes('Vendedor')) {
      // Es un vendedor - solo mapear el campo vendedor
      const vendedor = company as VendedorItem;
      this.companyForm.patchValue({
        vendedor: vendedor.vendedor
      });

      // Mostrar el nombre del vendedor debajo del input
      this.showVendedorName(vendedor.nombre || '');
    } else if (this.popupTitle().includes('Condición de Pago')) {
      // Es una condición de pago - solo mapear el campo condicionPago
      const condicionPago = company as CondicionPagoItem;

      this.companyForm.patchValue({
        condicionPago: condicionPago.condpago
      });

      // Mostrar el nombre de la condición de pago
      this.showCondicionPagoName(condicionPago.nombre || '');
    } else if (this.popupTitle().includes('NIT')) {
      // Es un NIT - solo mapear el campo nit
      const nit = company as NitItem;
      this.companyForm.patchValue({
        nit: nit.nit
      });

      // Mostrar el nombre del NIT
      this.showNitName(nit.nombre || '');
    } else if (this.popupTitle().includes('País')) {
      // Es un país - solo mapear el campo pais
      const pais = company as any;
      this.companyForm.patchValue({
        pais: pais.codigo
      });

      // Mostrar el nombre del país
      this.showPaisName(pais.nombre || '');
    } else if (this.popupTitle().includes('Ciudad')) {
      // Es una ciudad - solo mapear el campo ciudad
      const ciudad = company as any;
      this.companyForm.patchValue({
        ciudad: ciudad.codigo
      });

      // Mostrar el nombre de la ciudad
      this.showCiudadName(ciudad.nombre || '');
    } else if (this.popupTitle().includes('Zona')) {
      // Es una zona - solo mapear el campo zona
      const zona = company as any;
      this.companyForm.patchValue({
        zona: zona.codigo
      });

      // Mostrar el nombre de la zona
      this.showZonaName(zona.nombre || '');
    } else if (this.popupTitle().includes('Localidad')) {
      // Es una localidad - solo mapear el campo localidad
      const localidad = company as any;
      this.companyForm.patchValue({
        localidad: localidad.codigo
      });

      // Mostrar el nombre de la localidad
      this.showLocalidadName(localidad.nombre || '');
    } else if (this.popupTitle().includes('Negocio')) {
      // Es un negocio - solo mapear el campo negocio
      const negocio = company as any;
      this.companyForm.patchValue({
        negocio: negocio.codigo
      });

      // Mostrar el nombre del negocio
      this.showNegocioName(negocio.nombre || '');
    } else if (this.popupTitle().includes('Moneda')) {
      // Es una moneda - solo mapear el campo moneda
      const moneda = company as any;
      this.companyForm.patchValue({
        moneda: moneda.codigo
      });

      // Mostrar el nombre de la moneda
      this.showMonedaName(moneda.nombre || '');
    } else if (this.popupTitle().includes('Cobrador')) {
      // Es un cobrador - solo mapear el campo cobrador
      const cobrador = company as any;
      this.companyForm.patchValue({
        cobrador: cobrador.codigo
      });

      // Mostrar el nombre del cobrador
      this.showCobradorName(cobrador.nombre || '');
    } else if (this.popupTitle().includes('Clasificación Venta')) {
      // Es una clasificación de venta - solo mapear el campo clasificVenta
      const clasif = company as any;
      this.companyForm.patchValue({
        clasificVenta: clasif.codigo
      });

      // Mostrar el nombre de la clasificación de venta
      this.showClasificVentaName(clasif.nombre || '');
    } else if (this.popupTitle().includes('Clasificación por Cobro')) {
      // Es una clasificación por cobro - solo mapear el campo clasifXCobro
      const clasif = company as any;
      this.companyForm.patchValue({
        clasifXCobro: clasif.codigo
      });

      // Mostrar el nombre de la clasificación por cobro
      this.showClasifXCobroName(clasif.nombre || '');
    } else if (this.popupTitle().includes('Causa de Suspensión')) {
      // Es una causa de suspensión - solo mapear el campo causaSusp
      const causa = company as any;
      this.companyForm.patchValue({
        causaSusp: causa.codigo
      });

      // Mostrar el nombre de la causa de suspensión
      this.showCausaSuspName(causa.nombre || '');
    } else if (this.popupTitle().includes('LoS Line of Service')) {
      // Es un LoS Line of Service - solo mapear el campo losLineService
      const los = company as any;
      this.companyForm.patchValue({
        losLineService: los.codigo
      });

      // Mostrar el nombre del LoS Line of Service
      this.showLosLineServiceName(los.nombre || '');
    } else if (this.popupTitle().includes('SubLoS SubLine of Service')) {
      // Es un SubLoS SubLine of Service - solo mapear el campo subLosSubLine
      const subLos = company as any;
      this.companyForm.patchValue({
        subLosSubLine: subLos.codigo
      });

      // Mostrar el nombre del SubLoS SubLine of Service
      this.showSubLosSubLineName(subLos.nombre || '');
    } else if (this.popupTitle().includes('Product Group')) {
      // Es un Product Group - solo mapear el campo productGroup
      const productGroup = company as any;
      this.companyForm.patchValue({
        productGroup: productGroup.codigo
      });

      // Mostrar el nombre del Product Group
      this.showProductGroupName(productGroup.nombre || '');
    } else if (this.popupTitle().includes('Affinity')) {
      // Es un Affinity - solo mapear el campo affinity
      const affinity = company as any;
      this.companyForm.patchValue({
        affinity: affinity.codigo
      });

      // Mostrar el nombre del Affinity
      this.showAffinityName(affinity.nombre || '');
    } else if (this.popupTitle().includes('Transporte')) {
      // Es un Transporte - solo mapear el campo transporte
      const transporte = company as any;
      this.companyForm.patchValue({
        transporte: transporte.codigo
      });

      // Mostrar el nombre del Transporte
      this.showTransporteName(transporte.nombre || '');
    } else if (this.popupTitle().includes('Ruta')) {
      // Es una Ruta - solo mapear el campo ruta
      const ruta = company as any;
      this.companyForm.patchValue({
        ruta: ruta.codigo
      });

      // Mostrar el nombre de la Ruta
      this.showRutaName(ruta.nombre || '');
    } else if (this.popupTitle().includes('Sector')) {
      // Es un Sector - solo mapear el campo sector
      const sector = company as any;
      this.companyForm.patchValue({
        sector: sector.codigo
      });

      // Mostrar el nombre del Sector
      this.showSectorName(sector.nombre || '');
    } else if (this.popupTitle().includes('Tipo Cliente')) {
      // Es un Tipo Cliente - solo mapear el campo tipoCliente
      const tipoCliente = company as any;
      this.companyForm.patchValue({
        tipoCliente: tipoCliente.codigo
      });

      // Mostrar el nombre del Tipo Cliente
      this.showTipoClienteName(tipoCliente.nombre || '');
    }
    this.closePopup();
  }

  closePopup(): void {
    this.showPopup.set(false);
    this.searchTerm.set('');
    this.isLoading.set(false);
    this.modalService.closeModal();
  }

  onSearchChange(): void {
    if (this.popupTitle().includes('Compañía')) {
      this.filteredCompanies.set(this.companiasService.filterCompanias(this.searchTerm()));
    } else if (this.popupTitle().includes('Empresa')) {
      // Para empresas, usar el filtrado del servicio de empresas
      const empresas = this.filteredCompanies() as EmpresaItem[];
      this.filteredCompanies.set(this.empresasService.filterEmpresas(
        empresas.map(emp => ({ codigo: emp.codigo, descripcion: emp.descripcion })),
        this.searchTerm()
      ).map(searchItem => {
        // Encontrar la empresa completa por código
        return empresas.find(emp => emp.codigo === searchItem.codigo) ||
               { codigo: searchItem.codigo, descripcion: searchItem.descripcion } as EmpresaItem;
      }));
    } else if (this.popupTitle().includes('Vendedor')) {
      // Para vendedores, usar el filtrado del servicio de vendedores
      const vendedores = this.filteredCompanies() as VendedorItem[];
      this.filteredCompanies.set(this.vendedoresService.filterVendedores(vendedores, this.searchTerm()));
    } else if (this.popupTitle().includes('Condición de Pago')) {
      // Para condiciones de pago, usar el filtrado del servicio de condiciones de pago
      const condicionesPago = this.filteredCompanies() as CondicionPagoItem[];
      this.filteredCompanies.set(this.condicionesPagoService.filterCondicionesPago(condicionesPago, this.searchTerm()));
    } else if (this.popupTitle().includes('NIT')) {
      // Para NITs, usar el filtrado del servicio de NITs
      const nits = this.filteredCompanies() as NitItem[];
      this.filteredCompanies.set(this.nitsService.filterNits(this.searchTerm(), nits));
    } else if (this.popupTitle().includes('País')) {
      // Para países, filtrar localmente
      const paises = this.filteredCompanies() as any[];
      const filtered = paises.filter(pais =>
        pais.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        pais.codigo.toLowerCase().includes(this.searchTerm().toLowerCase())
      );
      this.filteredCompanies.set(filtered);
    } else if (this.popupTitle().includes('Ciudad')) {
      // Para ciudades, filtrar localmente
      const ciudades = this.filteredCompanies() as any[];
      const filtered = ciudades.filter(ciudad =>
        ciudad.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        ciudad.codigo.toLowerCase().includes(this.searchTerm().toLowerCase())
      );
      this.filteredCompanies.set(filtered);
    } else if (this.popupTitle().includes('Zona')) {
      // Para zonas, filtrar localmente
      const zonas = this.filteredCompanies() as any[];
      const filtered = zonas.filter(zona =>
        zona.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        zona.codigo.toString().includes(this.searchTerm())
      );
      this.filteredCompanies.set(filtered);
    } else if (this.popupTitle().includes('Localidad')) {
      // Para localidades, filtrar localmente
      const localidades = this.filteredCompanies() as any[];
      const filtered = localidades.filter(localidad =>
        localidad.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        localidad.codigo.toString().includes(this.searchTerm())
      );
      this.filteredCompanies.set(filtered);
    } else if (this.popupTitle().includes('Negocio')) {
      // Para negocios, filtrar localmente
      const negocios = this.filteredCompanies() as any[];
      const filtered = negocios.filter(negocio =>
        negocio.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        negocio.codigo.toString().includes(this.searchTerm())
      );
      this.filteredCompanies.set(filtered);
    } else if (this.popupTitle().includes('Moneda')) {
      // Para monedas, filtrar localmente
      const monedas = this.filteredCompanies() as any[];
      const filtered = monedas.filter(moneda =>
        moneda.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        moneda.codigo.toString().includes(this.searchTerm())
      );
      this.filteredCompanies.set(filtered);
    } else if (this.popupTitle().includes('Cobrador')) {
      // Para cobradores, filtrar localmente
      const cobradores = this.filteredCompanies() as any[];
      const filtered = cobradores.filter(cobrador =>
        cobrador.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        cobrador.codigo.toString().includes(this.searchTerm())
      );
      this.filteredCompanies.set(filtered);
    } else if (this.popupTitle().includes('Clasificación Venta')) {
      // Para clasificaciones de venta, filtrar localmente
      const clasificVentas = this.filteredCompanies() as any[];
      const filtered = clasificVentas.filter(clasif =>
        clasif.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        clasif.codigo.toLowerCase().includes(this.searchTerm().toLowerCase())
      );
      this.filteredCompanies.set(filtered);
    } else if (this.popupTitle().includes('Clasificación por Cobro')) {
      // Para clasificaciones por cobro, filtrar localmente
      const clasifXCobros = this.filteredCompanies() as any[];
      const filtered = clasifXCobros.filter(clasif =>
        clasif.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        clasif.codigo.toLowerCase().includes(this.searchTerm().toLowerCase())
      );
      this.filteredCompanies.set(filtered);
    } else if (this.popupTitle().includes('Causa de Suspensión')) {
      // Para causas de suspensión, filtrar localmente
      const causasSusp = this.filteredCompanies() as any[];
      const filtered = causasSusp.filter(causa =>
        causa.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        causa.codigo.toString().includes(this.searchTerm())
      );
      this.filteredCompanies.set(filtered);
    } else if (this.popupTitle().includes('LoS Line of Service')) {
      // Para LoS Line of Services, filtrar localmente
      const losLineServices = this.filteredCompanies() as any[];
      const filtered = losLineServices.filter(los =>
        los.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        los.codigo.toString().includes(this.searchTerm())
      );
      this.filteredCompanies.set(filtered);
    } else if (this.popupTitle().includes('SubLoS SubLine of Service')) {
      // Para SubLoS SubLine of Services, filtrar localmente
      const subLosSubLines = this.filteredCompanies() as any[];
      const filtered = subLosSubLines.filter(subLos =>
        subLos.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        subLos.codigo.toString().includes(this.searchTerm())
      );
      this.filteredCompanies.set(filtered);
    } else if (this.popupTitle().includes('Product Group')) {
      // Para Product Groups, filtrar localmente
      const productGroups = this.filteredCompanies() as any[];
      const filtered = productGroups.filter(productGroup =>
        productGroup.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        productGroup.codigo.toString().includes(this.searchTerm())
      );
      this.filteredCompanies.set(filtered);
    } else if (this.popupTitle().includes('Affinity')) {
      // Para Affinities, filtrar localmente
      const affinities = this.filteredCompanies() as any[];
      const filtered = affinities.filter(affinity =>
        affinity.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        affinity.codigo.toString().includes(this.searchTerm())
      );
      this.filteredCompanies.set(filtered);
    } else if (this.popupTitle().includes('Transporte')) {
      // Para Transportes, filtrar localmente
      const transportes = this.filteredCompanies() as any[];
      const filtered = transportes.filter(transporte =>
        transporte.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        transporte.codigo.toString().includes(this.searchTerm())
      );
      this.filteredCompanies.set(filtered);
    } else if (this.popupTitle().includes('Ruta')) {
      // Para Rutas, filtrar localmente
      const rutas = this.filteredCompanies() as any[];
      const filtered = rutas.filter(ruta =>
        ruta.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        ruta.codigo.toString().includes(this.searchTerm())
      );
      this.filteredCompanies.set(filtered);
    } else if (this.popupTitle().includes('Sector')) {
      // Para Sectores, filtrar localmente
      const sectores = this.filteredCompanies() as any[];
      const filtered = sectores.filter(sector =>
        sector.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        sector.codigo.toString().includes(this.searchTerm())
      );
      this.filteredCompanies.set(filtered);
    } else if (this.popupTitle().includes('Tipo Cliente')) {
      // Para Tipo Clientes, filtrar localmente
      const tipoClientes = this.filteredCompanies() as any[];
      const filtered = tipoClientes.filter(tipoCliente =>
        tipoCliente.nombre.toLowerCase().includes(this.searchTerm().toLowerCase()) ||
        tipoCliente.codigo.toString().includes(this.searchTerm())
      );
      this.filteredCompanies.set(filtered);
    }
  }

  onSearch(): void {
    // Usar la misma lógica que onSearchChange pero solo cuando se hace click o Enter
    this.onSearchChange();
  }

  onSearchClear(): void {
    this.searchTerm.set('');
    // Restaurar todos los datos originales
    if (this.popupTitle().includes('Compañía')) {
      this.loadCompanias();
    } else if (this.popupTitle().includes('Empresa')) {
      this.loadEmpresas();
    } else if (this.popupTitle().includes('Vendedor')) {
      this.loadVendedores();
    } else if (this.popupTitle().includes('Condición de Pago')) {
      this.loadCondicionesPago();
    } else if (this.popupTitle().includes('NIT')) {
      this.loadNits();
    } else if (this.popupTitle().includes('País')) {
      this.loadPaises();
    } else if (this.popupTitle().includes('Ciudad')) {
      this.loadCiudades();
    } else if (this.popupTitle().includes('Zona')) {
      this.loadZonas();
    } else if (this.popupTitle().includes('Localidad')) {
      this.loadLocalidades();
    } else if (this.popupTitle().includes('Negocio')) {
      this.loadNegocios();
    } else if (this.popupTitle().includes('Moneda')) {
      this.loadMonedas();
    } else if (this.popupTitle().includes('Cobrador')) {
      this.loadCobradores();
    } else if (this.popupTitle().includes('Clasificación Venta')) {
      this.loadClasificVentas();
    } else if (this.popupTitle().includes('Clasificación por Cobro')) {
      this.loadClasifXCobros();
    } else if (this.popupTitle().includes('Causa de Suspensión')) {
      this.loadCausasSusp();
    } else if (this.popupTitle().includes('LoS Line of Service')) {
      this.loadLosLineServices();
    } else if (this.popupTitle().includes('SubLoS SubLine of Service')) {
      this.loadSubLosSubLines();
    } else if (this.popupTitle().includes('Product Group')) {
      this.loadProductGroups();
    } else if (this.popupTitle().includes('Affinity')) {
      this.loadAffinities();
    } else if (this.popupTitle().includes('Transporte')) {
      this.loadTransportes();
    } else if (this.popupTitle().includes('Ruta')) {
      this.loadRutas();
    } else if (this.popupTitle().includes('Sector')) {
      this.loadSectores();
    } else if (this.popupTitle().includes('Tipo Cliente')) {
      this.loadTipoClientes();
    }
  }

  onSubmit(): void {
    if (this.companyForm.valid) {
      const formData = this.companyForm.value;
      const currentUser = this.authService.user();

      if (!currentUser) {
        this.toastService.showError('No hay usuario autenticado');
        return;
      }

      // Construir el JSON según la estructura requerida por UpdateEmpresa
      const empresaData = this.buildEmpresaData(formData, currentUser);

      const headers = new HttpHeaders({
        'Content-Type': 'application/json'
      });

      const url = `${environment.apiUrl}/UpdateEmpresa`;

      console.log('💾 [GUARDAR] JSON enviado:', JSON.stringify(empresaData, null, 2));
      console.log('🌐 [GUARDAR] Endpoint:', url);

      // Mostrar loading global
      this.loadingService.show('Guardando empresa...');

      this.http.put(url, empresaData, { headers }).subscribe({
        next: (response) => {
          console.log('✅ [GUARDAR] Respuesta exitosa:', response);
          this.toastService.showSuccess('Empresa guardada exitosamente');
          this.loadingService.hide();
        },
        error: (error) => {
          console.error('❌ [GUARDAR] Error al guardar empresa:', error);
          console.error('❌ [GUARDAR] Detalles del error:', {
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            error: error.error
          });
          this.toastService.showError('Error al guardar la empresa. Por favor, intente nuevamente.');
          this.loadingService.hide();
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.companyForm.controls).forEach(key => {
        this.companyForm.get(key)?.markAsTouched();
      });
      this.toastService.showError('Por favor, complete todos los campos requeridos');
    }
  }

  onDelete(): void {
    // Handle delete operation
    // Add confirmation dialog and delete logic here
  }

  private buildEmpresaData(formData: any, currentUser: any): any {
    // Obtener datos de factura electrónica
    const facturaElectronica = formData.facturaElectronica || {};

    // Construir el JSON según la estructura requerida por UpdateEmpresa
    const empresaData = {
      tccempres: [{
        // Campos básicos
        "abrenom-emp": formData.nombreAbrev || "",
        "Agrega-Empr": "",
        "bacord-emp": formData.backOrder || false,
        "cappag-emp": this.parseNumber(formData.capitalPag) || 0,
        "capsus-emp": this.parseNumber(formData.capitalSusc) || 0,
        "causa-susp": this.parseNumber(formData.causaSusp) || 0,
        "cia": this.parseNumber(formData.compania) || 0,
        "nombre-cia": this.companiaName() || "",
        "ciudad": formData.ciudad || "",
        "clacob": formData.clasifXCobro || "",
        "claven": formData.clasificVenta || "",
        "cobrador": this.parseNumber(formData.cobrador) || 0,
        "codigo-cob1": this.parseNumber(formData.losLineService) || 0,
        "codigo-cob2": this.parseNumber(formData.subLosSubLine) || 0,
        "codigo-cob3": this.parseNumber(formData.productGroup) || 0,
        "codigo-cob4": this.parseNumber(formData.affinity) || 0,
        "codigo-cob5": 0,
        "condpago": this.parseNumber(formData.condicionPago) || 0,
        "contri-emp": this.parseNumber(formData.contribuye) || 0,
        "date-ctrl": new Date().toISOString().split('T')[0],
        "diacaj-emp": this.parseNumber(formData.diaCaja) || 0,
        "direc-emp": formData.direccion || "",
        "dirent-emp": formData.direcEntrega || "",
        "email-emp": formData.correoElectr || "",
        "empresa": this.parseNumber(formData.empresa) || 0,
        "fax-emp": formData.fax || "",
        "fecauli-emp": null,
        "fecing-emp": formData.fechaIngreso || new Date().toISOString().split('T')[0],
        "fecmdreg-emp": null,
        "fecreg-emp": formData.fechaRegistro || null,
        "limite-emp": this.parseNumber(formData.limite) || 0.00,
        "localidad": this.parseNumber(formData.localidad) || 0,
        "login-ctrl": currentUser.pcLogin || "",
        "moneda": this.parseNumber(formData.moneda) || 0,
        "negocio": this.parseNumber(formData.negocio) || 0,
        "nit": formData.nit || "",
        "nombre-emp": formData.nombre || "",
        "nomcon-emp": formData.contactos || "",
        "pais": formData.pais || "",
        "pordes-emp": this.parseNumber(formData.descuento) || 0.00,
        "razsoc-emp": formData.rSocial || "",
        "regmer-emp": formData.regMercan || "",
        "rif-emp": formData.rif || "",
        "ruta": this.parseNumber(formData.ruta) || 0,
        "sector": this.parseNumber(formData.sector) || 0,
        "secuen-emp": this.parseNumber(formData.secuencia) || 0,
        "telefo-emp": formData.telefonos || "",
        "telex-emp": formData.telex || "",
        "text-emp": formData.comentarios || "",
        "tipocli": this.parseNumber(formData.tipoCliente) || 0,
        "tippre-emp": 0,
        "transporte": this.parseNumber(formData.transporte) || 0,
        "vendedor": this.parseNumber(formData.vendedor) || 0,
        "zona": this.parseNumber(formData.zona) || 0,
        "zonpos-emp": formData.zonaPostal || "",

        // Campos de nombres descriptivos
        "nombre-vend": this.vendedorName() || "",
        "nombre-cpag": this.condicionPagoName() || "",
        "nombre-pai": this.paisName() || "",
        "nombre-ciu": this.ciudadName() || "",
        "nombre-zon": this.zonaName() || "",
        "nombre-loc": this.localidadName() || "",
        "nombre-neg": this.negocioName() || "",
        "nombre-tipc": "", // No hay campo para tipo cliente name
        "nombre-mon": this.monedaName() || "",
        "nombre-cobr": this.cobradorName() || "",
        "nombre-cven": this.clasificVentaName() || "",
        "nombre-ccob": this.clasifXCobroName() || "",
        "nombre-caus": this.causaSuspName() || "",
        "nombre-cob1": this.losLineServiceName() || "",
        "nombre-cob2": this.subLosSubLineName() || "",
        "nombre-cob3": this.productGroupName() || "",
        "nombre-cob4": this.affinityName() || "",
        "nombre-tran": this.transporteName() || "",
        "nombre-rut": this.rutaName() || "",
        "nombre-sect": this.sectorName() || "",

        // Campos adicionales
        "agrega-codsin": "",
        "agrega-codsbu": "",
        "agrega-codsbi": "",
        "agrega-preemp": 0,
        "agrega-clireg": "",
        "agrega-cliuni": "",
        "agrega-clicor": "",
        "agrega-clisit": "",
        "agrega-clicep": "",
        "agrega-clisms": "",

        // Campos de factura electrónica
        "agrega-fact_01": facturaElectronica.agregaFact01 ? "SI" : "NO",
        "agrega-fact_02": facturaElectronica.agregaFact02 ? "SI" : "NO",
        "agrega-fact_03": facturaElectronica.agregaFact03 ? "SI" : "NO",
        "agrega-fact_04": facturaElectronica.agregaFact04 ? "SI" : "NO",
        "agrega-fact_05": facturaElectronica.agregaFact05 ? "SI" : "NO",
        "agrega-fact_06": facturaElectronica.agregaFact06 ? "SI" : "NO",
        "agrega-fact_07": facturaElectronica.agregaFact07 ? "SI" : "NO",
        "agrega-fact_08": facturaElectronica.agregaFact08 ? "SI" : "NO",

        "tparent": currentUser.pcLogin || "",
        "mensajeError": ""
      }]
    };

    return empresaData;
  }

  private parseNumber(value: any): number {
    if (value === null || value === undefined || value === '') {
      return 0;
    }
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }

  onCompaniaBlur(): void {
    this.lookupCompania();
  }

  onCompaniaEnter(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.lookupCompania();
  }

  onEmpresaBlur(): void {
    this.lookupEmpresa();
  }

  onEmpresaEnter(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.lookupEmpresa();
  }

  onVendedorBlur(): void {
    this.lookupVendedor();
  }

  onVendedorEnter(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.lookupVendedor();
  }

  onCondicionPagoBlur(): void {
    this.lookupCondicionPago();
  }

  onCondicionPagoEnter(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.lookupCondicionPago();
  }

  onNitBlur(): void {
    this.lookupNit();
  }

  onNitEnter(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.lookupNit();
  }

  onPaisBlur(): void {
    this.lookupPais();
  }

  onPaisEnter(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.lookupPais();
  }

  onCiudadBlur(): void {
    this.lookupCiudad();
  }

  onCiudadEnter(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.lookupCiudad();
  }

  onZonaBlur(): void {
    this.lookupZona();
  }

  onZonaEnter(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.lookupZona();
  }

  onLocalidadBlur(): void {
    this.lookupLocalidad();
  }

  onLocalidadEnter(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.lookupLocalidad();
  }

  onNegocioBlur(): void {
    this.lookupNegocio();
  }

  onNegocioEnter(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.lookupNegocio();
  }

  onMonedaBlur(): void {
    this.lookupMoneda();
  }

  onMonedaEnter(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.lookupMoneda();
  }

  onCobradorBlur(): void {
    this.lookupCobrador();
  }

  onCobradorEnter(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.lookupCobrador();
  }

  onClasificVentaBlur(): void {
    this.lookupClasificVenta();
  }

  onClasificVentaEnter(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.lookupClasificVenta();
  }

  onClasifXCobroBlur(): void {
    this.lookupClasifXCobro();
  }

  onClasifXCobroEnter(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.lookupClasifXCobro();
  }

  onCausaSuspBlur(): void {
    this.lookupCausaSusp();
  }

  onCausaSuspEnter(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.lookupCausaSusp();
  }

  onLosLineServiceBlur(): void {
    this.lookupLosLineService();
  }

  onLosLineServiceEnter(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.lookupLosLineService();
  }

  onSubLosSubLineBlur(): void {
    this.lookupSubLosSubLine();
  }

  onSubLosSubLineEnter(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.lookupSubLosSubLine();
  }

  onProductGroupBlur(): void {
    this.lookupProductGroup();
  }

  onProductGroupEnter(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.lookupProductGroup();
  }

  onAffinityBlur(): void {
    this.lookupAffinity();
  }

  onAffinityEnter(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.lookupAffinity();
  }

  onTransporteBlur(): void {
    this.lookupTransporte();
  }

  onTransporteEnter(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.lookupTransporte();
  }

  onRutaBlur(): void {
    this.lookupRuta();
  }

  onRutaEnter(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.lookupRuta();
  }

  onSectorBlur(): void {
    this.lookupSector();
  }

  onSectorEnter(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.lookupSector();
  }

  onTipoClienteBlur(): void {
    this.lookupTipoCliente();
  }

  onTipoClienteEnter(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    this.lookupTipoCliente();
  }

  onFormKeydown(event: any): void {
    // Si es Enter y el target es el campo empresa, prevenir el submit
    if (event.key === 'Enter' && event.target && event.target.formControlName === 'empresa') {
      event.preventDefault();
      event.stopPropagation();
      this.lookupEmpresa();
    }
  }

  onFormSubmit(event: any): void {
    event.preventDefault();
    event.stopPropagation();
  }

  private lookupCompania(): void {
    const companiaCode = this.companyForm.get('compania')?.value;

    if (!companiaCode) {
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);
    if (!currentUser) {
      return;
    }

    // Llamar al servicio para buscar la compañía
    this.companiasService.getCompaniaByCode(
      companiaCode,
      currentUser.pcLogin || '',
      pcSuper,
      currentUser.pcToken || ''
    ).subscribe({
      next: (response) => {
        // Verificar si hay datos en la respuesta
        if (response.dsRespuesta && response.dsRespuesta.tgecias && response.dsRespuesta.tgecias.length > 0) {
          const companiaData = response.dsRespuesta.tgecias[0];

          // Verificar si hay errores específicos
          if (companiaData.terrores && companiaData.terrores.length > 0) {
            const error = companiaData.terrores[0];
            // Mostrar error si no encontró registro o compañía no existe
            if (error.descripcion && (
              error.descripcion.toLowerCase().includes('no encontró registro') ||
              error.descripcion.toLowerCase().includes('compañia no existe') ||
              error.descripcion.toLowerCase().includes('compania no existe') ||
              error.codigo === 'GE6001'
            )) {
              this.toastService.showError(error.descripcion);
              return;
            }
            // Para cualquier otro error, ignorarlo y continuar con la carga de datos
          }

          // Verificar si la compañía tiene datos válidos (cia no es null)
          if (companiaData.cia === null || companiaData.cia === undefined) {
            this.toastService.showError('Compañía no encontrada');
            return;
          }

          // Procesar la compañía (con o sin errores que no sean "no encontró registro")
          this.fillFormWithCompaniaData(companiaData);
        } else {
          this.toastService.showError('No se encontraron datos de la compañía');
        }
      },
      error: (error) => {
        console.error('Error al buscar compañía:', error);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private lookupEmpresa(): void {
    const empresaCode = this.companyForm.get('empresa')?.value;
    const companiaCode = this.companyForm.get('compania')?.value;

    if (!empresaCode || !companiaCode) {
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      return;
    }

    // Llamar al servicio para buscar la empresa
    this.empresasService.getEmpresaByCode(
      companiaCode,
      currentUser.pcLogin || '',
      pcSuper,
      currentUser.pcToken || '',
      empresaCode
    ).subscribe({
      next: (response) => {
        // Verificar si hay datos en la respuesta
        if (response.dsRespuesta && response.dsRespuesta.tccempres && response.dsRespuesta.tccempres.length > 0) {
          const empresaData = response.dsRespuesta.tccempres[0];

          // Verificar si hay errores específicos (solo CC9999)
          if (empresaData.terrores && empresaData.terrores.length > 0) {
            const error = empresaData.terrores[0];
            // Solo mostrar error si el código es CC9999 (CLIENTE NO EXISTE)
            if (error.codigo === 'CC9999') {
              this.toastService.showError(error.descripcion);
              return;
            }
            // Para cualquier otro error, ignorarlo y continuar con la carga de datos
          }

          // Procesar la empresa (con o sin errores que no sean CC9999)
          this.fillFormWithEmpresaData(empresaData);
        } else {
          this.toastService.showError('No se encontraron datos de la empresa');
        }
      },
      error: (error) => {
        console.error('Error al buscar empresa:', error);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private lookupVendedor(): void {
    const vendedorCode = this.companyForm.get('vendedor')?.value;
    const companiaCode = this.companyForm.get('compania')?.value;

    if (!vendedorCode || !companiaCode) {
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      return;
    }

    // Llamar al servicio para buscar el vendedor
    this.vendedoresService.getVendedorByCode(
      companiaCode,
      vendedorCode,
      currentUser.pcLogin || '',
      pcSuper,
      currentUser.pcToken || ''
    ).subscribe({
      next: (response) => {
        // Verificar si hay datos en la respuesta
        if (response.dsRespuesta && response.dsRespuesta.tccvended && response.dsRespuesta.tccvended.length > 0) {
          const vendedorData = response.dsRespuesta.tccvended[0];

          // Verificar si hay errores específicos (solo CC6066)
          if (vendedorData.terrores && vendedorData.terrores.length > 0) {
            const error = vendedorData.terrores[0];
            // Solo mostrar error si el código es CC6066 (NO EXISTE VENDEDOR)
            if (error.codigo === 'CC6066') {
              this.toastService.showError(error.descripcion);
              return;
            }
            // Para cualquier otro error, ignorarlo y continuar con la carga de datos
          }

          // Procesar el vendedor (con o sin errores que no sean CC6066)
          this.fillFormWithVendedorData(vendedorData);
        } else {
          this.toastService.showError('No se encontraron datos del vendedor');
        }
      },
      error: (error) => {
        console.error('Error al buscar vendedor:', error);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private lookupCondicionPago(): void {
    const condicionPagoCode = this.companyForm.get('condicionPago')?.value;
    const companiaCode = this.companyForm.get('compania')?.value;

    if (!condicionPagoCode || !companiaCode) {
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      return;
    }

    // Llamar al servicio para buscar la condición de pago
    this.condicionesPagoService.getCondicionPagoByCode(
      companiaCode,
      condicionPagoCode,
      currentUser.pcLogin || '',
      pcSuper,
      currentUser.pcToken || ''
    ).subscribe({
      next: (response) => {
        // Verificar si hay datos en la respuesta
        if (response.dsRespuesta && response.dsRespuesta.tccconpag && response.dsRespuesta.tccconpag.length > 0) {
          const condicionPagoData = response.dsRespuesta.tccconpag[0];

          // Verificar si hay errores específicos (solo CC6060)
          if (condicionPagoData.terrores && condicionPagoData.terrores.length > 0) {
            const error = condicionPagoData.terrores[0];
            // Solo mostrar error si el código es CC6060 (CONDICION DE PAGO NO EXISTE)
            if (error.codigo === 'CC6060') {
              this.toastService.showError(error.descripcion);
              return;
            }
            // Para cualquier otro error, ignorarlo y continuar con la carga de datos
          }

          // Verificar si realmente hay datos válidos (condpago > 0 y nombre no vacío)
          if (condicionPagoData.condpago && condicionPagoData.condpago > 0 && condicionPagoData['nombre-cpag'] && condicionPagoData['nombre-cpag'].trim() !== '') {
            // Procesar la condición de pago solo si tiene datos válidos
            this.fillFormWithCondicionPagoData(condicionPagoData);
          } else {
            // Si no hay datos válidos, mostrar error
            this.toastService.showError('No se encontraron datos válidos de la condición de pago');
          }
        } else {
          this.toastService.showError('No se encontraron datos de la condición de pago');
        }
      },
      error: (error) => {
        console.error('Error al buscar condición de pago:', error);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private lookupNit(): void {
    const nitCode = this.companyForm.get('nit')?.value;

    if (!nitCode) {
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      return;
    }

    // Llamar al servicio para buscar el NIT
    this.nitsService.getNitByCode(
      nitCode,
      currentUser.pcLogin || '',
      pcSuper,
      currentUser.pcToken || ''
    ).subscribe({
      next: (response: any) => {
        // Verificar si hay datos en la respuesta
        if (response.dsRespuesta && response.dsRespuesta.tgenit && response.dsRespuesta.tgenit.length > 0) {
          const nitData = response.dsRespuesta.tgenit[0];

          // Verificar si hay errores específicos (solo GE6136)
          if (nitData.terrores && nitData.terrores.length > 0) {
            const error = nitData.terrores[0];
            // Solo mostrar error si el código es GE6136 (NUMERO DE NIT NO EXISTE)
            if (error.codigo === 'GE6136') {
              this.toastService.showError(error.descripcion);
              return;
            }
            // Para cualquier otro error, ignorarlo y continuar con la carga de datos
          }

          // Verificar si realmente hay datos válidos (nit no vacío y nombre no vacío)
          if (nitData.nit && nitData.nit.trim() !== '' && nitData['nombre-nit'] && nitData['nombre-nit'].trim() !== '') {
            // Procesar el NIT solo si tiene datos válidos
            this.fillFormWithNitData(nitData);
          } else {
            // Si no hay datos válidos, mostrar error
            this.toastService.showError('No se encontraron datos válidos del NIT');
          }
        } else {
          this.toastService.showError('No se encontraron datos del NIT');
        }
      },
      error: (error: any) => {
        console.error('Error al buscar NIT:', error);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private lookupPais(): void {
    const paisCode = this.companyForm.get('pais')?.value;

    if (!paisCode) {
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      return;
    }

    // Construir la URL para buscar el país específico
    const url = `${environment.apiUrl}/GetLeavePais?pcPais=${paisCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        // Verificar si hay datos en la respuesta
        if (response.dsRespuesta && response.dsRespuesta.tgepais && response.dsRespuesta.tgepais.length > 0) {
          const paisData = response.dsRespuesta.tgepais[0];

          // Verificar si hay errores en terrores
          if (paisData.terrores && paisData.terrores.length > 0) {
            const error = paisData.terrores[0];
            // Mostrar error si no se encontró el registro
            if (error.descripcion && error.descripcion.toLowerCase().includes('no encontró')) {
              this.toastService.showError(error.descripcion);
              return;
            }
          }

          // Verificar si realmente hay datos válidos (pais no vacío y nombre no vacío)
          if (paisData.pais && paisData.pais.trim() !== '' && paisData['nombre-pai'] && paisData['nombre-pai'].trim() !== '') {
            // Procesar el país solo si tiene datos válidos
            this.fillFormWithPaisData(paisData);
          } else {
            // Si no hay datos válidos, mostrar error
            this.toastService.showError('No se encontraron datos válidos del país');
          }
        } else {
          this.toastService.showError('No se encontraron datos del país');
        }
      },
      error: (error) => {
        console.error('Error al buscar país:', error);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private lookupCiudad(): void {
    const ciudadCode = this.companyForm.get('ciudad')?.value;
    const paisCode = this.companyForm.get('pais')?.value;

    if (!ciudadCode || !paisCode) {
      if (!paisCode) {
        this.toastService.showError('Debe seleccionar un país primero');
      }
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      return;
    }

    // Construir la URL para buscar la ciudad específica
    const url = `${environment.apiUrl}/GetLeaveCiudad?pcPais=${paisCode}&pcCiudad=${ciudadCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        // Verificar si hay datos en la respuesta
        if (response.dsRespuesta && response.dsRespuesta.tgeciudad && response.dsRespuesta.tgeciudad.length > 0) {
          const ciudadData = response.dsRespuesta.tgeciudad[0];

          // Verificar si hay errores en terrores
          if (ciudadData.terrores && ciudadData.terrores.length > 0) {
            const error = ciudadData.terrores[0];
            // Mostrar error si no se encontró el registro
            if (error.descripcion && error.descripcion.toLowerCase().includes('no encontró')) {
              this.toastService.showError(error.descripcion);
              return;
            }
          }

          // Verificar si realmente hay datos válidos (ciudad no vacío y nombre no vacío)
          if (ciudadData.ciudad && ciudadData.ciudad.trim() !== '' && ciudadData['nombre-ciu'] && ciudadData['nombre-ciu'].trim() !== '') {
            // Procesar la ciudad solo si tiene datos válidos
            this.fillFormWithCiudadData(ciudadData);
          } else {
            // Si no hay datos válidos, mostrar error
            this.toastService.showError('No se encontraron datos válidos de la ciudad');
          }
        } else {
          this.toastService.showError('No se encontraron datos de la ciudad');
        }
      },
      error: (error) => {
        console.error('Error al buscar ciudad:', error);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private lookupZona(): void {
    const zonaCode = this.companyForm.get('zona')?.value;
    const companiaCode = this.companyForm.get('compania')?.value;

    if (!zonaCode || !companiaCode) {
      if (!companiaCode) {
        this.toastService.showError('Debe seleccionar una compañía primero');
      }
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      return;
    }

    // Construir la URL para buscar la zona específica
    const url = `${environment.apiUrl}/GetLeaveZona?pcCompania=${companiaCode}&pcZona=${zonaCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        // Verificar si hay datos en la respuesta
        if (response.dsRespuesta && response.dsRespuesta.tcczona && response.dsRespuesta.tcczona.length > 0) {
          const zonaData = response.dsRespuesta.tcczona[0];

          // Verificar si hay errores en terrores
          if (zonaData.terrores && zonaData.terrores.length > 0) {
            const error = zonaData.terrores[0];
            // Mostrar error si no se encontró el registro
            if (error.descripcion && error.descripcion.toLowerCase().includes('no encontró')) {
              this.toastService.showError(error.descripcion);
              return;
            }
          }

          // Verificar si realmente hay datos válidos (zona no vacío y nombre no vacío)
          if (zonaData.zona && zonaData['nombre-zon'] && zonaData['nombre-zon'].trim() !== '') {
            // Procesar la zona solo si tiene datos válidos
            this.fillFormWithZonaData(zonaData);
          } else {
            // Si no hay datos válidos, mostrar error
            this.toastService.showError('No se encontraron datos válidos de la zona');
          }
        } else {
          this.toastService.showError('No se encontraron datos de la zona');
        }
      },
      error: (error) => {
        console.error('Error al buscar zona:', error);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private lookupLocalidad(): void {
    const localidadCode = this.companyForm.get('localidad')?.value;
    const companiaCode = this.companyForm.get('compania')?.value;

    if (!localidadCode || !companiaCode) {
      if (!companiaCode) {
        this.toastService.showError('Debe seleccionar una compañía primero');
      }
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      return;
    }

    // Construir la URL para buscar la localidad específica
    const url = `${environment.apiUrl}/GetLeaveLocalidad?pcCompania=${companiaCode}&pcLocalidad=${localidadCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        // Verificar si hay datos en la respuesta
        if (response.dsRespuesta && response.dsRespuesta.tcclocali && response.dsRespuesta.tcclocali.length > 0) {
          const localidadData = response.dsRespuesta.tcclocali[0];

          // Verificar si hay errores en terrores
          if (localidadData.terrores && localidadData.terrores.length > 0) {
            const error = localidadData.terrores[0];
            // Mostrar error si no se encontró el registro
            if (error.descripcion && error.descripcion.toLowerCase().includes('no encontró')) {
              this.toastService.showError(error.descripcion);
              return;
            }
          }

          // Verificar si realmente hay datos válidos (localidad no vacío y nombre no vacío)
          if (localidadData.localidad && localidadData['nombre-loc'] && localidadData['nombre-loc'].trim() !== '') {
            // Procesar la localidad solo si tiene datos válidos
            this.fillFormWithLocalidadData(localidadData);
          } else {
            // Si no hay datos válidos, mostrar error
            this.toastService.showError('No se encontraron datos válidos de la localidad');
          }
        } else {
          this.toastService.showError('No se encontraron datos de la localidad');
        }
      },
      error: (error) => {
        console.error('Error al buscar localidad:', error);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private lookupNegocio(): void {
    const negocioCode = this.companyForm.get('negocio')?.value;
    const companiaCode = this.companyForm.get('compania')?.value;

    if (!negocioCode || !companiaCode) {
      if (!companiaCode) {
        this.toastService.showError('Debe seleccionar una compañía primero');
      }
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      return;
    }

    // Construir la URL para buscar el negocio específico
    const url = `${environment.apiUrl}/GetLeaveNegocio?pcCompania=${companiaCode}&pcNegocio=${negocioCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        // Verificar si hay datos en la respuesta
        if (response.dsRespuesta && response.dsRespuesta.tccnegoci && response.dsRespuesta.tccnegoci.length > 0) {
          const negocioData = response.dsRespuesta.tccnegoci[0];

          // Verificar si hay errores en terrores
          if (negocioData.terrores && negocioData.terrores.length > 0) {
            const error = negocioData.terrores[0];
            // Mostrar error si no se encontró el registro
            if (error.descripcion && error.descripcion.toLowerCase().includes('no encontró')) {
              this.toastService.showError(error.descripcion);
              return;
            }
          }

          // Verificar si realmente hay datos válidos (negocio no vacío y nombre no vacío)
          if (negocioData.negocio && negocioData['nombre-neg'] && negocioData['nombre-neg'].trim() !== '') {
            // Procesar el negocio solo si tiene datos válidos
            this.fillFormWithNegocioData(negocioData);
          } else {
            // Si no hay datos válidos, mostrar error
            this.toastService.showError('No se encontraron datos válidos del negocio');
          }
        } else {
          this.toastService.showError('No se encontraron datos del negocio');
        }
      },
      error: (error) => {
        console.error('Error al buscar negocio:', error);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private lookupMoneda(): void {
    const monedaCode = this.companyForm.get('moneda')?.value;

    if (!monedaCode) {
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      return;
    }

    // Construir la URL para buscar la moneda específica
    const url = `${environment.apiUrl}/GetLeaveMoneda?pcMoneda=${monedaCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        // Verificar si hay datos en la respuesta
        if (response.dsRespuesta && response.dsRespuesta.tgemoneda && response.dsRespuesta.tgemoneda.length > 0) {
          const monedaData = response.dsRespuesta.tgemoneda[0];

          // Verificar si hay errores en terrores
          if (monedaData.terrores && monedaData.terrores.length > 0) {
            const error = monedaData.terrores[0];
            // Mostrar error si no se encontró el registro
            if (error.descripcion && error.descripcion.toLowerCase().includes('no encontró')) {
              this.toastService.showError(error.descripcion);
              return;
            }
          }

          // Verificar si realmente hay datos válidos (moneda no vacío y nombre no vacío)
          if (monedaData.moneda && monedaData['nombre-mon'] && monedaData['nombre-mon'].trim() !== '') {
            // Procesar la moneda solo si tiene datos válidos
            this.fillFormWithMonedaData(monedaData);
          } else {
            // Si no hay datos válidos, mostrar error
            this.toastService.showError('No se encontraron datos válidos de la moneda');
          }
        } else {
          this.toastService.showError('No se encontraron datos de la moneda');
        }
      },
      error: (error) => {
        console.error('Error al buscar moneda:', error);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private lookupCobrador(): void {
    const cobradorCode = this.companyForm.get('cobrador')?.value;
    const companiaCode = this.companyForm.get('compania')?.value;

    if (!cobradorCode || !companiaCode) {
      if (!companiaCode) {
        this.toastService.showError('Debe seleccionar una compañía primero');
      }
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      return;
    }

    // Construir la URL para buscar el cobrador específico
    const url = `${environment.apiUrl}/GetLeaveCobrador?pcCompania=${companiaCode}&pcCobrador=${cobradorCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        // Verificar si hay datos en la respuesta
        if (response.dsRespuesta && response.dsRespuesta.tcccobrad && response.dsRespuesta.tcccobrad.length > 0) {
          const cobradorData = response.dsRespuesta.tcccobrad[0];

          // Verificar si hay errores en terrores
          if (cobradorData.terrores && cobradorData.terrores.length > 0) {
            const error = cobradorData.terrores[0];
            // Mostrar error si no se encontró el registro
            if (error.descripcion && error.descripcion.toLowerCase().includes('no encontró')) {
              this.toastService.showError(error.descripcion);
              return;
            }
          }

          // Verificar si realmente hay datos válidos (cobrador no vacío y nombre no vacío)
          if (cobradorData.cobrador && cobradorData['nombre-cobr'] && cobradorData['nombre-cobr'].trim() !== '') {
            // Procesar el cobrador solo si tiene datos válidos
            this.fillFormWithCobradorData(cobradorData);
          } else {
            // Si no hay datos válidos, mostrar error
            this.toastService.showError('No se encontraron datos válidos del cobrador');
          }
        } else {
          this.toastService.showError('No se encontraron datos del cobrador');
        }
      },
      error: (error) => {
        console.error('Error al buscar cobrador:', error);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private lookupClasificVenta(): void {
    const clasificVentaCode = this.companyForm.get('clasificVenta')?.value;
    const companiaCode = this.companyForm.get('compania')?.value;

    if (!clasificVentaCode || !companiaCode) {
      if (!companiaCode) {
        this.toastService.showError('Debe seleccionar una compañía primero');
      }
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      return;
    }

    // Construir la URL para buscar la clasificación de venta específica
    const url = `${environment.apiUrl}/GetLeaveClasifVenta?pcCompania=${companiaCode}&pcClaven=${clasificVentaCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        // Verificar si hay datos en la respuesta
        if (response.dsRespuesta && response.dsRespuesta.tccclaven && response.dsRespuesta.tccclaven.length > 0) {
          const clasifData = response.dsRespuesta.tccclaven[0];

          // Verificar si hay errores en terrores
          if (clasifData.terrores && clasifData.terrores.length > 0) {
            const error = clasifData.terrores[0];
            // Mostrar error si no se encontró el registro
            if (error.descripcion && error.descripcion.toLowerCase().includes('no encontró')) {
              this.toastService.showError(error.descripcion);
              return;
            }
          }

          // Verificar si realmente hay datos válidos (claven no vacío y nombre no vacío)
          if (clasifData.claven && clasifData['nombre-cven'] && clasifData['nombre-cven'].trim() !== '') {
            // Procesar la clasificación de venta solo si tiene datos válidos
            this.fillFormWithClasificVentaData(clasifData);
          } else {
            // Si no hay datos válidos, mostrar error
            this.toastService.showError('No se encontraron datos válidos de la clasificación de venta');
          }
        } else {
          this.toastService.showError('No se encontraron datos de la clasificación de venta');
        }
      },
      error: (error) => {
        console.error('Error al buscar clasificación de venta:', error);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private lookupClasifXCobro(): void {
    const clasifXCobroCode = this.companyForm.get('clasifXCobro')?.value;
    const companiaCode = this.companyForm.get('compania')?.value;

    if (!clasifXCobroCode || !companiaCode) {
      if (!companiaCode) {
        this.toastService.showError('Debe seleccionar una compañía primero');
      }
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      return;
    }

    // Construir la URL para buscar la clasificación por cobro específica
    const url = `${environment.apiUrl}/GetLeaveClasifCobro?pcCompania=${companiaCode}&pcClacob=${clasifXCobroCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        // Verificar si hay datos en la respuesta
        if (response.dsRespuesta && response.dsRespuesta.tccclacob && response.dsRespuesta.tccclacob.length > 0) {
          const clasifData = response.dsRespuesta.tccclacob[0];

          // Verificar si hay errores en terrores
          if (clasifData.terrores && clasifData.terrores.length > 0) {
            const error = clasifData.terrores[0];
            // Mostrar error si no se encontró el registro
            if (error.descripcion && error.descripcion.toLowerCase().includes('no encontró')) {
              this.toastService.showError(error.descripcion);
              return;
            }
          }

          // Verificar si realmente hay datos válidos (clacob no vacío y nombre no vacío)
          if (clasifData.clacob && clasifData['nombre-ccob'] && clasifData['nombre-ccob'].trim() !== '') {
            // Procesar la clasificación por cobro solo si tiene datos válidos
            this.fillFormWithClasifXCobroData(clasifData);
          } else {
            // Si no hay datos válidos, mostrar error
            this.toastService.showError('No se encontraron datos válidos de la clasificación por cobro');
          }
        } else {
          this.toastService.showError('No se encontraron datos de la clasificación por cobro');
        }
      },
      error: (error) => {
        console.error('Error al buscar clasificación por cobro:', error);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private lookupCausaSusp(): void {
    const causaSuspCode = this.companyForm.get('causaSusp')?.value;
    const companiaCode = this.companyForm.get('compania')?.value;

    if (!causaSuspCode || !companiaCode) {
      if (!companiaCode) {
        this.toastService.showError('Debe seleccionar una compañía primero');
      }
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      return;
    }

    // Construir la URL para buscar la causa de suspensión específica
    const url = `${environment.apiUrl}/GetLeaveCausaSusp?pcCompania=${companiaCode}&pcCausaSus=${causaSuspCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        // Verificar si hay datos en la respuesta
        if (response.dsRespuesta && response.dsRespuesta.tcccausus && response.dsRespuesta.tcccausus.length > 0) {
          const causaData = response.dsRespuesta.tcccausus[0];

          // Verificar si hay errores en terrores
          if (causaData.terrores && causaData.terrores.length > 0) {
            const error = causaData.terrores[0];
            // Mostrar error si no se encontró el registro
            if (error.descripcion && error.descripcion.toLowerCase().includes('no encontró')) {
              this.toastService.showError(error.descripcion);
              return;
            }
          }

          // Verificar si realmente hay datos válidos (causa-susp no vacío y nombre no vacío)
          if (causaData['causa-susp'] && causaData['nombre-caus'] && causaData['nombre-caus'].trim() !== '') {
            // Procesar la causa de suspensión solo si tiene datos válidos
            this.fillFormWithCausaSuspData(causaData);
          } else {
            // Si no hay datos válidos, mostrar error
            this.toastService.showError('No se encontraron datos válidos de la causa de suspensión');
          }
        } else {
          this.toastService.showError('No se encontraron datos de la causa de suspensión');
        }
      },
      error: (error) => {
        console.error('Error al buscar causa de suspensión:', error);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private lookupLosLineService(): void {
    const losLineServiceCode = this.companyForm.get('losLineService')?.value;
    const companiaCode = this.companyForm.get('compania')?.value;

    if (!losLineServiceCode || !companiaCode) {
      if (!companiaCode) {
        this.toastService.showError('Debe seleccionar una compañía primero');
      }
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      return;
    }

    // Construir la URL para buscar el LoS Line of Service específico
    const url = `${environment.apiUrl}/GetLeavecctabla1?pcCompania=${companiaCode}&pcCodigoC1=${losLineServiceCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        // Verificar si hay datos en la respuesta
        if (response.dsRespuesta && response.dsRespuesta.tcctabla1 && response.dsRespuesta.tcctabla1.length > 0) {
          const losData = response.dsRespuesta.tcctabla1[0];

          // Verificar si hay errores en terrores
          if (losData.terrores && losData.terrores.length > 0) {
            const error = losData.terrores[0];
            // Mostrar error si no se encontró el registro
            if (error.descripcion && error.descripcion.toLowerCase().includes('no encontró')) {
              this.toastService.showError(error.descripcion);
              return;
            }
          }

          // Verificar si realmente hay datos válidos (codigo-cob1 no vacío y nombre no vacío)
          if (losData['codigo-cob1'] && losData['nombre-cob1'] && losData['nombre-cob1'].trim() !== '') {
            // Procesar el LoS Line of Service solo si tiene datos válidos
            this.fillFormWithLosLineServiceData(losData);
          } else {
            // Si no hay datos válidos, mostrar error
            this.toastService.showError('No se encontraron datos válidos del LoS Line of Service');
          }
        } else {
          this.toastService.showError('No se encontraron datos del LoS Line of Service');
        }
      },
      error: (error) => {
        console.error('Error al buscar LoS Line of Service:', error);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private lookupSubLosSubLine(): void {
    const subLosSubLineCode = this.companyForm.get('subLosSubLine')?.value;
    const companiaCode = this.companyForm.get('compania')?.value;

    if (!subLosSubLineCode || !companiaCode) {
      if (!companiaCode) {
        this.toastService.showError('Debe seleccionar una compañía primero');
      }
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      return;
    }

    // Construir la URL para buscar el SubLoS SubLine of Service específico
    const url = `${environment.apiUrl}/GetLeavecctabla2?pcCompania=${companiaCode}&pcCodigoC2=${subLosSubLineCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        // Verificar si hay datos en la respuesta
        if (response.dsRespuesta && response.dsRespuesta.tcctabla2 && response.dsRespuesta.tcctabla2.length > 0) {
          const subLosData = response.dsRespuesta.tcctabla2[0];

          // Verificar si hay errores en terrores
          if (subLosData.terrores && subLosData.terrores.length > 0) {
            const error = subLosData.terrores[0];
            // Mostrar error si no se encontró el registro
            if (error.descripcion && error.descripcion.toLowerCase().includes('no encontró')) {
              this.toastService.showError(error.descripcion);
              return;
            }
          }

          // Verificar si realmente hay datos válidos (codigo-cob2 no vacío y nombre no vacío)
          if (subLosData['codigo-cob2'] && subLosData['nombre-cob2'] && subLosData['nombre-cob2'].trim() !== '') {
            // Procesar el SubLoS SubLine of Service solo si tiene datos válidos
            this.fillFormWithSubLosSubLineData(subLosData);
          } else {
            // Si no hay datos válidos, mostrar error
            this.toastService.showError('No se encontraron datos válidos del SubLoS SubLine of Service');
          }
        } else {
          this.toastService.showError('No se encontraron datos del SubLoS SubLine of Service');
        }
      },
      error: (error) => {
        console.error('Error al buscar SubLoS SubLine of Service:', error);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private lookupProductGroup(): void {
    const productGroupCode = this.companyForm.get('productGroup')?.value;
    const companiaCode = this.companyForm.get('compania')?.value;

    if (!productGroupCode || !companiaCode) {
      if (!companiaCode) {
        this.toastService.showError('Debe seleccionar una compañía primero');
      }
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      return;
    }

    // Construir la URL para buscar el Product Group específico
    const url = `${environment.apiUrl}/GetLeavecctabla3?pcCompania=${companiaCode}&pcCodigoC3=${productGroupCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        // Verificar si hay datos en la respuesta
        if (response.dsRespuesta && response.dsRespuesta.tcctabla3 && response.dsRespuesta.tcctabla3.length > 0) {
          const productGroupData = response.dsRespuesta.tcctabla3[0];

          // Verificar si hay errores en terrores
          if (productGroupData.terrores && productGroupData.terrores.length > 0) {
            const error = productGroupData.terrores[0];
            // Mostrar error si no se encontró el registro
            if (error.descripcion && error.descripcion.toLowerCase().includes('no encontró')) {
              this.toastService.showError(error.descripcion);
              return;
            }
          }

          // Verificar si realmente hay datos válidos (codigo-cob3 no vacío y nombre no vacío)
          if (productGroupData['codigo-cob3'] && productGroupData['nombre-cob3'] && productGroupData['nombre-cob3'].trim() !== '') {
            // Procesar el Product Group solo si tiene datos válidos
            this.fillFormWithProductGroupData(productGroupData);
          } else {
            // Si no hay datos válidos, mostrar error
            this.toastService.showError('No se encontraron datos válidos del Product Group');
          }
        } else {
          this.toastService.showError('No se encontraron datos del Product Group');
        }
      },
      error: (error) => {
        console.error('Error al buscar Product Group:', error);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private lookupAffinity(): void {
    const affinityCode = this.companyForm.get('affinity')?.value;
    const companiaCode = this.companyForm.get('compania')?.value;

    if (!affinityCode || !companiaCode) {
      if (!companiaCode) {
        this.toastService.showError('Debe seleccionar una compañía primero');
      }
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      return;
    }

    // Construir la URL para buscar el Affinity específico
    const url = `${environment.apiUrl}/GetLeavecctabla4?pcCompania=${companiaCode}&pcCodigoC4=${affinityCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        // Verificar si hay datos en la respuesta
        if (response.dsRespuesta && response.dsRespuesta.tcctabla4 && response.dsRespuesta.tcctabla4.length > 0) {
          const affinityData = response.dsRespuesta.tcctabla4[0];

          // Verificar si hay errores en terrores
          if (affinityData.terrores && affinityData.terrores.length > 0) {
            const error = affinityData.terrores[0];
            // Mostrar error si no se encontró el registro
            if (error.descripcion && error.descripcion.toLowerCase().includes('no encontró')) {
              this.toastService.showError(error.descripcion);
              return;
            }
          }

          // Verificar si realmente hay datos válidos (codigo-cob4 no vacío y nombre no vacío)
          if (affinityData['codigo-cob4'] && affinityData['nombre-cob4'] && affinityData['nombre-cob4'].trim() !== '') {
            // Procesar el Affinity solo si tiene datos válidos
            this.fillFormWithAffinityData(affinityData);
          } else {
            // Si no hay datos válidos, mostrar error
            this.toastService.showError('No se encontraron datos válidos del Affinity');
          }
        } else {
          this.toastService.showError('No se encontraron datos del Affinity');
        }
      },
      error: (error) => {
        console.error('Error al buscar Affinity:', error);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private lookupTransporte(): void {
    const transporteCode = this.companyForm.get('transporte')?.value;
    const companiaCode = this.companyForm.get('compania')?.value;

    if (!transporteCode || !companiaCode) {
      if (!companiaCode) {
        this.toastService.showError('Debe seleccionar una compañía primero');
      }
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      return;
    }

    // Construir la URL para buscar el Transporte específico
    const url = `${environment.apiUrl}/GetLeaveTransporte?pcCompania=${companiaCode}&pcTransporte=${transporteCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        // Verificar si hay datos en la respuesta
        if (response.dsRespuesta && response.dsRespuesta.tcctransp && response.dsRespuesta.tcctransp.length > 0) {
          const transporteData = response.dsRespuesta.tcctransp[0];

          // Verificar si hay errores en terrores
          if (transporteData.terrores && transporteData.terrores.length > 0) {
            const error = transporteData.terrores[0];
            // Mostrar error si no se encontró el registro
            if (error.descripcion && error.descripcion.toLowerCase().includes('no encontró')) {
              this.toastService.showError(error.descripcion);
              return;
            }
          }

          // Verificar si realmente hay datos válidos (transporte no vacío y nombre no vacío)
          if (transporteData.transporte && transporteData['nombre-tran'] && transporteData['nombre-tran'].trim() !== '') {
            // Procesar el Transporte solo si tiene datos válidos
            this.fillFormWithTransporteData(transporteData);
          } else {
            // Si no hay datos válidos, mostrar error
            this.toastService.showError('No se encontraron datos válidos del Transporte');
          }
        } else {
          this.toastService.showError('No se encontraron datos del Transporte');
        }
      },
      error: (error) => {
        console.error('Error al buscar Transporte:', error);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private lookupRuta(): void {
    const rutaCode = this.companyForm.get('ruta')?.value;
    const companiaCode = this.companyForm.get('compania')?.value;
    const transporteCode = this.companyForm.get('transporte')?.value;

    if (!rutaCode || !companiaCode || !transporteCode) {
      if (!companiaCode) {
        this.toastService.showError('Debe seleccionar una compañía primero');
      } else if (!transporteCode) {
        this.toastService.showError('Debe seleccionar un transporte primero');
      }
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      return;
    }

    // Construir la URL para buscar la Ruta específica
    const url = `${environment.apiUrl}/GetLeaveRuta?pcCompania=${companiaCode}&pcTransporte=${transporteCode}&pcRuta=${rutaCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        // Verificar si hay datos en la respuesta
        if (response.dsRespuesta && response.dsRespuesta.tccruta && response.dsRespuesta.tccruta.length > 0) {
          const rutaData = response.dsRespuesta.tccruta[0];

          // Verificar si hay errores en terrores
          if (rutaData.terrores && rutaData.terrores.length > 0) {
            const error = rutaData.terrores[0];
            // Mostrar error si no se encontró el registro
            if (error.descripcion && error.descripcion.toLowerCase().includes('no encontró')) {
              this.toastService.showError(error.descripcion);
              return;
            }
          }

          // Verificar si realmente hay datos válidos (ruta no vacío y nombre no vacío)
          if (rutaData.ruta && rutaData['nombre-rut'] && rutaData['nombre-rut'].trim() !== '') {
            // Procesar la Ruta solo si tiene datos válidos
            this.fillFormWithRutaData(rutaData);
          } else {
            // Si no hay datos válidos, mostrar error
            this.toastService.showError('No se encontraron datos válidos de la Ruta');
          }
        } else {
          this.toastService.showError('No se encontraron datos de la Ruta');
        }
      },
      error: (error) => {
        console.error('Error al buscar Ruta:', error);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private lookupSector(): void {
    const sectorCode = this.companyForm.get('sector')?.value;
    const companiaCode = this.companyForm.get('compania')?.value;
    const transporteCode = this.companyForm.get('transporte')?.value;
    const rutaCode = this.companyForm.get('ruta')?.value;

    if (!sectorCode || !companiaCode || !transporteCode || !rutaCode) {
      if (!companiaCode) {
        this.toastService.showError('Debe seleccionar una compañía primero');
      } else if (!transporteCode) {
        this.toastService.showError('Debe seleccionar un transporte primero');
      } else if (!rutaCode) {
        this.toastService.showError('Debe seleccionar una ruta primero');
      }
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      return;
    }

    // Construir la URL para buscar el Sector específico
    const url = `${environment.apiUrl}/GetLeaveSector?pcCompania=${companiaCode}&pcTransporte=${transporteCode}&pcRuta=${rutaCode}&pcSector=${sectorCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        // Verificar si hay datos en la respuesta
        if (response.dsRespuesta && response.dsRespuesta.tccsector && response.dsRespuesta.tccsector.length > 0) {
          const sectorData = response.dsRespuesta.tccsector[0];

          // Verificar si hay errores en terrores
          if (sectorData.terrores && sectorData.terrores.length > 0) {
            const error = sectorData.terrores[0];
            // Mostrar error si no se encontró el registro
            if (error.descripcion && error.descripcion.toLowerCase().includes('no encontró')) {
              this.toastService.showError(error.descripcion);
              return;
            }
          }

          // Verificar si realmente hay datos válidos (sector no vacío y nombre no vacío)
          if (sectorData.sector && sectorData['nombre-sect'] && sectorData['nombre-sect'].trim() !== '') {
            // Procesar el Sector solo si tiene datos válidos
            this.fillFormWithSectorData(sectorData);
          } else {
            // Si no hay datos válidos, mostrar error
            this.toastService.showError('No se encontraron datos válidos del Sector');
          }
        } else {
          this.toastService.showError('No se encontraron datos del Sector');
        }
      },
      error: (error) => {
        console.error('Error al buscar Sector:', error);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private lookupTipoCliente(): void {
    const tipoClienteCode = this.companyForm.get('tipoCliente')?.value;
    const companiaCode = this.companyForm.get('compania')?.value;

    if (!tipoClienteCode || !companiaCode) {
      if (!companiaCode) {
        this.toastService.showError('Debe seleccionar una compañía primero');
      }
      return;
    }

    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      return;
    }

    // Construir la URL para buscar el Tipo Cliente específico
    const url = `${environment.apiUrl}/GetLeaveTipoCliente?pcCompania=${companiaCode}&pcTipocli=${tipoClienteCode}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    this.http.get<any>(url).subscribe({
      next: (response) => {
        // Verificar si hay datos en la respuesta
        if (response.dsRespuesta && response.dsRespuesta.tcctipcli && response.dsRespuesta.tcctipcli.length > 0) {
          const tipoClienteData = response.dsRespuesta.tcctipcli[0];

          // Verificar si hay errores en terrores
          if (tipoClienteData.terrores && tipoClienteData.terrores.length > 0) {
            const error = tipoClienteData.terrores[0];
            // Mostrar error si no se encontró el registro
            if (error.descripcion && error.descripcion.toLowerCase().includes('no encontró')) {
              this.toastService.showError(error.descripcion);
              return;
            }
          }

          // Verificar si realmente hay datos válidos (tipocli no vacío y nombre no vacío)
          if (tipoClienteData.tipocli && tipoClienteData['nombre-tipc'] && tipoClienteData['nombre-tipc'].trim() !== '') {
            // Procesar el Tipo Cliente solo si tiene datos válidos
            this.fillFormWithTipoClienteData(tipoClienteData);
          } else {
            // Si no hay datos válidos, mostrar error
            this.toastService.showError('No se encontraron datos válidos del Tipo Cliente');
          }
        } else {
          this.toastService.showError('No se encontraron datos del Tipo Cliente');
        }
      },
      error: (error) => {
        console.error('Error al buscar Tipo Cliente:', error);
        this.toastService.showError('Error al conectar con el servidor');
      }
    });
  }

  private fillFormWithVendedorData(vendedor: any): void {
    if (vendedor) {
      const data = vendedor;

      // Actualizar solo el campo vendedor con el código
      this.companyForm.patchValue({
        vendedor: data.vendedor || ''
      });

      // Mostrar el nombre del vendedor debajo del input
      this.showVendedorName(data['nombre-vend'] || '');
    }
  }

  private showVendedorName(nombre: string): void {
    // Actualizar el signal con el nombre del vendedor
    this.vendedorName.set(nombre.trim());
  }

  private showCompaniaName(nombre: string): void {
    // Actualizar el signal con el nombre de la compañía
    this.companiaName.set(nombre.trim());
  }

  private showEmpresaName(nombre: string): void {
    // Actualizar el signal con el nombre de la empresa
    this.empresaName.set(nombre.trim());
  }

  private fillFormWithCondicionPagoData(condicionPago: any): void {
    if (condicionPago) {
      const data = condicionPago;


      // Actualizar solo el campo condicionPago con el código
      this.companyForm.patchValue({
        condicionPago: data.condpago || ''
      });

      // Mostrar el nombre de la condición de pago
      this.showCondicionPagoName(data['nombre-cpag'] || '');
    }
  }

  private showCondicionPagoName(nombre: string): void {
    // Actualizar el signal con el nombre de la condición de pago
    this.condicionPagoName.set(nombre.trim());
  }

  private fillFormWithNitData(nit: any): void {
    if (nit) {
      const data = nit;

      // Actualizar solo el campo nit con el código
      this.companyForm.patchValue({
        nit: data.nit || ''
      });

      // Mostrar el nombre del NIT
      this.showNitName(data['nombre-nit'] || '');
    }
  }

  private showNitName(nombre: string): void {
    // Actualizar el signal con el nombre del NIT
    this.nitName.set(nombre.trim());
  }

  private fillFormWithPaisData(pais: any): void {
    if (pais) {
      const data = pais;

      // Actualizar solo el campo pais con el código
      this.companyForm.patchValue({
        pais: data.pais || ''
      });

      // Mostrar el nombre del país
      this.showPaisName(data['nombre-pai'] || '');
    }
  }

  private showPaisName(nombre: string): void {
    // Actualizar el signal con el nombre del país
    this.paisName.set(nombre.trim());
  }

  private fillFormWithCiudadData(ciudad: any): void {
    if (ciudad) {
      const data = ciudad;

      // Actualizar solo el campo ciudad con el código
      this.companyForm.patchValue({
        ciudad: data.ciudad || ''
      });

      // Mostrar el nombre de la ciudad
      this.showCiudadName(data['nombre-ciu'] || '');
    }
  }

  private showCiudadName(nombre: string): void {
    // Actualizar el signal con el nombre de la ciudad
    this.ciudadName.set(nombre.trim());
  }

  private fillFormWithZonaData(zona: any): void {
    if (zona) {
      const data = zona;

      // Actualizar solo el campo zona con el código
      this.companyForm.patchValue({
        zona: data.zona || ''
      });

      // Mostrar el nombre de la zona
      this.showZonaName(data['nombre-zon'] || '');
    }
  }

  private showZonaName(nombre: string): void {
    // Actualizar el signal con el nombre de la zona
    this.zonaName.set(nombre.trim());
  }

  private fillFormWithLocalidadData(localidad: any): void {
    if (localidad) {
      const data = localidad;

      // Actualizar solo el campo localidad con el código
      this.companyForm.patchValue({
        localidad: data.localidad || ''
      });

      // Mostrar el nombre de la localidad
      this.showLocalidadName(data['nombre-loc'] || '');
    }
  }

  private showLocalidadName(nombre: string): void {
    // Actualizar el signal con el nombre de la localidad
    this.localidadName.set(nombre.trim());
  }

  private fillFormWithNegocioData(negocio: any): void {
    if (negocio) {
      const data = negocio;

      // Actualizar solo el campo negocio con el código
      this.companyForm.patchValue({
        negocio: data.negocio || ''
      });

      // Mostrar el nombre del negocio
      this.showNegocioName(data['nombre-neg'] || '');
    }
  }

  private showNegocioName(nombre: string): void {
    // Actualizar el signal con el nombre del negocio
    this.negocioName.set(nombre.trim());
  }

  private fillFormWithMonedaData(moneda: any): void {
    if (moneda) {
      const data = moneda;

      // Actualizar solo el campo moneda con el código
      this.companyForm.patchValue({
        moneda: data.moneda || ''
      });

      // Mostrar el nombre de la moneda
      this.showMonedaName(data['nombre-mon'] || '');
    }
  }

  private showMonedaName(nombre: string): void {
    // Actualizar el signal con el nombre de la moneda
    this.monedaName.set(nombre.trim());
  }

  private fillFormWithCobradorData(cobrador: any): void {
    if (cobrador) {
      const data = cobrador;

      // Actualizar solo el campo cobrador con el código
      this.companyForm.patchValue({
        cobrador: data.cobrador || ''
      });

      // Mostrar el nombre del cobrador
      this.showCobradorName(data['nombre-cobr'] || '');
    }
  }

  private showCobradorName(nombre: string): void {
    // Actualizar el signal con el nombre del cobrador
    this.cobradorName.set(nombre.trim());
  }

  private fillFormWithClasificVentaData(clasif: any): void {
    if (clasif) {
      const data = clasif;

      // Actualizar solo el campo clasificVenta con el código
      this.companyForm.patchValue({
        clasificVenta: data.claven || ''
      });

      // Mostrar el nombre de la clasificación de venta
      this.showClasificVentaName(data['nombre-cven'] || '');
    }
  }

  private showClasificVentaName(nombre: string): void {
    // Actualizar el signal con el nombre de la clasificación de venta
    this.clasificVentaName.set(nombre.trim());
  }

  private fillFormWithClasifXCobroData(clasif: any): void {
    if (clasif) {
      const data = clasif;

      // Actualizar solo el campo clasifXCobro con el código
      this.companyForm.patchValue({
        clasifXCobro: data.clacob || ''
      });

      // Mostrar el nombre de la clasificación por cobro
      this.showClasifXCobroName(data['nombre-ccob'] || '');
    }
  }

  private showClasifXCobroName(nombre: string): void {
    // Actualizar el signal con el nombre de la clasificación por cobro
    this.clasifXCobroName.set(nombre.trim());
  }

  private fillFormWithCausaSuspData(causa: any): void {
    if (causa) {
      const data = causa;

      // Actualizar solo el campo causaSusp con el código
      this.companyForm.patchValue({
        causaSusp: data['causa-susp'] || ''
      });

      // Mostrar el nombre de la causa de suspensión
      this.showCausaSuspName(data['nombre-caus'] || '');
    }
  }

  private showCausaSuspName(nombre: string): void {
    // Actualizar el signal con el nombre de la causa de suspensión
    this.causaSuspName.set(nombre.trim());
  }

  private fillFormWithLosLineServiceData(los: any): void {
    if (los) {
      const data = los;

      // Actualizar solo el campo losLineService con el código
      this.companyForm.patchValue({
        losLineService: data['codigo-cob1'] || ''
      });

      // Mostrar el nombre del LoS Line of Service
      this.showLosLineServiceName(data['nombre-cob1'] || '');
    }
  }

  private showLosLineServiceName(nombre: string): void {
    // Actualizar el signal con el nombre del LoS Line of Service
    this.losLineServiceName.set(nombre.trim());
  }

  private fillFormWithSubLosSubLineData(subLos: any): void {
    if (subLos) {
      const data = subLos;

      // Actualizar solo el campo subLosSubLine con el código
      this.companyForm.patchValue({
        subLosSubLine: data['codigo-cob2'] || ''
      });

      // Mostrar el nombre del SubLoS SubLine of Service
      this.showSubLosSubLineName(data['nombre-cob2'] || '');
    }
  }

  private showSubLosSubLineName(nombre: string): void {
    // Actualizar el signal con el nombre del SubLoS SubLine of Service
    this.subLosSubLineName.set(nombre.trim());
  }

  private fillFormWithProductGroupData(productGroup: any): void {
    if (productGroup) {
      const data = productGroup;

      // Actualizar solo el campo productGroup con el código
      this.companyForm.patchValue({
        productGroup: data['codigo-cob3'] || ''
      });

      // Mostrar el nombre del Product Group
      this.showProductGroupName(data['nombre-cob3'] || '');
    }
  }

  private showProductGroupName(nombre: string): void {
    // Actualizar el signal con el nombre del Product Group
    this.productGroupName.set(nombre.trim());
  }

  private fillFormWithAffinityData(affinity: any): void {
    if (affinity) {
      const data = affinity;

      // Actualizar solo el campo affinity con el código
      this.companyForm.patchValue({
        affinity: data['codigo-cob4'] || ''
      });

      // Mostrar el nombre del Affinity
      this.showAffinityName(data['nombre-cob4'] || '');
    }
  }

  private showAffinityName(nombre: string): void {
    // Actualizar el signal con el nombre del Affinity
    this.affinityName.set(nombre.trim());
  }

  private fillFormWithTransporteData(transporte: any): void {
    if (transporte) {
      const data = transporte;

      // Actualizar solo el campo transporte con el código
      this.companyForm.patchValue({
        transporte: data.transporte || ''
      });

      // Mostrar el nombre del Transporte
      this.showTransporteName(data['nombre-tran'] || '');
    }
  }

  private showTransporteName(nombre: string): void {
    // Actualizar el signal con el nombre del Transporte
    this.transporteName.set(nombre.trim());
  }

  private fillFormWithRutaData(ruta: any): void {
    if (ruta) {
      const data = ruta;

      // Actualizar solo el campo ruta con el código
      this.companyForm.patchValue({
        ruta: data.ruta || ''
      });

      // Mostrar el nombre de la Ruta
      this.showRutaName(data['nombre-rut'] || '');
    }
  }

  private showRutaName(nombre: string): void {
    // Actualizar el signal con el nombre de la Ruta
    this.rutaName.set(nombre.trim());
  }

  private fillFormWithSectorData(sector: any): void {
    if (sector) {
      const data = sector;

      // Actualizar solo el campo sector con el código
      this.companyForm.patchValue({
        sector: data.sector || ''
      });

      // Mostrar el nombre del Sector
      this.showSectorName(data['nombre-sect'] || '');
    }
  }

  private showSectorName(nombre: string): void {
    // Actualizar el signal con el nombre del Sector
    this.sectorName.set(nombre.trim());
  }

  private showTipoClienteName(nombre: string): void {
    // Actualizar el signal con el nombre del Tipo Cliente
    this.tipoClienteName.set(nombre.trim());
  }

  private fillFormWithTipoClienteData(tipoCliente: any): void {
    if (tipoCliente) {
      const data = tipoCliente;

      // Actualizar solo el campo tipoCliente con el código
      this.companyForm.patchValue({
        tipoCliente: data.tipocli || ''
      });

      // Mostrar el nombre del Tipo Cliente
      this.showTipoClienteName(data['nombre-tipc'] || '');
    }
  }

  private fillFormWithCompaniaData(compania: any): void {
    if (compania) {
      const data = compania;

      // Solo actualizar el campo de compañía y mostrar el nombre
      // NO llenar otros campos del formulario
      this.companyForm.patchValue({
        compania: data.cia || ''
      });

      // Mostrar el nombre de la compañía
      this.showCompaniaName(data['nombre-cia'] || '');
    }
  }

  private fillFormWithEmpresaData(empresa: any): void {
    if (empresa) {
      const data = empresa;

      // Mapear todos los campos disponibles usando los nombres correctos de la interfaz
      this.companyForm.patchValue({
        empresa: data.empresa || '',
        nombre: data['nombre-emp'] || '',
        vendedor: data.vendedor || '',
        condicionPago: data.condpago || '',
        direccion: data['direc-emp'] || '',
        telefonos: data['telefo-emp'] || '',
        fax: data['fax-emp'] || '',
        telex: data['telex-emp'] || '',
        zonaPostal: data['zonpos-emp'] || '',
        rif: data['rif-emp'] || '',
        nit: data.nit || '',
        diaCaja: data['diacaj-emp'] || '',
        fechaIngreso: data['fecing-emp'] || '',
        limite: data['limite-emp'] || '',
        descuento: data['pordes-emp'] || '',
        contactos: data['nomcon-emp'] || '',
        comentarios: data['text-emp'] || '',
        pais: data.pais || '',
        ciudad: data.ciudad || '',
        zona: data.zona || '',
        localidad: data.localidad || '',
        negocio: data.negocio || '',
        tipoCliente: data.tipocli || '',
        moneda: data.moneda || '',
        cobrador: data.cobrador || '',
        clasificVenta: data.claven || '',
        losLineService: data['codigo-cob1'] || '',
        subLosSubLine: data['codigo-cob2'] || '',
        productGroup: data['codigo-cob3'] || '',
        affinity: data['codigo-cob4'] || '',
        causaSusp: data['causa-susp'] || '',
        regMercan: data['regmer-emp'] || '',
        fechaRegistro: data['fecreg-emp'] || '',
        capitalPag: data['cappag-emp'] || '',
        capitalSusc: data['capsus-emp'] || '',
        nombreAbrev: data['abrenom-emp'] || '',
        rSocial: data['razsoc-emp'] || '',
        backOrder: data['bacord-emp'] || false,
        transporte: data.transporte || '',
        ruta: data.ruta || '',
        sector: data.sector || '',
        secuencia: data['secuen-emp'] || '',
        contribuye: data['contri-emp'] || '',
        direcEntrega: data['dirent-emp'] || '',
        correoElectr: data['email-emp'] || ''
      });

      // Procesar campos de factura electrónica desde los campos individuales
      setTimeout(() => {
        this.processFacturaElectronicaFieldsFromIndividual(data);
      }, 100);

      // Mostrar el nombre de la empresa
      this.showEmpresaName(data['nombre-emp'] || '');

      // Cargar automáticamente los nombres descriptivos de todos los campos
      this.loadAllFieldNamesAfterEmpresaSelection();
    }
  }

  private loadAllFieldNamesAfterEmpresaSelection(): void {
    // Cargar nombres descriptivos para todos los campos que tienen códigos
    const currentUser = this.authService.user();

    if (!currentUser) return;

    // Obtener valores del formulario
    const companiaCode = this.companyForm.get('compania')?.value;
    const vendedorCode = this.companyForm.get('vendedor')?.value;
    const condicionPagoCode = this.companyForm.get('condicionPago')?.value;
    const nitCode = this.companyForm.get('nit')?.value;
    const paisCode = this.companyForm.get('pais')?.value;
    const ciudadCode = this.companyForm.get('ciudad')?.value;
    const zonaCode = this.companyForm.get('zona')?.value;
    const localidadCode = this.companyForm.get('localidad')?.value;
    const negocioCode = this.companyForm.get('negocio')?.value;
    const monedaCode = this.companyForm.get('moneda')?.value;
    const cobradorCode = this.companyForm.get('cobrador')?.value;
    const clasificVentaCode = this.companyForm.get('clasificVenta')?.value;
    const clasifXCobroCode = this.companyForm.get('clasifXCobro')?.value;
    const causaSuspCode = this.companyForm.get('causaSusp')?.value;
    const losLineServiceCode = this.companyForm.get('losLineService')?.value;
    const subLosSubLineCode = this.companyForm.get('subLosSubLine')?.value;
    const productGroupCode = this.companyForm.get('productGroup')?.value;
    const affinityCode = this.companyForm.get('affinity')?.value;
    const transporteCode = this.companyForm.get('transporte')?.value;
    const rutaCode = this.companyForm.get('ruta')?.value;
    const sectorCode = this.companyForm.get('sector')?.value;
    const tipoClienteCode = this.companyForm.get('tipoCliente')?.value;

    // Limpiar nombres de campos vacíos
    if (!vendedorCode) this.vendedorName.set('');
    if (!condicionPagoCode) this.condicionPagoName.set('');
    if (!nitCode) this.nitName.set('');
    if (!paisCode) this.paisName.set('');
    if (!ciudadCode) this.ciudadName.set('');
    if (!zonaCode) this.zonaName.set('');
    if (!localidadCode) this.localidadName.set('');
    if (!negocioCode) this.negocioName.set('');
    if (!monedaCode) this.monedaName.set('');
    if (!cobradorCode) this.cobradorName.set('');
    if (!clasificVentaCode) this.clasificVentaName.set('');
    if (!clasifXCobroCode) this.clasifXCobroName.set('');
    if (!causaSuspCode) this.causaSuspName.set('');
    if (!losLineServiceCode) this.losLineServiceName.set('');
    if (!subLosSubLineCode) this.subLosSubLineName.set('');
    if (!productGroupCode) this.productGroupName.set('');
    if (!affinityCode) this.affinityName.set('');
    if (!transporteCode) this.transporteName.set('');
    if (!rutaCode) this.rutaName.set('');
    if (!sectorCode) this.sectorName.set('');
    if (!tipoClienteCode) this.tipoClienteName.set('');

    // Cargar nombres para campos que tienen códigos
    if (vendedorCode && companiaCode) {
      this.lookupVendedor();
    }
    if (condicionPagoCode && companiaCode) {
      this.lookupCondicionPago();
    }
    if (nitCode && companiaCode) {
      this.lookupNit();
    }
    if (paisCode) {
      this.lookupPais();
    }
    if (ciudadCode && paisCode) {
      this.lookupCiudad();
    }
    if (zonaCode && companiaCode) {
      this.lookupZona();
    }
    if (localidadCode && companiaCode) {
      this.lookupLocalidad();
    }
    if (negocioCode && companiaCode) {
      this.lookupNegocio();
    }
    if (monedaCode) {
      this.lookupMoneda();
    }
    if (cobradorCode && companiaCode) {
      this.lookupCobrador();
    }
    if (clasificVentaCode && companiaCode) {
      this.lookupClasificVenta();
    }
    if (clasifXCobroCode && companiaCode) {
      this.lookupClasifXCobro();
    }
    if (causaSuspCode && companiaCode) {
      this.lookupCausaSusp();
    }
    if (losLineServiceCode && companiaCode) {
      this.lookupLosLineService();
    }
    if (subLosSubLineCode && companiaCode) {
      this.lookupSubLosSubLine();
    }
    if (productGroupCode && companiaCode) {
      this.lookupProductGroup();
    }
    if (affinityCode && companiaCode) {
      this.lookupAffinity();
    }
    if (transporteCode && companiaCode) {
      this.lookupTransporte();
    }
    if (rutaCode && companiaCode && transporteCode) {
      this.lookupRuta();
    }
    if (sectorCode && companiaCode && transporteCode && rutaCode) {
      this.lookupSector();
    }
    if (tipoClienteCode && companiaCode) {
      this.lookupTipoCliente();
    }
  }

  private processFacturaElectronicaFieldsFromIndividual(data: any): void {

    const facturaElectronicaGroup = this.companyForm.get('facturaElectronica');
    if (!facturaElectronicaGroup) {
      return;
    }

    // Mapear los campos individuales del JSON
    const valoresParaAplicar = {
      agregaFact01: this.convertToBoolean(data['agrega-fact_01']), // 1
      agregaFact02: this.convertToBoolean(data['agrega-fact_02']), // 2
      agregaFact03: this.convertToBoolean(data['agrega-fact_03']), // 5
      agregaFact04: this.convertToBoolean(data['agrega-fact_04']), // 8
      agregaFact05: this.convertToBoolean(data['agrega-fact_05']), // 13
      agregaFact06: this.convertToBoolean(data['agrega-fact_06']), // 14
      agregaFact07: this.convertToBoolean(data['agrega-fact_07']), // 15
      agregaFact08: this.convertToBoolean(data['agrega-fact_08'])  // 16
    };


    // Aplicar los valores
    facturaElectronicaGroup.patchValue(valoresParaAplicar);

  }

  private convertToBoolean(value: string): boolean {
    if (!value || value.trim() === '') {
      return false; // Espacio o vacío = NO
    }

    const upperValue = value.toUpperCase();
    return upperValue === 'SI' || upperValue === 'S'; // SI o S = true
  }

  private processFacturaElectronicaFields(agregaEmpr: string): void {

    // Mapeo de posiciones en el string Agrega-Empr
    // agrega-fact_01 (1) -> posición 0
    // agrega-fact_02 (2) -> posición 1
    // agrega-fact_03 (5) -> posición 2
    // agrega-fact_04 (8) -> posición 3
    // agrega-fact_05 (13) -> posición 4
    // agrega-fact_06 (14) -> posición 5
    // agrega-fact_07 (15) -> posición 6
    // agrega-fact_08 (16) -> posición 7

    const facturaElectronicaGroup = this.companyForm.get('facturaElectronica');
    if (!facturaElectronicaGroup) {
      return;
    }

    // Extraer valores del string Agrega-Empr
    const valores = this.extractFacturaElectronicaValues(agregaEmpr);
    const valoresParaAplicar = {
      agregaFact01: valores[0], // 1
      agregaFact02: valores[1], // 2
      agregaFact03: valores[2], // 5
      agregaFact04: valores[3], // 8
      agregaFact05: valores[4], // 13
      agregaFact06: valores[5], // 14
      agregaFact07: valores[6], // 15
      agregaFact08: valores[7]  // 16
    };

    facturaElectronicaGroup.patchValue(valoresParaAplicar);
  }

  private extractFacturaElectronicaValues(agregaEmpr: string): boolean[] {

    // El string viene como: "                  0                                                                                                                                                    NOSI  sisiSI    "
    // Necesitamos tomar los últimos 16 caracteres: "NOSI  sisiSI    "
    // Luego procesar cada par de caracteres: "NO", "SI", "  ", "si", "si", "SI", "  ", "  "

    // Tomar los últimos 16 caracteres
    const relevantPart = agregaEmpr.slice(-16);

    const valores: boolean[] = [];

    // Procesar cada par de caracteres (8 pares de 2 caracteres cada uno)
    for (let i = 0; i < 8; i++) {
      const startPos = i * 2;
      const endPos = startPos + 2;
      const par = relevantPart.substring(startPos, endPos);
      // Si el par son dos espacios, es NO (false)
      // Si contiene 'S' o 's', es SI (true)
      const esTrue = par.trim() !== '' && (par.toUpperCase().includes('S'));
      valores.push(esTrue);
    }
    return valores;
  }

  onClear(): void {
    // Clear all form fields
    this.companyForm.reset();
    // Clear all field names to remove previous record names
    this.clearAllFieldNames();
    // Always go to section 1 when clearing
    this.currentSection.set(1);
  }

  onReport(): void {
    const currentUser = this.authService.user();

    if (!currentUser) {
      this.toastService.showError('No hay usuario autenticado');
      return;
    }

    // Obtener el código de compañía del formulario
    const companiaValue = this.companyForm.get('compania')?.value;

    if (!companiaValue) {
      this.toastService.showError('Por favor seleccione una compañía');
      return;
    }

    // Mostrar loading global
    this.loadingService.show('Generando reporte...');

    // Construir parámetros para la URL
    const params = {
      pcCompania: companiaValue,
      pcToken: currentUser.pcToken || ''
    };

    console.log('🔄 Generando reporte de maestros de clientes...', params);

    // Llamar al endpoint GetMaestroClientesT
    this.http.get<any>(`${environment.apiUrl}/GetMaestroClientesT`, { params })
      .subscribe({
        next: (response) => {
          console.log('✅ Respuesta del reporte recibida:', response);
          this.handleReportResponse(response);
          this.loadingService.hide();
        },
        error: (error) => {
          console.error('❌ Error al generar reporte:', error);
          this.toastService.showError('Error al generar el reporte');
          this.loadingService.hide();
        }
      });
  }

  private handleReportResponse(response: any): void {
    try {
      // Verificar si hay datos en la respuesta
      if (response.dsRespuesta && response.dsRespuesta.tccempres && response.dsRespuesta.tccempres.length > 0) {
        const empresa = response.dsRespuesta.tccempres[0];

        // Verificar si hay errores/terrores en la respuesta
        if (empresa.terrores && empresa.terrores.length > 0) {
          const mensaje = empresa.terrores[0].descripcion || 'Reporte generado exitosamente';
          this.toastService.showSuccess(mensaje);
        } else {
          this.toastService.showSuccess('Reporte generado exitosamente');
        }
      } else {
        this.toastService.showSuccess('Reporte generado exitosamente');
      }
    } catch (error) {
      console.error('Error al procesar respuesta del reporte:', error);
      this.toastService.showSuccess('Reporte generado exitosamente');
    }
  }

  private clearAllFieldNames(): void {
    // Limpiar todos los nombres de campos para evitar mostrar nombres de registros anteriores
    this.companiaName.set('');
    this.vendedorName.set('');
    this.empresaName.set('');
    this.condicionPagoName.set('');
    this.nitName.set('');
    this.paisName.set('');
    this.ciudadName.set('');
    this.zonaName.set('');
    this.localidadName.set('');
    this.negocioName.set('');
    this.monedaName.set('');
    this.cobradorName.set('');
    this.clasificVentaName.set('');
    this.clasifXCobroName.set('');
    this.causaSuspName.set('');
    this.losLineServiceName.set('');
    this.subLosSubLineName.set('');
    this.productGroupName.set('');
    this.affinityName.set('');
    this.transporteName.set('');
    this.rutaName.set('');
    this.sectorName.set('');
    this.tipoClienteName.set('');
  }

  // Helper methods for template
  getCompanyNombre(company: CompaniaItem | EmpresaItem | VendedorItem | CondicionPagoItem | NitItem): string {
    if (this.popupTitle().includes('Compañía')) {
      return (company as CompaniaItem).nombre;
    } else if (this.popupTitle().includes('Empresa')) {
      return (company as EmpresaItem).nombre; // nombre-emp
    } else if (this.popupTitle().includes('Vendedor')) {
      return (company as VendedorItem).nombre; // nombre-vend
    } else if (this.popupTitle().includes('Condición de Pago')) {
      return (company as CondicionPagoItem).nombre; // nombre-cpag
    } else if (this.popupTitle().includes('NIT')) {
      return (company as NitItem).nombre; // nombre-nit
    } else if (this.popupTitle().includes('País')) {
      return (company as any).nombre; // nombre-pai
    } else if (this.popupTitle().includes('Ciudad')) {
      return (company as any).nombre; // nombre-ciu
    } else if (this.popupTitle().includes('Zona')) {
      return (company as any).nombre; // nombre-zon
    } else if (this.popupTitle().includes('Localidad')) {
      return (company as any).nombre; // nombre-loc
    } else if (this.popupTitle().includes('Negocio')) {
      return (company as any).nombre; // nombre-neg
    } else if (this.popupTitle().includes('Moneda')) {
      return (company as any).nombre; // nombre-mon
    } else if (this.popupTitle().includes('Cobrador')) {
      return (company as any).nombre; // nombre-cobr
    } else if (this.popupTitle().includes('Clasificación Venta')) {
      return (company as any).nombre; // nombre-cven
    } else if (this.popupTitle().includes('Clasificación por Cobro')) {
      return (company as any).nombre; // nombre-ccob
    } else if (this.popupTitle().includes('Causa de Suspensión')) {
      return (company as any).nombre; // nombre-caus
    } else if (this.popupTitle().includes('LoS Line of Service')) {
      return (company as any).nombre; // nombre-cob1
    } else if (this.popupTitle().includes('SubLoS SubLine of Service')) {
      return (company as any).nombre; // nombre-cob2
    } else if (this.popupTitle().includes('Product Group')) {
      return (company as any).nombre; // nombre-cob3
    } else if (this.popupTitle().includes('Affinity')) {
      return (company as any).nombre; // nombre-cob4
    } else if (this.popupTitle().includes('Transporte')) {
      return (company as any).nombre; // nombre-tran
    } else if (this.popupTitle().includes('Ruta')) {
      return (company as any).nombre; // nombre-rut
    } else if (this.popupTitle().includes('Sector')) {
      return (company as any).nombre; // nombre-sect
    } else if (this.popupTitle().includes('Tipo Cliente')) {
      return (company as any).nombre; // nombre-tipc
    }
    return '';
  }

  getCompanyResponsable(company: CompaniaItem | EmpresaItem | VendedorItem | CondicionPagoItem | NitItem): string {
    if (this.popupTitle().includes('Compañía')) {
      return (company as CompaniaItem).responsable;
    } else if (this.popupTitle().includes('Empresa')) {
      return (company as EmpresaItem).nit; // NIT para empresas
    } else if (this.popupTitle().includes('Vendedor')) {
      return (company as VendedorItem).vendedorData['text-vend'] || ''; // text-vend para vendedores
    } else if (this.popupTitle().includes('Condición de Pago')) {
      return (company as CondicionPagoItem).condicionPagoData['diapla-cpag']?.toString() || ''; // diapla-cpag para condiciones de pago
    } else if (this.popupTitle().includes('NIT')) {
      return (company as any).nitData?.razsoc || ''; // razsoc para NITs
    } else if (this.popupTitle().includes('País')) {
      return (company as any).codigo; // código del país
    } else if (this.popupTitle().includes('Ciudad')) {
      return (company as any).codigo; // código de la ciudad
    } else if (this.popupTitle().includes('Zona')) {
      return (company as any).codigo; // código de la zona
    } else if (this.popupTitle().includes('Localidad')) {
      return (company as any).codigo; // código de la localidad
    } else if (this.popupTitle().includes('Negocio')) {
      return (company as any).codigo; // código del negocio
    } else if (this.popupTitle().includes('Moneda')) {
      return (company as any).codigo; // código de la moneda
    } else if (this.popupTitle().includes('Cobrador')) {
      return (company as any).codigo; // código del cobrador
    } else if (this.popupTitle().includes('Clasificación Venta')) {
      return (company as any).codigo; // código de la clasificación de venta
    } else if (this.popupTitle().includes('Clasificación por Cobro')) {
      return (company as any).codigo; // código de la clasificación por cobro
    } else if (this.popupTitle().includes('Causa de Suspensión')) {
      return (company as any).codigo; // código de la causa de suspensión
    } else if (this.popupTitle().includes('LoS Line of Service')) {
      return (company as any).codigo; // código del LoS Line of Service
    } else if (this.popupTitle().includes('SubLoS SubLine of Service')) {
      return (company as any).codigo; // código del SubLoS SubLine of Service
    } else if (this.popupTitle().includes('Product Group')) {
      return (company as any).codigo; // código del Product Group
    } else if (this.popupTitle().includes('Affinity')) {
      return (company as any).codigo; // código del Affinity
    } else if (this.popupTitle().includes('Transporte')) {
      return (company as any).codigo; // código del Transporte
    } else if (this.popupTitle().includes('Ruta')) {
      return (company as any).codigo; // código de la Ruta
    } else if (this.popupTitle().includes('Sector')) {
      return (company as any).codigo; // código del Sector
    } else if (this.popupTitle().includes('Tipo Cliente')) {
      return (company as any).codigo; // código del Tipo Cliente
    }
    return '';
  }

  getCompanyNit(company: CompaniaItem | EmpresaItem | VendedorItem | CondicionPagoItem | NitItem): string | number {
    if (this.popupTitle().includes('Compañía')) {
      return (company as CompaniaItem).nit;
    } else if (this.popupTitle().includes('Empresa')) {
      return (company as EmpresaItem).vendedor; // Vendedor para empresas
    } else if (this.popupTitle().includes('Vendedor')) {
      return (company as VendedorItem).vendedorData.tipvend || ''; // tipvend para vendedores
    } else if (this.popupTitle().includes('Condición de Pago')) {
      return (company as CondicionPagoItem).condicionPagoData['porini-cpag'] || ''; // porini-cpag para condiciones de pago
    } else if (this.popupTitle().includes('NIT')) {
      return (company as any).nitData?.['tipnit-nit'] || ''; // tipnit-nit para NITs
    } else if (this.popupTitle().includes('País')) {
      return (company as any).paisData?.['text-pai'] || ''; // text-pai para países
    } else if (this.popupTitle().includes('Ciudad')) {
      return (company as any).ciudadData?.['text-ciu'] || ''; // text-ciu para ciudades
    } else if (this.popupTitle().includes('Zona')) {
      return (company as any).zonaData?.['text-zon'] || ''; // text-zon para zonas
    } else if (this.popupTitle().includes('Localidad')) {
      return (company as any).localidadData?.['text-loc'] || ''; // text-loc para localidades
    } else if (this.popupTitle().includes('Negocio')) {
      return (company as any).negocioData?.['text-neg'] || ''; // text-neg para negocios
    } else if (this.popupTitle().includes('Moneda')) {
      return (company as any).monedaData?.['text-mon'] || ''; // text-mon para monedas
    } else if (this.popupTitle().includes('Cobrador')) {
      return (company as any).cobradorData?.['text-cobr'] || ''; // text-cobr para cobradores
    } else if (this.popupTitle().includes('Clasificación Venta')) {
      return (company as any).clasificVentaData?.['text-cven'] || ''; // text-cven para clasificaciones de venta
    } else if (this.popupTitle().includes('Clasificación por Cobro')) {
      return (company as any).clasifXCobroData?.['text-ccob'] || ''; // text-ccob para clasificaciones por cobro
    } else if (this.popupTitle().includes('Causa de Suspensión')) {
      return (company as any).causaSuspData?.['text-caus'] || ''; // text-caus para causas de suspensión
    } else if (this.popupTitle().includes('LoS Line of Service')) {
      return (company as any).losLineServiceData?.['text-cob1'] || ''; // text-cob1 para LoS Line of Services
    } else if (this.popupTitle().includes('SubLoS SubLine of Service')) {
      return (company as any).subLosSubLineData?.['text-cob2'] || ''; // text-cob2 para SubLoS SubLine of Services
    } else if (this.popupTitle().includes('Product Group')) {
      return (company as any).productGroupData?.['text-cob3'] || ''; // text-cob3 para Product Groups
    } else if (this.popupTitle().includes('Affinity')) {
      return (company as any).affinityData?.['text-cob4'] || ''; // text-cob4 para Affinities
    } else if (this.popupTitle().includes('Transporte')) {
      return (company as any).transporteData?.['text-tran'] || ''; // text-tran para Transportes
    } else if (this.popupTitle().includes('Ruta')) {
      return (company as any).rutaData?.['text-rut'] || ''; // text-rut para Rutas
    } else if (this.popupTitle().includes('Sector')) {
      return (company as any).sectorData?.['text-sect'] || ''; // text-sect para Sectores
    } else if (this.popupTitle().includes('Tipo Cliente')) {
      return (company as any).tipoClienteData?.['text-tipc'] || ''; // text-tipc para Tipo Clientes
    }
    return '';
  }

  // Section navigation methods
  nextSection(): void {
    if (this.currentSection() < 5) {
      this.currentSection.set(this.currentSection() + 1);
    }
  }

  previousSection(): void {
    if (this.currentSection() > 1) {
      this.currentSection.set(this.currentSection() - 1);
    }
  }

  getCurrentSectionTitle(): string {
    const titles = [
      'Información Básica de la Compañía',
      'Información Geográfica',
      'Información Comercial y Legal',
      'Información Logística',
      'Factura Electrónica'
    ];
    return titles[this.currentSection() - 1] || '';
  }
}

