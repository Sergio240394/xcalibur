import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CompaniesService, SearchItem } from '../../../core/services/companies.service';
import { EmpresasService } from '../../../core/services/empresas.service';
import { DocumentTypesService } from '../../../core/services/document-types.service';
import { VendedoresService, VendedorItem } from '../../../core/services/vendedores.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { LoadingService } from '../../../core/services/loading.service';
import { ModalService } from '../../../core/services/modal.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { CollapsibleSectionComponent } from '../../../shared/components/collapsible-section';
import { TabsComponent, TabItem } from '../../../shared/components/tabs';
import { CompaniasCxCService, CompaniaCxC, FechaPeriodoCxC, LoteCxC, EmpresaCxC, TipoDocCxC, DocumentoCxC, FechaEmisionCxC, FechaVencimientoCxC, AplicaDocCxC, MontoCxC, ApiResponse } from '../../../core/services/companias-cxc.service';
import { CuentasService, CuentaItem, CuentaResponse } from '../../../core/services/cuentas.service';
import { AuxiliaresService, AuxiliarItem, AuxiliarResponse } from '../../../core/services/auxiliares.service';
import { UbicacionesService, UbicacionItem, UbicacionResponse } from '../../../core/services/ubicaciones.service';
import { CentroCostosService, CentroCostoItem, CentroCostoResponse } from '../../../core/services/centro-costos.service';
import { FondosService, FondoItem, FondoResponse } from '../../../core/services/fondos.service';
import { MonedasService, MonedaItem } from '../../../core/services/monedas.service';
import { environment } from '../../../../environments/environment';

export interface TransactionLineItem {
  cuenta: string;
  referencia: string;
  descripcion: string;
  debeHaber: string;
  monto: number;
  montoOtra: number;
  cantidad: number;
  auxiliar: string;
  ubicacion: string;
  cCosto: string;
  uFondo: string;
}

@Component({
  selector: 'app-transaction-load',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule, IconComponent, CollapsibleSectionComponent, TabsComponent],
  templateUrl: './transaction-load.component.html',
  styleUrls: ['./transaction-load.component.css']
})
export class TransactionLoadComponent implements OnInit {
  transactionForm: FormGroup;
  showPopup = signal<boolean>(false);
  popupTitle = signal<string>('');
  searchTerm = signal<string>('');
  currentPopupType = signal<string>('');
  isLoading = signal<boolean>(false);

  // Current section state
  currentSection = signal<number>(1); // 1 = Sección 1, 2 = Sección 2

  // Tabs configuration
  tabs = signal<TabItem[]>([
    { id: '1', label: 'Cuentas por Cobrar', title: 'Cuentas por Cobrar' },
    { id: '2', label: 'Contabilidad', title: 'Contabilidad' }
  ]);

  // Field descriptions
  companiaDescription = signal<string>('');
  empresaDescription = signal<string>('');
  tipoDocDescription = signal<string>('');
  vendedorDescription = signal<string>('');
  documentoDescription = signal<string>('');
  aplicDocDescription = signal<string>('');
  monedaDescription = signal<string>('');
  cuentaDescription = signal<string>('');
  auxiliarDescription = signal<string>('');
  ubicacionDescription = signal<string>('');
  cCostoDescription = signal<string>('');
  uFondoDescription = signal<string>('');

  // Data arrays
  filteredItems = signal<(SearchItem | CompaniaCxC | EmpresaCxC | MonedaItem)[]>([]);
  allCompanies = signal<SearchItem[]>([]);
  allEmpresas = signal<SearchItem[]>([]);
  allDocumentTypes = signal<SearchItem[]>([]);
  allVendedores = signal<VendedorItem[]>([]);
  allDocumentos = signal<SearchItem[]>([]);
  allAplicDocs = signal<SearchItem[]>([]);
  allMonedas = signal<MonedaItem[]>([]);
  allCuentas = signal<SearchItem[]>([]);
  allAuxiliares = signal<SearchItem[]>([]);
  allUbicaciones = signal<SearchItem[]>([]);
  allCCostos = signal<SearchItem[]>([]);
  allUFondos = signal<SearchItem[]>([]);

  // Transaction line items
  lineItems = signal<TransactionLineItem[]>([]);

  // Compañías CxC
  allCompaniasCxC = signal<CompaniaCxC[]>([]);
  isLoadingCompanias = signal<boolean>(false);
  filteredCompaniasCxC = signal<CompaniaCxC[]>([]);

  // Lote data
  loteData = signal<LoteCxC[]>([]);

  // Contabilidad data (Sección 2)
  contabilidadData = signal<any[]>([]);
  isLoadingContabilidad = signal<boolean>(false);

  // Cuentas data
  cuentasData = signal<CuentaItem[]>([]);
  isLoadingCuentas = signal<boolean>(false);

  // Auxiliares data
  auxiliaresData = signal<AuxiliarItem[]>([]);
  isLoadingAuxiliares = signal<boolean>(false);

  // Ubicaciones data
  ubicacionesData = signal<UbicacionItem[]>([]);
  isLoadingUbicaciones = signal<boolean>(false);

  // Centro de costos data
  centrosCostoData = signal<CentroCostoItem[]>([]);
  isLoadingCentrosCosto = signal<boolean>(false);

  // Fondos data
  fondosData = signal<FondoItem[]>([]);
  isLoadingFondos = signal<boolean>(false);

  // Monedas data
  monedasData = signal<MonedaItem[]>([]);
  isLoadingMonedas = signal<boolean>(false);

  // Datos originales para restaurar después de filtrar
  originalCompaniasData = signal<CompaniaCxC[]>([]);
  originalEmpresasData = signal<EmpresaCxC[]>([]);
  originalTiposDocData = signal<TipoDocCxC[]>([]);
  originalDocumentosData = signal<DocumentoCxC[]>([]);
  originalCuentasData = signal<CuentaItem[]>([]);
  originalAuxiliaresData = signal<AuxiliarItem[]>([]);
  originalUbicacionesData = signal<UbicacionItem[]>([]);
  originalCentrosCostoData = signal<CentroCostoItem[]>([]);
  originalFondosData = signal<FondoItem[]>([]);

  isLoadingLote = signal<boolean>(false);

  // Fecha per loading
  isLoadingFecPer = signal<boolean>(false);

  // Empresas data
  allEmpresasCxC = signal<EmpresaCxC[]>([]);
  isLoadingEmpresas = signal<boolean>(false);
  filteredEmpresasCxC = signal<EmpresaCxC[]>([]);

  // Tipo Documento data
  allTiposDocCxC = signal<TipoDocCxC[]>([]);
  isLoadingTiposDoc = signal<boolean>(false);
  filteredTiposDocCxC = signal<TipoDocCxC[]>([]);

  // Documento data
  allDocumentosCxC = signal<DocumentoCxC[]>([]);
  isLoadingDocumentos = signal<boolean>(false);
  filteredDocumentosCxC = signal<DocumentoCxC[]>([]);

  // Fecha emision loading
  isLoadingFechaEmision = signal<boolean>(false);

  // Fecha vencimiento loading
  isLoadingFechaVencimiento = signal<boolean>(false);

  // Aplica doc loading
  isLoadingAplicaDoc = signal<boolean>(false);

  // Monto loading
  isLoadingMonto = signal<boolean>(false);

  // Totals
  totalDebe = signal<number>(0);
  totalHaber = signal<number>(0);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private companiesService: CompaniesService,
    private empresasService: EmpresasService,
    private documentTypesService: DocumentTypesService,
    private vendedoresService: VendedoresService,
    private authService: AuthService,
    private toastService: ToastService,
    private loadingService: LoadingService,
    private modalService: ModalService,
    private companiasCxCService: CompaniasCxCService,
    private cuentasService: CuentasService,
    private auxiliaresService: AuxiliaresService,
    private ubicacionesService: UbicacionesService,
    private centroCostosService: CentroCostosService,
    private fondosService: FondosService,
    private monedasService: MonedasService
  ) {
    this.transactionForm = this.fb.group({
      // Common fields (always visible)
      compania: ['', Validators.required],
      fechaPer: ['', Validators.required],
      lote: [''],

      // Section 1 fields
      empresa: ['', Validators.required],
      tipoDoc: ['', Validators.required],
      emision: ['', Validators.required],
      monto: [0],
      impuesto: [0],
      vendedor: [''],
      comentario: [''],
      documento: ['', Validators.required],
      referencia: [''],
      vencimiento: [''],
      aplicDoc: [''],
      mtoExtran: [0],
      moneda: [''],
      baseImp: [0],

      // Section 2 fields
      cuenta: ['', Validators.required],
      descripcion: [''],
      debeHaber: ['1'],
      montoLinea: [0],
      montoOtra: [0],
      cantidad: [0],
      auxiliar: [''],
      ubicacion: [''],
      cCosto: [''],
      uFondo: ['']
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    // Set default values
    this.transactionForm.patchValue({
      debeHaber: '1'
    });

    this.calculateTotals();
  }

  // Tab navigation method
  onTabChanged(tabId: string): void {
    this.currentSection.set(parseInt(tabId));
  }

  // Utility method to validate date format
  private isValidDateFormat(dateString: string): boolean {
    // Check if the date string matches YYYY-MM-DD format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) {
      return false;
    }

    // Check if it's a valid date
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  // Popup methods
  openPopup(type: string): void {
    this.currentPopupType.set(type);
    this.showPopup.set(true);
    this.searchTerm.set('');

    // Notificar al ModalService que un modal se abrió
    // Esto automáticamente cerrará el cargador global
    this.modalService.openModal();

    switch (type) {
      case 'compania':
        console.log('🔍 Abriendo popup de compañía');
        this.popupTitle.set('Seleccionar Compañía');
        this.loadCompaniasCxC();
        break;
      case 'empresa':
        this.popupTitle.set('Seleccionar Empresa');
        this.loadEmpresasCxC();
        break;
      case 'tipoDoc':
        this.popupTitle.set('Seleccionar Tipo de Documento');
        this.loadTiposDocCxC();
        break;
      case 'vendedor':
        this.popupTitle.set('Seleccionar Vendedor');
        this.loadVendedores();
        break;
      case 'documento':
        this.popupTitle.set('Seleccionar Documento');
        this.loadDocumentosCxC();
        break;
      case 'aplicDoc':
        this.popupTitle.set('Seleccionar Aplicación de Documento');
        this.loadAplicDocs();
        break;
      case 'moneda':
        this.popupTitle.set('Seleccionar Moneda');
        this.loadMonedas();
        break;
      case 'cuenta':
        this.popupTitle.set('Seleccionar Cuenta');
        this.loadCuentasCxC();
        break;
      case 'auxiliar':
        this.popupTitle.set('Seleccionar Auxiliar');
        this.loadAuxiliaresCxC();
        break;
      case 'ubicacion':
        this.popupTitle.set('Seleccionar Ubicación');
        this.loadUbicacionesCxC();
        break;
      case 'cCosto':
        this.popupTitle.set('Seleccionar Centro de Costo');
        this.loadCentrosCostoCxC();
        break;
      case 'uFondo':
        this.popupTitle.set('Seleccionar Unidad de Fondo');
        this.loadFondosCxC();
        break;
    }
  }

  closePopup(): void {
    this.showPopup.set(false);
    this.searchTerm.set('');
    this.currentPopupType.set('');

    // Notificar al ModalService que el modal se cerró
    this.modalService.closeModal();
  }

  selectItem(item: SearchItem | CompaniaCxC | EmpresaCxC | TipoDocCxC | DocumentoCxC | MonedaItem | CuentaItem | AuxiliarItem | UbicacionItem | CentroCostoItem | FondoItem): void {
    const popupType = this.currentPopupType();
    console.log('🎯 Item seleccionado:', { popupType, item });

    switch (popupType) {
      case 'compania':
        if ('cia' in item && 'nombre-cia' in item) {
          // Es un CompaniaCxC
          const companiaItem = item as CompaniaCxC;
          console.log('✅ Seleccionando CompaniaCxC:', {
            codigo: companiaItem.cia,
            nombre: companiaItem['nombre-cia'],
            nit: companiaItem.nit
          });
          this.transactionForm.patchValue({ compania: companiaItem.cia.toString() });
          this.companiaDescription.set(companiaItem['nombre-cia']);
        } else {
          // Es un SearchItem
          const searchItem = item as SearchItem;
          console.log('✅ Seleccionando SearchItem:', {
            codigo: searchItem.codigo,
            descripcion: searchItem.descripcion
          });
          this.transactionForm.patchValue({ compania: searchItem.codigo });
          this.companiaDescription.set(searchItem.descripcion);
        }
        break;
      case 'empresa':
        if ('empresa' in item && 'nombre-emp' in item) {
          // Es un EmpresaCxC
          const empresaItem = item as EmpresaCxC;
          this.transactionForm.patchValue({ empresa: empresaItem.empresa.toString() });
          this.empresaDescription.set(empresaItem['nombre-emp']);
        } else if ('codigo' in item) {
          // Es un SearchItem
          const searchItem = item as SearchItem;
          this.transactionForm.patchValue({ empresa: searchItem.codigo });
          this.empresaDescription.set(searchItem.descripcion);
        }
        break;
      case 'tipoDoc':
        if ('tipodoc' in item && 'nombre-tdoc' in item) {
          // Es un TipoDocCxC
          const tipoDocItem = item as TipoDocCxC;
          console.log('✅ Seleccionando TipoDocCxC:', {
            codigo: tipoDocItem.tipodoc,
            nombre: tipoDocItem['nombre-tdoc']
          });
          this.transactionForm.patchValue({ tipoDoc: tipoDocItem.tipodoc });
          this.tipoDocDescription.set(tipoDocItem['nombre-tdoc']);
        } else if ('codigo' in item) {
          // Es un SearchItem (fallback)
          this.transactionForm.patchValue({ tipoDoc: item.codigo });
          this.tipoDocDescription.set(item.descripcion);
        }
        break;
      case 'vendedor':
        if ('codigo' in item) {
          this.transactionForm.patchValue({ vendedor: item.codigo });
          this.vendedorDescription.set(item.descripcion);
        }
        break;
      case 'documento':
        if ('num-doc' in item && 'fecemi-doc' in item) {
          // Es un DocumentoCxC
          const documentoItem = item as DocumentoCxC;
          console.log('✅ Seleccionando DocumentoCxC:', {
            codigo: documentoItem['num-doc'],
            fecha: documentoItem['fecemi-doc']
          });
          this.transactionForm.patchValue({ documento: documentoItem['num-doc'] });
          this.documentoDescription.set(`Doc ${documentoItem['num-doc']} - ${documentoItem['fecemi-doc']}`);
        } else if ('codigo' in item) {
          // Es un SearchItem (fallback)
          this.transactionForm.patchValue({ documento: item.codigo });
          this.documentoDescription.set(item.descripcion);
        }
        break;
      case 'aplicDoc':
        if ('codigo' in item) {
          this.transactionForm.patchValue({ aplicDoc: item.codigo });
          this.aplicDocDescription.set(item.descripcion);
        }
        break;
      case 'moneda':
        if ('moneda' in item && 'nombre-mon' in item) {
          // Es un MonedaItem
          const monedaItem = item as MonedaItem;
          this.transactionForm.patchValue({ moneda: monedaItem.moneda.toString() });
          this.monedaDescription.set(monedaItem['nombre-mon']);
        }
        break;
      case 'cuenta':
        if ('cuenta' in item && 'nombre-cta' in item) {
          // Es un CuentaItem
          const cuentaItem = item as CuentaItem;
          console.log('✅ Seleccionando CuentaItem:', {
            codigo: cuentaItem.cuenta,
            nombre: cuentaItem['nombre-cta']
          });
          this.transactionForm.patchValue({ cuenta: cuentaItem.cuenta });
          this.cuentaDescription.set(cuentaItem['nombre-cta']);
        } else if ('codigo' in item) {
          // Es un SearchItem (fallback)
          this.transactionForm.patchValue({ cuenta: item.codigo });
          this.cuentaDescription.set(item.descripcion);
        }
        break;
      case 'auxiliar':
        if ('auxiliar' in item && 'nombre-aux' in item) {
          // Es un AuxiliarItem
          const auxiliarItem = item as AuxiliarItem;
          console.log('✅ Seleccionando AuxiliarItem:', {
            codigo: auxiliarItem.auxiliar,
            nombre: auxiliarItem['nombre-aux']
          });
          this.transactionForm.patchValue({ auxiliar: auxiliarItem.auxiliar.toString() });
          this.auxiliarDescription.set(auxiliarItem['nombre-aux']);
        } else if ('codigo' in item) {
          // Es un SearchItem (fallback)
          this.transactionForm.patchValue({ auxiliar: item.codigo });
          this.auxiliarDescription.set(item.descripcion);
        }
        break;
      case 'ubicacion':
        if ('ubicacion' in item && 'nombre-ubic' in item) {
          // Es un UbicacionItem
          const ubicacionItem = item as UbicacionItem;
          console.log('✅ Seleccionando UbicacionItem:', {
            codigo: ubicacionItem.ubicacion,
            nombre: ubicacionItem['nombre-ubic']
          });
          this.transactionForm.patchValue({ ubicacion: ubicacionItem.ubicacion.toString() });
          this.ubicacionDescription.set(ubicacionItem['nombre-ubic']);
        } else if ('codigo' in item) {
          // Es un SearchItem (fallback)
          this.transactionForm.patchValue({ ubicacion: item.codigo });
          this.ubicacionDescription.set(item.descripcion);
        }
        break;
      case 'cCosto':
        if ('centro' in item && 'nombre-cen' in item) {
          // Es un CentroCostoItem
          const centroCostoItem = item as CentroCostoItem;
          console.log('✅ Seleccionando CentroCostoItem:', {
            codigo: centroCostoItem.centro,
            nombre: centroCostoItem['nombre-cen']
          });
          this.transactionForm.patchValue({ cCosto: centroCostoItem.centro.toString() });
          this.cCostoDescription.set(centroCostoItem['nombre-cen']);
        } else if ('codigo' in item) {
          // Es un SearchItem (fallback)
          this.transactionForm.patchValue({ cCosto: item.codigo });
          this.cCostoDescription.set(item.descripcion);
        }
        break;
      case 'uFondo':
        if ('utilfon' in item && 'nombre-ufon' in item) {
          // Es un FondoItem
          const fondoItem = item as FondoItem;
          console.log('✅ Seleccionando FondoItem:', {
            codigo: fondoItem.utilfon,
            nombre: fondoItem['nombre-ufon']
          });
          this.transactionForm.patchValue({ uFondo: fondoItem.utilfon.toString() });
          this.uFondoDescription.set(fondoItem['nombre-ufon']);
        } else if ('codigo' in item) {
          // Es un SearchItem (fallback)
          this.transactionForm.patchValue({ uFondo: item.codigo });
          this.uFondoDescription.set(item.descripcion);
        }
        break;
    }

    this.closePopup();
  }

  // Método para seleccionar item de la tabla de contabilidad
  selectContabilidadItem(item: any): void {
    // Cargar datos en el formulario de la segunda sección
    this.transactionForm.patchValue({
      cuenta: item.cuenta || '',
      referencia: item['refere-com'] || '',
      descripcion: item['descri-com'] || '',
      auxiliar: item.auxiliar || '',
      ubicacion: item.ubicacion || '',
      cCosto: item.centro || '',
      uFondo: item.utilfon || '',
      montoLinea: item['debe-com'] || 0,
      montoOtra: item['monext-com'] || 0
    });

    // Determinar si es debe o haber basado en los montos
    const debeAmount = parseFloat(item['debe-com']) || 0;
    const haberAmount = parseFloat(item['haber-com']) || 0;

    if (debeAmount > 0) {
      this.transactionForm.patchValue({ debeHaber: '1' }); // Debe
    } else if (haberAmount > 0) {
      this.transactionForm.patchValue({ debeHaber: '2' }); // Haber
    }

    // Cargar descripciones (si están disponibles)
    if (item['nombre-cta']) {
      this.cuentaDescription.set(item['nombre-cta']);
    }
    if (item['nombre-aux']) {
      this.auxiliarDescription.set(item['nombre-aux']);
    }
    if (item['nombre-ubic']) {
      this.ubicacionDescription.set(item['nombre-ubic']);
    }
    if (item['nombre-cen']) {
      this.cCostoDescription.set(item['nombre-cen']);
    }
    if (item['nombre-ufon']) {
      this.uFondoDescription.set(item['nombre-ufon']);
    }
  }

  // Line item methods
  addLineItem(): void {
    const formValue = this.transactionForm.value;

    if (!formValue.cuenta) {
      this.toastService.showWarning('Debe seleccionar una cuenta');
      return;
    }

    const newItem: TransactionLineItem = {
      cuenta: formValue.cuenta,
      referencia: formValue.referencia || '',
      descripcion: formValue.descripcion || '',
      debeHaber: formValue.debeHaber || '1',
      monto: formValue.montoLinea || 0,
      montoOtra: formValue.montoOtra || 0,
      cantidad: formValue.cantidad || 0,
      auxiliar: formValue.auxiliar || '',
      ubicacion: formValue.ubicacion || '',
      cCosto: formValue.cCosto || '',
      uFondo: formValue.uFondo || ''
    };

    this.lineItems.set([...this.lineItems(), newItem]);
    this.calculateTotals();
    this.clearLineItemForm();
  }

  removeLineItem(index: number): void {
    const items = this.lineItems();
    items.splice(index, 1);
    this.lineItems.set([...items]);
    this.calculateTotals();
  }

  clearLineItemForm(): void {
    this.transactionForm.patchValue({
      cuenta: '',
      referencia: '',
      descripcion: '',
      debeHaber: '1',
      montoLinea: 0,
      montoOtra: 0,
      cantidad: 0,
      auxiliar: '',
      ubicacion: '',
      cCosto: '',
      uFondo: ''
    });

    this.cuentaDescription.set('');
    this.auxiliarDescription.set('');
    this.ubicacionDescription.set('');
    this.cCostoDescription.set('');
    this.uFondoDescription.set('');
  }

  private calculateTotals(): void {
    const items = this.lineItems();
    let totalDebe = 0;
    let totalHaber = 0;

    items.forEach(item => {
      if (item.debeHaber === '1') {
        totalDebe += item.monto;
      } else {
        totalHaber += item.monto;
      }
    });

    this.totalDebe.set(totalDebe);
    this.totalHaber.set(totalHaber);
  }

  // Form actions
  onSubmit(): void {
    console.log('🔍 === VALIDACIÓN DEL FORMULARIO ===');
    console.log('📋 Formulario válido:', this.transactionForm.valid);
    console.log('📋 Valores del formulario:', this.transactionForm.value);
    console.log('📋 Estado de los controles:', this.getFormControlStatus());

    // Validar solo los campos de la sección actual
    if (this.isCurrentSectionValid()) {
      this.saveTransaction();
    } else {
      console.log('❌ Campos con errores en la sección actual:', this.getCurrentSectionErrors());
      this.markCurrentSectionTouched();
      this.toastService.showError('Por favor complete todos los campos requeridos de la sección actual');
    }
  }

  /**
   * Guarda la transacción llamando al API UpdateCTCxC
   */
  private saveTransaction(): void {
    // Obtener datos del usuario actual
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      this.toastService.showError('No se pudo obtener la información del usuario actual');
      return;
    }

    // Construir el JSON según la especificación
    const transactionData = this.buildTransactionData();

    // Log específico para endpoint de sección 1
    const endpoint = `${environment.apiUrl}/UpdateCTCxC?pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;
    console.log('ENDPOINT LOTE SECCION 1:', endpoint);
    console.log('JSON ENVIADO SECCION 1:', JSON.stringify(transactionData, null, 2));

    // Mostrar loading global
    this.loadingService.show('Guardando transacciones...');
    this.isLoading.set(true);

    this.companiasCxCService.updateCTCxC(
      transactionData,
      currentUser.pcLogin || '',
      currentUser.pcToken || '',
      currentUser.pcSuper || ''
    ).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.loadingService.hide();
        this.handleSaveResponse(response);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.loadingService.hide();
        this.toastService.showError('Error al guardar la transacción');
      }
    });
  }

  /**
   * Construye los datos de la transacción según la especificación del API
   */
  private buildTransactionData(): any {
    const formValue = this.transactionForm.value;
    const currentUser = this.authService.user();

    return {
      tcchistor: [
        {
          agencia: 0,
          "Agrega-Hist": "",
          "apldoc-his": formValue.aplicDoc || 0,
          "autret-his": 0.00,
          "basiva-his": formValue.baseImp || 0.0000,
          cia: formValue.compania || 0,
          "nombre-cia": "",
          cobrador: 1,
          "coddes-his": 0,
          "codigo-cob1": 1,
          "codigo-cob2": 1,
          "codigo-cob3": 1,
          "codigo-cob4": 2,
          "codigo-cob5": 0,
          "codrec-his": 0,
          "codret-his": 0,
          "costo-his": 0.00,
          "cuenta-his": "",
          "date-ctrl": "2025-01-01",
          "desiva-his": formValue.impuesto || 0.0000,
          empresa: formValue.empresa || 0,
          "nombre-emp": "",
          "estado-his": false,
          "fecmov-his": formValue.emision || "",
          "fecperi-his": formValue.fechaPer || "",
          "fecven-his": formValue.vencimiento || "",
          "login-ctrl": currentUser?.pcLogin || "",
          "lote-his": formValue.lote || 0,
          "mondes-his": 0.00,
          Moneda: formValue.moneda || 0,
          "monext-his": 0.0000,
          "monica-his": 0.00,
          "monrec-his": 0.00,
          "monret-his": 0.00,
          "monto-his": formValue.monto || 0.0000,
          "numdoc-his": formValue.documento || 0,
          "numrec-his": 0,
          "proced-his": "T",
          produc: 0,
          "refere-his": formValue.referencia || 0,
          "secuen-his": 36,
          "text-his": formValue.comentario || "",
          tipcomi: 0,
          tipoconce: 60,
          tipodoc: formValue.tipoDoc || 0,
          "nombre-tdoc": "",
          vendedor: formValue.vendedor || 0,
          "nombre-vend": "",
          ventel: 0,
          zona: 1,
          "monto-debe": formValue.monto || 0.0000,
          "monto-haber": formValue.monto || 0.0000,
          "monto-diferencia": 0.0000,
          tparent: currentUser?.pcLogin || ""
        }
      ]
    };
  }

  /**
   * Maneja la respuesta del guardado de la transacción
   */
  private handleSaveResponse(response: any): void {
    // Verificar si hay errores en la respuesta
    if (response.terrores && response.terrores.length > 0) {
      const error = response.terrores[0];
      this.toastService.showError(error.descripcion || 'Error al guardar la transacción');
      return;
    }

    // Si no hay errores, mostrar éxito y limpiar campos
      this.toastService.showSuccess('Transacción guardada exitosamente');
    console.log('Transacción guardada:', response);

    // Limpiar los campos de la sección 1
    this.clearSection1Fields();

    // Simular Enter en el input lote para recargar datos
    this.reloadLoteData();
  }

  /**
   * Limpia los campos de la sección 1 después del guardado
   */
  private clearSection1Fields(): void {
    console.log('🧹 Limpiando campos de la sección 1');

    this.transactionForm.patchValue({
      empresa: '',
      documento: '',
      tipoDoc: '',
      vendedor: '',
      comentario: '',
      referencia: '',
      aplicDoc: '',
      moneda: '',
      emision: '',
      vencimiento: '',
      monto: 0,
      impuesto: 0,
      mtoExtran: 0,
      baseImp: 0
    });

    // Limpiar las descripciones
    this.empresaDescription.set('');
    this.tipoDocDescription.set('');
    this.vendedorDescription.set('');
    this.documentoDescription.set('');
    this.aplicDocDescription.set('');
    this.monedaDescription.set('');

    console.log('✅ Campos de la sección 1 limpiados');
  }

  /**
   * Simula un Enter en el input lote para recargar los datos
   */
  private reloadLoteData(): void {
    console.log('🔄 Simulando Enter en input lote para recargar datos');

    // Verificar que tenemos los campos necesarios para la validación del lote
    const companiaValue = this.transactionForm.get('compania')?.value;
    const fecPerValue = this.transactionForm.get('fechaPer')?.value;
    const loteValue = this.transactionForm.get('lote')?.value;

    if (companiaValue && fecPerValue && loteValue) {
      console.log('✅ Campos necesarios disponibles, ejecutando validación de lote');
      this.validateLote();
    } else {
      console.log('⚠️ Faltan campos necesarios para recargar lote:', {
        compania: companiaValue,
        fechaPer: fecPerValue,
        lote: loteValue
      });
    }
  }

  onClear(): void {
    this.transactionForm.reset();
    this.lineItems.set([]);
    this.totalDebe.set(0);
    this.totalHaber.set(0);
    this.loteData.set([]);
    this.initializeForm();

    // Clear descriptions
    this.companiaDescription.set('');
    this.empresaDescription.set('');
    this.tipoDocDescription.set('');
    this.vendedorDescription.set('');
    this.documentoDescription.set('');
    this.aplicDocDescription.set('');
    this.monedaDescription.set('');
    this.cuentaDescription.set('');
    this.auxiliarDescription.set('');
    this.ubicacionDescription.set('');
    this.cCostoDescription.set('');
    this.uFondoDescription.set('');
  }

  onDelete(): void {
    this.toastService.showWarning('Funcionalidad de eliminación en desarrollo');
  }

  onPrint(): void {
    this.toastService.showInfo('Funcionalidad de impresión en desarrollo');
  }

  private markFormGroupTouched(): void {
    Object.keys(this.transactionForm.controls).forEach(key => {
      const control = this.transactionForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Obtiene el estado de todos los controles del formulario
   */
  private getFormControlStatus(): any {
    const status: any = {};
    Object.keys(this.transactionForm.controls).forEach(key => {
      const control = this.transactionForm.get(key);
      status[key] = {
        value: control?.value,
        valid: control?.valid,
        invalid: control?.invalid,
        touched: control?.touched,
        dirty: control?.dirty,
        errors: control?.errors
      };
    });
    return status;
  }

  /**
   * Obtiene los errores de validación del formulario
   */
  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.transactionForm.controls).forEach(key => {
      const control = this.transactionForm.get(key);
      if (control && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  /**
   * Valida si la sección actual es válida
   */
  private isCurrentSectionValid(): boolean {
    const currentSection = this.currentSection();

    if (currentSection === 1) {
      // Sección 1: Solo validar campos de información general
      const section1Fields = ['compania', 'fechaPer', 'empresa', 'tipoDoc', 'emision', 'documento'];
      return section1Fields.every(field => {
        const control = this.transactionForm.get(field);
        return control && control.valid;
      });
    } else if (currentSection === 2) {
      // Sección 2: Validar campos de líneas de transacción
      const section2Fields = ['cuenta'];
      return section2Fields.every(field => {
        const control = this.transactionForm.get(field);
        return control && control.valid;
      });
    }

    return false;
  }

  /**
   * Obtiene los errores de la sección actual
   */
  private getCurrentSectionErrors(): any {
    const currentSection = this.currentSection();
    const errors: any = {};

    if (currentSection === 1) {
      // Sección 1: Solo campos de información general
      const section1Fields = ['compania', 'fechaPer', 'empresa', 'tipoDoc', 'emision', 'documento'];
      section1Fields.forEach(field => {
        const control = this.transactionForm.get(field);
        if (control && control.errors) {
          errors[field] = control.errors;
        }
      });
    } else if (currentSection === 2) {
      // Sección 2: Campos de líneas de transacción
      const section2Fields = ['cuenta'];
      section2Fields.forEach(field => {
        const control = this.transactionForm.get(field);
        if (control && control.errors) {
          errors[field] = control.errors;
        }
      });
    }

    return errors;
  }

  /**
   * Marca como tocados solo los campos de la sección actual
   */
  private markCurrentSectionTouched(): void {
    const currentSection = this.currentSection();

    if (currentSection === 1) {
      // Sección 1: Solo campos de información general
      const section1Fields = ['compania', 'fechaPer', 'empresa', 'tipoDoc', 'emision', 'documento'];
      section1Fields.forEach(field => {
        const control = this.transactionForm.get(field);
        control?.markAsTouched();
      });
    } else if (currentSection === 2) {
      // Sección 2: Campos de líneas de transacción
      const section2Fields = ['cuenta'];
      section2Fields.forEach(field => {
        const control = this.transactionForm.get(field);
        control?.markAsTouched();
      });
    }
  }

  // Data loading methods
  private loadCompanies(): void {
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser || !currentUser.pcLogin || currentUser.pcSuper === undefined) {
      this.filteredItems.set([]);
      return;
    }

    this.isLoading.set(true);
    this.companiesService.getCompanies(currentUser.pcLogin, currentUser.pcSuper).subscribe({
      next: (companies) => {
        this.allCompanies.set(companies);
        this.filteredItems.set(companies);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading companies:', error);
        this.filteredItems.set([]);
        this.isLoading.set(false);
      }
    });
  }

  private loadEmpresas(): void {
    const currentUser = this.authService.user();
    const companiaValue = this.transactionForm.get('compania')?.value;

    if (!currentUser || !currentUser.pcLogin || currentUser.pcSuper === undefined || !companiaValue) {
      this.filteredItems.set([]);
      return;
    }

    this.isLoading.set(true);
    this.empresasService.getEmpresas(companiaValue, currentUser.pcLogin, currentUser.pcSuper, currentUser.pcToken || '').subscribe({
      next: (empresas) => {
        this.allEmpresas.set(empresas);
        this.filteredItems.set(empresas);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading empresas:', error);
        this.filteredItems.set([]);
        this.isLoading.set(false);
      }
    });
  }

  private loadDocumentTypes(): void {
    const currentUser = this.authService.user();
    const companiaValue = this.transactionForm.get('compania')?.value;

    if (!currentUser || !currentUser.pcToken || !companiaValue) {
      this.filteredItems.set([]);
      return;
    }

    this.isLoading.set(true);
    this.documentTypesService.getDocumentTypes(companiaValue, currentUser.pcToken).subscribe({
      next: (documentTypes) => {
        this.allDocumentTypes.set(documentTypes);
        this.filteredItems.set(documentTypes);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading document types:', error);
        this.filteredItems.set([]);
        this.isLoading.set(false);
      }
    });
  }

  private loadVendedores(): void {
    const currentUser = this.authService.user();
    const companiaValue = this.transactionForm.get('compania')?.value;

    if (!currentUser || !currentUser.pcToken || !currentUser.pcLogin || currentUser.pcSuper === undefined || !companiaValue) {
      this.filteredItems.set([]);
      return;
    }

    this.isLoading.set(true);
    this.vendedoresService.getVendedores(companiaValue, currentUser.pcLogin, currentUser.pcSuper, currentUser.pcToken).subscribe({
      next: (vendedores) => {
        this.allVendedores.set(vendedores);
        this.filteredItems.set(vendedores);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading vendedores:', error);
        this.filteredItems.set([]);
        this.isLoading.set(false);
      }
    });
  }

  // Placeholder methods for other data loading
  private loadDocumentos(): void {
    // TODO: Implement document loading
    this.filteredItems.set([]);
  }

  private loadAplicDocs(): void {
    // TODO: Implement application document loading
    this.filteredItems.set([]);
  }

  private loadCuentas(): void {
    // TODO: Implement account loading
    this.filteredItems.set([]);
  }

  private loadAuxiliares(): void {
    // TODO: Implement auxiliary loading
    this.filteredItems.set([]);
  }

  private loadUbicaciones(): void {
    // TODO: Implement location loading
    this.filteredItems.set([]);
  }

  private loadCCostos(): void {
    // TODO: Implement cost center loading
    this.filteredItems.set([]);
  }

  private loadUFondos(): void {
    // TODO: Implement fund unit loading
    this.filteredItems.set([]);
  }

  // Search method
  onSearch(): void {
    const popupType = this.currentPopupType();
    const searchTerm = this.searchTerm();

    // Si el término de búsqueda está vacío, restaurar datos originales
    if (!searchTerm || searchTerm.trim() === '') {
      this.onSearchClear();
      return;
    }

    // Buscar en los datos originales
    if (popupType === 'compania' && this.originalCompaniasData().length > 0) {
      const filtered = this.originalCompaniasData().filter(compania =>
        compania['nombre-cia'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        compania.cia.toString().includes(searchTerm) ||
        compania.nit.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('🔍 Búsqueda compañías:', { searchTerm, total: this.originalCompaniasData().length, filtered: filtered.length });
      this.filteredCompaniasCxC.set(filtered);
    } else if (popupType === 'empresa' && this.originalEmpresasData().length > 0) {
      const filtered = this.originalEmpresasData().filter(empresa =>
        empresa['nombre-emp'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        empresa.empresa.toString().includes(searchTerm) ||
        empresa.nit.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('🔍 Búsqueda empresas:', { searchTerm, total: this.originalEmpresasData().length, filtered: filtered.length });
      this.filteredEmpresasCxC.set(filtered);
    } else if (popupType === 'tipoDoc' && this.originalTiposDocData().length > 0) {
      const filtered = this.originalTiposDocData().filter(tipoDoc =>
        tipoDoc['nombre-tdoc'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        tipoDoc.tipodoc.toString().includes(searchTerm) ||
        tipoDoc['siglas-tdoc'].toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('🔍 Búsqueda tipos doc:', { searchTerm, total: this.originalTiposDocData().length, filtered: filtered.length });
      this.filteredTiposDocCxC.set(filtered);
    } else if (popupType === 'documento' && this.originalDocumentosData().length > 0) {
      const filtered = this.originalDocumentosData().filter(documento =>
        documento['num-doc'].toString().includes(searchTerm) ||
        documento['fecemi-doc'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        documento['fecven-doc'].toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('🔍 Búsqueda documentos:', { searchTerm, total: this.originalDocumentosData().length, filtered: filtered.length });
      this.filteredDocumentosCxC.set(filtered);
    } else if (popupType === 'vendedor' && this.allVendedores().length > 0) {
      const filtered = this.vendedoresService.filterVendedores(this.allVendedores(), searchTerm);
      this.filteredItems.set(filtered);
    } else if (popupType === 'cuenta' && this.originalCuentasData().length > 0) {
      const filtered = this.originalCuentasData().filter(cuenta =>
        cuenta.cuenta.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cuenta['nombre-cta'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        cuenta['clase-cta'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        cuenta['tipo-cta'].toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('🔍 Búsqueda cuentas:', { searchTerm, total: this.originalCuentasData().length, filtered: filtered.length });
      this.cuentasData.set(filtered);
    } else if (popupType === 'auxiliar' && this.originalAuxiliaresData().length > 0) {
      const filtered = this.originalAuxiliaresData().filter(auxiliar =>
        auxiliar.auxiliar.toString().includes(searchTerm) ||
        auxiliar['nombre-aux'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        auxiliar.nit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auxiliar['text-aux'].toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('🔍 Búsqueda auxiliares:', { searchTerm, total: this.originalAuxiliaresData().length, filtered: filtered.length });
      this.auxiliaresData.set(filtered);
    } else if (popupType === 'ubicacion' && this.originalUbicacionesData().length > 0) {
      const filtered = this.originalUbicacionesData().filter(ubicacion =>
        ubicacion.ubicacion.toString().includes(searchTerm) ||
        ubicacion['nombre-ubic'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        ubicacion.zona.toString().includes(searchTerm) ||
        ubicacion['text-ubic'].toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('🔍 Búsqueda ubicaciones:', { searchTerm, total: this.originalUbicacionesData().length, filtered: filtered.length });
      this.ubicacionesData.set(filtered);
    } else if (popupType === 'cCosto' && this.originalCentrosCostoData().length > 0) {
      const filtered = this.originalCentrosCostoData().filter(centroCosto =>
        centroCosto.centro.toString().includes(searchTerm) ||
        centroCosto['nombre-cen'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        centroCosto.cia.toString().includes(searchTerm) ||
        centroCosto['text-cen'].toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('🔍 Búsqueda centros de costo:', { searchTerm, total: this.originalCentrosCostoData().length, filtered: filtered.length });
      this.centrosCostoData.set(filtered);
    } else if (popupType === 'uFondo' && this.originalFondosData().length > 0) {
      const filtered = this.originalFondosData().filter(fondo =>
        fondo.utilfon.toString().includes(searchTerm) ||
        fondo['nombre-ufon'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        fondo.cia.toString().includes(searchTerm) ||
        fondo['tipo-ufon'].toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('🔍 Búsqueda fondos:', { searchTerm, total: this.originalFondosData().length, filtered: filtered.length });
      this.fondosData.set(filtered);
    }
  }

  // Clear search method
  onSearchClear(): void {
    const popupType = this.currentPopupType();
    this.searchTerm.set('');

    // Restaurar datos originales sin hacer llamadas al API
    if (popupType === 'compania' && this.originalCompaniasData().length > 0) {
      this.filteredCompaniasCxC.set(this.originalCompaniasData());
    } else if (popupType === 'empresa' && this.originalEmpresasData().length > 0) {
      this.filteredEmpresasCxC.set(this.originalEmpresasData());
    } else if (popupType === 'tipoDoc' && this.originalTiposDocData().length > 0) {
      this.filteredTiposDocCxC.set(this.originalTiposDocData());
    } else if (popupType === 'documento' && this.originalDocumentosData().length > 0) {
      this.filteredDocumentosCxC.set(this.originalDocumentosData());
    } else if (popupType === 'cuenta' && this.originalCuentasData().length > 0) {
      this.cuentasData.set(this.originalCuentasData());
    } else if (popupType === 'auxiliar' && this.originalAuxiliaresData().length > 0) {
      this.auxiliaresData.set(this.originalAuxiliaresData());
    } else if (popupType === 'ubicacion' && this.originalUbicacionesData().length > 0) {
      this.ubicacionesData.set(this.originalUbicacionesData());
    } else if (popupType === 'cCosto' && this.originalCentrosCostoData().length > 0) {
      this.centrosCostoData.set(this.originalCentrosCostoData());
    } else if (popupType === 'uFondo' && this.originalFondosData().length > 0) {
      this.fondosData.set(this.originalFondosData());
    }
  }

  // Compañías CxC methods
  loadCompaniasCxC(): void {
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser || !currentUser.pcToken || !currentUser.pcLogin) {
      this.toastService.showError('Usuario no autenticado');
      return;
    }

    this.isLoadingCompanias.set(true);
    this.companiasCxCService.getCompanias(
      currentUser.pcLogin,
      pcSuper,
      currentUser.pcToken
    ).subscribe({
      next: (response: ApiResponse<CompaniaCxC>) => {
        console.log('🔍 Respuesta API GetCEGEciasCxC:', response);
        this.isLoadingCompanias.set(false);

        // Verificar si hay errores
        if (response.errores && response.errores.length > 0) {
          console.log('⚠️ Errores encontrados:', response.errores);
          const error = response.errores[0];
          if (error.descripcion && error.descripcion.includes('no encontró registro')) {
            console.log('❌ No se encontró registro:', error.descripcion);
            this.toastService.showError(error.descripcion);
            this.allCompaniasCxC.set([]);
            this.filteredCompaniasCxC.set([]);
            return;
          }
        }

        if (response.dsRespuesta && response.dsRespuesta['tgecias']) {
          const companias = response.dsRespuesta['tgecias'];
          console.log('📊 Compañías cargadas:', companias.length);
          this.allCompaniasCxC.set(companias);
          this.filteredCompaniasCxC.set(companias);
          this.originalCompaniasData.set(companias); // Guardar datos originales
        } else {
          console.log('⚠️ No se encontraron compañías en la respuesta');
          this.allCompaniasCxC.set([]);
          this.filteredCompaniasCxC.set([]);
          this.originalCompaniasData.set([]);
        }
      },
      error: (error) => {
        console.error('❌ Error loading compañías:', error);
        this.isLoadingCompanias.set(false);
        this.toastService.showError('Error al cargar las compañías');
        this.allCompaniasCxC.set([]);
        this.filteredCompaniasCxC.set([]);
      }
    });
  }

  // Empresas CxC methods
  loadEmpresasCxC(): void {
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);
    const companiaValue = this.transactionForm.get('compania')?.value;

    if (!currentUser || !currentUser.pcToken || !currentUser.pcLogin || !companiaValue) {
      this.toastService.showError('Usuario no autenticado o compañía no seleccionada');
      return;
    }

    this.isLoadingEmpresas.set(true);
    this.companiasCxCService.getEmpresas(
      companiaValue,
      currentUser.pcLogin,
      pcSuper,
      currentUser.pcToken
    ).subscribe({
      next: (response: ApiResponse<EmpresaCxC>) => {
        console.log('🔍 Respuesta API GetCEEmpresa:', response);
        this.isLoadingEmpresas.set(false);

        // Verificar si hay errores
        if (response.errores && response.errores.length > 0) {
          console.log('⚠️ Errores encontrados:', response.errores);
          const error = response.errores[0];
          if (error.descripcion && error.descripcion.includes('no encontró registro')) {
            console.log('❌ No se encontró registro:', error.descripcion);
            this.toastService.showError(error.descripcion);
            this.allEmpresasCxC.set([]);
            this.filteredEmpresasCxC.set([]);
            return;
          }
        }

        if (response.dsRespuesta && response.dsRespuesta['tccempres2']) {
          const empresas = response.dsRespuesta['tccempres2'];
          console.log('📊 Empresas cargadas:', empresas.length);
          this.allEmpresasCxC.set(empresas);
          this.filteredEmpresasCxC.set(empresas);
          this.originalEmpresasData.set(empresas); // Guardar datos originales
        } else {
          console.log('⚠️ No se encontraron empresas en la respuesta');
          this.allEmpresasCxC.set([]);
          this.filteredEmpresasCxC.set([]);
          this.originalEmpresasData.set([]);
        }
      },
      error: (error) => {
        console.error('❌ Error loading empresas:', error);
        this.isLoadingEmpresas.set(false);
        this.toastService.showError('Error al cargar las empresas');
        this.allEmpresasCxC.set([]);
        this.filteredEmpresasCxC.set([]);
      }
    });
  }

  validateCompaniaByCode(): void {
    // Evitar llamadas duplicadas si ya hay una validación en progreso
    if (this.isLoadingCompanias()) {
      console.log('⚠️ Validación de compañía ya en progreso, evitando llamada duplicada');
      return;
    }

    console.log('🔍 validateCompaniaByCode() - INICIO');
    const companiaValue = this.transactionForm.get('compania')?.value;
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!companiaValue || !currentUser || !currentUser.pcToken || !currentUser.pcLogin) {
      console.log('❌ Faltan datos requeridos - saliendo de validateCompaniaByCode');
      return;
    }

    // Console.log del endpoint y datos enviados
    const baseUrl = environment.apiUrl;
    const endpoint = '/GetLeaveGEciasCxC';
    const fullUrl = `${baseUrl}${endpoint}?pcCompania=${companiaValue}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    console.log('🌐 URL completa:', fullUrl);

    this.isLoadingCompanias.set(true);
    this.setCompaniaLoading(true);
    this.companiasCxCService.validateCompaniaByCode(
      companiaValue,
      currentUser.pcLogin,
      pcSuper,
      currentUser.pcToken
    ).subscribe({
      next: (response: ApiResponse<CompaniaCxC>) => {
        console.log('✅ Respuesta API GetLeaveGEciasCxC:', response);
        this.isLoadingCompanias.set(false);
        this.setCompaniaLoading(false);
        this.handleCompaniaValidationResponse(response);
      },
      error: (error) => {
        console.error('❌ Error validating compañía:', error);
        this.isLoadingCompanias.set(false);
        this.setCompaniaLoading(false);
        this.toastService.showError('Error al validar la compañía');
      }
    });
  }

  private handleCompaniaValidationResponse(response: ApiResponse<CompaniaCxC>): void {
    console.log('📋 Procesando respuesta de validación de compañía:', response);

    // Verificar si hay errores
    if (response.errores && response.errores.length > 0) {
      console.log('⚠️ Errores encontrados:', response.errores);
      const error = response.errores[0];
      if (error.descripcion && error.descripcion.includes('no encontró registro')) {
        console.log('❌ No se encontró registro:', error.descripcion);
        this.toastService.showError(error.descripcion);
        this.companiaDescription.set('');
        return;
      }
    }

    // Procesar datos exitosos
    if (response.dsRespuesta && response.dsRespuesta['tgecias']) {
      const data = response.dsRespuesta['tgecias'];
      console.log('📊 Datos encontrados:', { dataLength: data.length, data });

      if (data.length > 0) {
        const item = data[0];
        console.log('🎯 Compañía encontrada:', item);
        this.companiaDescription.set(item['nombre-cia']);
        console.log('✅ Compañía validada:', {
          codigo: item.cia,
          nombre: item['nombre-cia'],
          nit: item.nit
        });
      }
    } else {
      console.log('⚠️ No se encontraron datos en dsRespuesta:', response.dsRespuesta);
    }
  }

  private handleApiResponse(response: ApiResponse<any>, dataKey: string): void {
    console.log('📋 Procesando respuesta API:', { dataKey, response });

    // Verificar si hay errores
    if (response.errores && response.errores.length > 0) {
      console.log('⚠️ Errores encontrados:', response.errores);
      const error = response.errores[0];
      if (error.descripcion && error.descripcion.includes('no encontró registro')) {
        console.log('❌ No se encontró registro:', error.descripcion);
        this.toastService.showError(error.descripcion);
        this.companiaDescription.set('');
        return;
      }
    }

    // Procesar datos exitosos
    if (response.dsRespuesta && response.dsRespuesta[dataKey]) {
      const data = response.dsRespuesta[dataKey];
      console.log('📊 Datos encontrados:', { dataKey, dataLength: data.length, data });

      if (data.length > 0) {
        const item = data[0];
        console.log('🎯 Primer item:', item);

        if (dataKey === 'tgecias') {
          this.allCompaniasCxC.set(data);
          this.companiaDescription.set(item['nombre-cia']);
          console.log('✅ Compañía seleccionada:', {
            codigo: item.cia,
            nombre: item['nombre-cia'],
            nit: item.nit
          });
        }
      }
    } else {
      console.log('⚠️ No se encontraron datos en dsRespuesta:', response.dsRespuesta);
    }
  }

  onCompaniaKeyDown(event: Event): void {
    console.log('🎯 onCompaniaKeyDown() - MÉTODO LLAMADO');
    console.log('🚀 ENTER detectado - Ejecutando validación por Enter');
    console.log('📝 Valor actual del campo compañía:', this.transactionForm.get('compania')?.value);
    event.preventDefault(); // Prevent form submission
    this.validateCompaniaByCode();
  }

  // Métodos para manejar el estado disabled de los FormControls
  private setCompaniaLoading(loading: boolean): void {
    if (loading) {
      this.transactionForm.get('compania')?.disable();
    } else {
      this.transactionForm.get('compania')?.enable();
    }
  }

  private setFecPerLoading(loading: boolean): void {
    if (loading) {
      this.transactionForm.get('fechaPer')?.disable();
    } else {
      this.transactionForm.get('fechaPer')?.enable();
    }
  }

  private setLoteLoading(loading: boolean): void {
    if (loading) {
      this.transactionForm.get('lote')?.disable();
    } else {
      this.transactionForm.get('lote')?.enable();
    }
  }

  private setEmpresaLoading(loading: boolean): void {
    if (loading) {
      this.transactionForm.get('empresa')?.disable();
    } else {
      this.transactionForm.get('empresa')?.enable();
    }
  }

  private setTipoDocLoading(loading: boolean): void {
    if (loading) {
      this.transactionForm.get('tipoDoc')?.disable();
    } else {
      this.transactionForm.get('tipoDoc')?.enable();
    }
  }

  private setAplicaDocLoading(loading: boolean): void {
    if (loading) {
      this.transactionForm.get('aplicDoc')?.disable();
    } else {
      this.transactionForm.get('aplicDoc')?.enable();
    }
  }

  private setFechaEmisionLoading(loading: boolean): void {
    if (loading) {
      this.transactionForm.get('emision')?.disable();
    } else {
      this.transactionForm.get('emision')?.enable();
    }
  }

  private setFechaVencimientoLoading(loading: boolean): void {
    if (loading) {
      this.transactionForm.get('vencimiento')?.disable();
    } else {
      this.transactionForm.get('vencimiento')?.enable();
    }
  }

  private setMontoLoading(loading: boolean): void {
    if (loading) {
      this.transactionForm.get('monto')?.disable();
    } else {
      this.transactionForm.get('monto')?.enable();
    }
  }

  private setDocumentoLoading(loading: boolean): void {
    if (loading) {
      this.transactionForm.get('documento')?.disable();
    } else {
      this.transactionForm.get('documento')?.enable();
    }
  }


  onCompaniaBlur(): void {
    console.log('👁️ Campo compañía perdió el foco - ejecutando validación');
    this.validateCompaniaByCode();
  }

  validateFecPer(): void {
    // Evitar llamadas duplicadas si ya hay una validación en progreso
    if (this.isLoadingFecPer()) {
      console.log('⚠️ Validación de fecha per ya en progreso, evitando llamada duplicada');
      return;
    }

    const fecPerValue = this.transactionForm.get('fechaPer')?.value;
    const companiaValue = this.transactionForm.get('compania')?.value;
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!fecPerValue || !companiaValue || !currentUser || !currentUser.pcToken || !currentUser.pcLogin) {
      return;
    }

    // Console.log del endpoint y datos enviados
    const baseUrl = environment.apiUrl;
    const endpoint = '/GetLeaveFecPerCxC';
    const fullUrl = `${baseUrl}${endpoint}?pcCompania=${companiaValue}&pcFechaPeriodo=${fecPerValue}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    console.log('🌐 URL completa:', fullUrl);

    this.isLoadingFecPer.set(true);
    this.setFecPerLoading(true);
    this.companiasCxCService.validateFecPer(
      companiaValue,
      fecPerValue,
      currentUser.pcLogin,
      pcSuper,
      currentUser.pcToken
    ).subscribe({
      next: (response: ApiResponse<FechaPeriodoCxC>) => {
        console.log('✅ Respuesta API GetLeaveFecPerCxC:', response);
        this.isLoadingFecPer.set(false);
        this.setFecPerLoading(false);
        this.handleFecPerValidationResponse(response);
      },
      error: (error) => {
        console.error('❌ Error validating fecha per:', error);
        this.isLoadingFecPer.set(false);
        this.setFecPerLoading(false);
        this.toastService.showError('Error al validar la fecha de período');
      }
    });
  }

  private handleFecPerValidationResponse(response: ApiResponse<FechaPeriodoCxC>): void {
    console.log('📋 Procesando respuesta de validación de fecha per:', response);

    // Verificar si hay errores en la respuesta
    if (response.dsRespuesta && response.dsRespuesta['tFechaPeriodoCxC']) {
      const data = response.dsRespuesta['tFechaPeriodoCxC'];

      if (data.length > 0) {
        const item = data[0];
        console.log('🎯 Respuesta fecha per:', item);

        // Verificar si hay errores en el item
        if (item.terrores && item.terrores.length > 0) {
          console.log('⚠️ Errores encontrados en fecha per:', item.terrores);
          const error = item.terrores[0];
          console.log('❌ Error en fecha per:', error.descripcion);
          this.toastService.showError(error.descripcion);
          // Limpiar el campo fecha per
          this.transactionForm.patchValue({ fechaPer: '' });
          return;
        }

        // Si no hay errores, la validación fue exitosa
        console.log('✅ Fecha per validada exitosamente:', {
          cia: item.cia,
          nombreCia: item['nombre-cia'],
          fecperi: item['fecperi-his']
        });
      }
    } else {
      console.log('⚠️ No se encontraron datos en la respuesta de fecha per');
    }
  }

  onFecPerKeyDown(event: Event): void {
    console.log('🚀 Ejecutando validación de fecha per por Enter');
    event.preventDefault();
    this.validateFecPer();
  }

  onFecPerBlur(): void {
    console.log('👁️ Campo fecha per perdió el foco - validando fecha completa');
    const fechaValue = this.transactionForm.get('fechaPer')?.value;

    // Solo validar si la fecha está completa (formato YYYY-MM-DD)
    if (fechaValue && fechaValue.length === 10 && this.isValidDateFormat(fechaValue)) {
      console.log('📅 Fecha periodo completa detectada:', fechaValue);
      this.validateFecPer();
    } else {
      console.log('📅 Fecha periodo incompleta o inválida, saltando validación');
    }
  }


  validateLote(): void {
    // Evitar llamadas duplicadas si ya hay una validación en progreso
    if (this.isLoadingLote()) {
      console.log('⚠️ Validación de lote ya en progreso, evitando llamada duplicada');
      return;
    }

    const loteValue = this.transactionForm.get('lote')?.value;
    const companiaValue = this.transactionForm.get('compania')?.value;
    const fecPerValue = this.transactionForm.get('fechaPer')?.value;
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!loteValue || !companiaValue || !fecPerValue || !currentUser || !currentUser.pcToken || !currentUser.pcLogin) {
      return;
    }

    // Console.log del endpoint y datos enviados
    const baseUrl = environment.apiUrl;
    const endpoint = '/GetLeaveLoteCxC';
    const fullUrl = `${baseUrl}${endpoint}?pcCompania=${companiaValue}&pcFechaPer=${fecPerValue}&pcLote=${loteValue}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    console.log('🌐 URL completa:', fullUrl);

    this.isLoadingLote.set(true);
    this.setLoteLoading(true);
    this.companiasCxCService.validateLote(
      companiaValue,
      fecPerValue,
      loteValue,
      currentUser.pcLogin,
      pcSuper,
      currentUser.pcToken
    ).subscribe({
      next: (response: ApiResponse<LoteCxC>) => {
        console.log('✅ Respuesta API GetLeaveLoteCxC:', response);
        this.isLoadingLote.set(false);
        this.setLoteLoading(false);
        this.handleLoteValidationResponse(response);

        // Llamada adicional para obtener datos de contabilidad
        this.loadContabilidadData(companiaValue, fecPerValue, loteValue, currentUser);
      },
      error: (error) => {
        console.error('❌ Error validating lote:', error);
        this.isLoadingLote.set(false);
        this.setLoteLoading(false);
        this.toastService.showError('Error al validar el lote');
      }
    });
  }

  private handleLoteValidationResponse(response: ApiResponse<LoteCxC>): void {
    // Verificar si hay datos en la respuesta
    if (response.dsRespuesta && response.dsRespuesta['tcchistor'] && response.dsRespuesta['tcchistor'].length > 0) {
      const data = response.dsRespuesta['tcchistor'];
      this.loteData.set(data);
      console.log('DATOS TRAIDOS DE LOTE:', data);
    } else {
      this.loteData.set([]);
      this.toastService.showInfo('No se encontraron datos para el lote especificado');
    }
  }

  onLoteKeyDown(event: Event): void {
    console.log('🚀 Ejecutando validación de lote por Enter');
    event.preventDefault();
    this.validateLote();
  }

  onLoteBlur(): void {
    console.log('👁️ Campo lote perdió el foco - ejecutando validación');
    this.validateLote();
  }

  onCuentaKeyDown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();
      this.searchCuenta();
    }
  }

  onCuentaBlur(): void {
    this.searchCuenta();
  }

  private searchCuenta(): void {
    const cuentaValue = this.transactionForm.get('cuenta')?.value?.trim();
    if (!cuentaValue) {
      return;
    }

    const currentUser = this.authService.user();

    if (!currentUser) {
      this.toastService.showError('No se pudo obtener la información del usuario actual');
      return;
    }

    const companiaValue = this.transactionForm.get('compania')?.value;
    if (!companiaValue) {
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    console.log('🔍 === BUSCANDO CUENTA ===');
    console.log('📋 Cuenta:', cuentaValue);
    console.log('📋 Compañía:', companiaValue);

    this.cuentasService.getCuentaByCode(
      companiaValue.toString(),
      cuentaValue,
      currentUser.pcLogin || '',
      currentUser.pcSuper || '',
      currentUser.pcToken || ''
    ).subscribe({
      next: (response) => {
        console.log('✅ === RESPUESTA EXITOSA ===');
        console.log('📥 Respuesta del servidor:', response);
        this.handleCuentaSearchResponse(response);
      },
      error: (error) => {
        console.error('❌ === ERROR EN LA BÚSQUEDA ===');
        console.error('📥 Error completo:', error);
        this.toastService.showError('Error al buscar la cuenta');
        this.clearCuentaField();
      }
    });
  }

  private handleCuentaSearchResponse(response: CuentaResponse): void {
    console.log('📋 Procesando respuesta de búsqueda de cuenta:', response);

    // Verificar errores a nivel raíz
    if (response.terrores && response.terrores.length > 0) {
      const error = response.terrores[0];
      console.log('❌ Error en la respuesta (nivel raíz):', error);
      this.toastService.showError(error.descripcion || 'No se encontró la cuenta');
      this.clearCuentaField();
      return;
    }

    if (response.dsRespuesta && response.dsRespuesta.tcgcontab && response.dsRespuesta.tcgcontab.length > 0) {
      const cuentaData = response.dsRespuesta.tcgcontab[0];
      console.log('📋 Datos de cuenta recibidos:', cuentaData);

      // Verificar errores dentro del item de cuenta
      if (cuentaData.terrores && cuentaData.terrores.length > 0) {
        const error = cuentaData.terrores[0];
        console.log('❌ Error en el item de cuenta:', error);
        this.toastService.showError(error.descripcion || 'Error en la cuenta');
        this.clearCuentaField();
        return;
      }

      // Verificar si la cuenta tiene datos válidos
      if (!cuentaData.cuenta || cuentaData.cuenta.trim() === '') {
        console.log('⚠️ Cuenta vacía en la respuesta');
        this.toastService.showError('La cuenta no tiene datos válidos');
        this.clearCuentaField();
        return;
      }

      console.log('✅ Cuenta encontrada y válida:', cuentaData);
      this.populateCuentaData(cuentaData);
      this.toastService.showSuccess('Cuenta encontrada y cargada exitosamente');
    } else {
      console.log('⚠️ No se encontraron datos de cuenta');
      this.toastService.showError('No se encontró la cuenta');
      this.clearCuentaField();
    }
  }

  private populateCuentaData(cuentaData: CuentaItem): void {
    console.log('🔄 Cargando datos de cuenta al formulario:', cuentaData);

    // Actualizar el campo cuenta con el valor encontrado
    this.transactionForm.patchValue({
      cuenta: cuentaData.cuenta || ''
    });

    // Actualizar la descripción de la cuenta
    this.cuentaDescription.set(cuentaData['nombre-cta'] || '');

    console.log('✅ Datos de cuenta cargados en el formulario');
    console.log('📋 Cuenta:', cuentaData.cuenta);
    console.log('📋 Nombre:', cuentaData['nombre-cta']);
  }

  private clearCuentaField(): void {
    console.log('🧹 Limpiando campo de cuenta');
    this.transactionForm.patchValue({
      cuenta: ''
    });
    this.cuentaDescription.set('');
    console.log('✅ Campo de cuenta limpiado');
  }

  // Métodos para auxiliares
  onAuxiliarKeyDown(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();
      this.searchAuxiliar();
    }
  }

  onAuxiliarBlur(): void {
    this.searchAuxiliar();
  }

  private searchAuxiliar(): void {
    const auxiliarValue = this.transactionForm.get('auxiliar')?.value?.trim();
    if (!auxiliarValue) {
      return;
    }

    const currentUser = this.authService.user();
    if (!currentUser) {
      this.toastService.showError('No se pudo obtener la información del usuario actual');
      return;
    }

    const companiaValue = this.transactionForm.get('compania')?.value;
    if (!companiaValue) {
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    const cuentaValue = this.transactionForm.get('cuenta')?.value;
    if (!cuentaValue) {
      this.toastService.showError('Debe seleccionar una cuenta primero');
      return;
    }

    console.log('🔍 === BUSCANDO AUXILIAR ===');
    console.log('📋 Auxiliar:', auxiliarValue);
    console.log('📋 Compañía:', companiaValue);
    console.log('📋 Cuenta:', cuentaValue);

    this.auxiliaresService.getAuxiliarByCode(
      companiaValue.toString(),
      cuentaValue,
      auxiliarValue,
      currentUser.pcLogin || '',
      currentUser.pcSuper || '',
      currentUser.pcToken || ''
    ).subscribe({
      next: (response) => {
        console.log('✅ === RESPUESTA EXITOSA ===');
        console.log('📥 Respuesta del servidor:', response);
        this.handleAuxiliarSearchResponse(response);
      },
      error: (error) => {
        console.error('❌ === ERROR EN LA BÚSQUEDA ===');
        console.error('📥 Error completo:', error);
        this.toastService.showError('Error al buscar el auxiliar');
        this.clearAuxiliarField();
      }
    });
  }

  private handleAuxiliarSearchResponse(response: AuxiliarResponse): void {
    console.log('📋 Procesando respuesta de búsqueda de auxiliar:', response);

    // Verificar errores a nivel raíz
    if (response.terrores && response.terrores.length > 0) {
      const error = response.terrores[0];
      console.log('❌ Error en la respuesta (nivel raíz):', error);
      this.toastService.showError(error.descripcion || 'No se encontró el auxiliar');
      this.clearAuxiliarField();
      return;
    }

    if (response.dsRespuesta && response.dsRespuesta.tcgmaeaux && response.dsRespuesta.tcgmaeaux.length > 0) {
      const auxiliarData = response.dsRespuesta.tcgmaeaux[0];
      console.log('📋 Datos de auxiliar recibidos:', auxiliarData);

      // Verificar errores dentro del item de auxiliar
      if (auxiliarData.terrores && auxiliarData.terrores.length > 0) {
        const error = auxiliarData.terrores[0];
        console.log('❌ Error en el item de auxiliar:', error);
        this.toastService.showError(error.descripcion || 'Error en el auxiliar');
        this.clearAuxiliarField();
        return;
      }

      // Verificar si el auxiliar tiene datos válidos
      if (!auxiliarData.auxiliar || auxiliarData.auxiliar === 0) {
        console.log('⚠️ Auxiliar vacío en la respuesta');
        this.toastService.showError('El auxiliar no tiene datos válidos');
        this.clearAuxiliarField();
        return;
      }

      console.log('✅ Auxiliar encontrado y válido:', auxiliarData);
      this.populateAuxiliarData(auxiliarData);
      this.toastService.showSuccess('Auxiliar encontrado y cargado exitosamente');
    } else {
      console.log('⚠️ No se encontraron datos de auxiliar');
      this.toastService.showError('No se encontró el auxiliar');
      this.clearAuxiliarField();
    }
  }

  private populateAuxiliarData(auxiliarData: AuxiliarItem): void {
    console.log('🔄 Cargando datos de auxiliar al formulario:', auxiliarData);

    // Actualizar el campo auxiliar con el valor encontrado
    this.transactionForm.patchValue({
      auxiliar: auxiliarData.auxiliar.toString()
    });

    // Actualizar la descripción del auxiliar
    this.auxiliarDescription.set(auxiliarData['nombre-aux'] || '');

    console.log('✅ Datos de auxiliar cargados en el formulario');
    console.log('📋 Auxiliar:', auxiliarData.auxiliar);
    console.log('📋 Nombre:', auxiliarData['nombre-aux']);
  }

  private clearAuxiliarField(): void {
    console.log('🧹 Limpiando campo de auxiliar');
    this.transactionForm.patchValue({
      auxiliar: ''
    });
    this.auxiliarDescription.set('');
    console.log('✅ Campo de auxiliar limpiado');
  }

  // Métodos para ubicaciones
  onUbicacionKeyDown(event: Event): void {
    console.log('⌨️ === EVENTO KEYDOWN EN UBICACIÓN ===');
    const keyboardEvent = event as KeyboardEvent;
    console.log('⌨️ Tecla presionada:', keyboardEvent.key);
    console.log('⌨️ Es Enter?', keyboardEvent.key === 'Enter');

    if (keyboardEvent.key === 'Enter') {
      console.log('⌨️ Enter detectado, previniendo comportamiento por defecto');
      keyboardEvent.preventDefault();
      console.log('⌨️ Llamando a searchUbicacion()');
      this.searchUbicacion();
    }
  }

  onUbicacionBlur(): void {
    console.log('👁️ === EVENTO BLUR EN UBICACIÓN ===');
    console.log('👁️ Llamando a searchUbicacion()');
    this.searchUbicacion();
  }

  private searchUbicacion(): void {
    console.log('🔍 === INICIANDO searchUbicacion() ===');
    const ubicacionValue = this.transactionForm.get('ubicacion')?.value?.trim();
    console.log('🔍 Valor de ubicación obtenido:', ubicacionValue);

    if (!ubicacionValue) {
      console.log('⚠️ No hay valor de ubicación para buscar');
      return;
    }

    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    console.log('🔍 Usuario actual obtenido:', currentUser);
    if (!currentUser) {
      console.log('❌ No se pudo obtener el usuario actual');
      this.toastService.showError('No se pudo obtener la información del usuario actual');
      return;
    }

    const companiaValue = this.transactionForm.get('compania')?.value;
    console.log('🔍 Valor de compañía:', companiaValue);
    if (!companiaValue) {
      console.log('❌ No hay compañía seleccionada');
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    const cuentaValue = this.transactionForm.get('cuenta')?.value;
    console.log('🔍 Valor de cuenta:', cuentaValue);
    if (!cuentaValue) {
      console.log('❌ No hay cuenta seleccionada');
      this.toastService.showError('Debe seleccionar una cuenta primero');
      return;
    }

    // Construir URL manualmente para logging
    const baseUrl = environment.apiUrl;
    const fullUrl = `${baseUrl}/GetLeaveUbicacionCxC?pcCompania=${companiaValue}&pcCuentaC=${cuentaValue}&pcUbicacion=${ubicacionValue}&pcLogin=${currentUser.pcLogin || ''}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken || ''}`;

    console.log('🌐 === URL COMPLETA DEL ENDPOINT ===');
    console.log('🔗 URL:', fullUrl);
    console.log('🚀 === LLAMANDO AL SERVICIO UBICACIONES ===');

    this.ubicacionesService.getUbicacionByCode(
      companiaValue.toString(),
      cuentaValue,
      ubicacionValue,
      currentUser.pcLogin || '',
      currentUser.pcSuper || '',
      currentUser.pcToken || ''
    ).subscribe({
      next: (response) => {
        console.log('✅ === RESPUESTA EXITOSA DEL ENDPOINT UBICACIÓN ===');
        console.log('🔗 URL llamada:', fullUrl);
        console.log('📥 Respuesta completa del servidor:', JSON.stringify(response, null, 2));
        console.log('📊 Tipo de respuesta:', typeof response);
        console.log('📊 Es array?', Array.isArray(response));
        console.log('📊 Tiene dsRespuesta?', 'dsRespuesta' in response);
        console.log('📊 Tiene terrores?', 'terrores' in response);
        this.handleUbicacionSearchResponse(response);
      },
      error: (error) => {
        console.error('❌ === ERROR EN LA BÚSQUEDA DE UBICACIÓN ===');
        console.error('🔗 URL que falló:', fullUrl);
        console.error('📥 Error completo:', error);
        console.error('📥 Error status:', error.status);
        console.error('📥 Error message:', error.message);
        console.error('📥 Error body:', error.error);
        this.toastService.showError('Error al buscar la ubicación');
        this.clearUbicacionField();
      }
    });
  }

  private handleUbicacionSearchResponse(response: UbicacionResponse): void {
    console.log('📋 === PROCESANDO RESPUESTA DE UBICACIÓN ===');
    console.log('📥 Respuesta recibida:', response);
    console.log('📊 Estructura de la respuesta:');
    console.log('  - Tiene terrores?', response.terrores ? 'Sí' : 'No');
    console.log('  - Tiene dsRespuesta?', response.dsRespuesta ? 'Sí' : 'No');
    console.log('  - Tiene tcgubicac?', response.dsRespuesta?.tcgubicac ? 'Sí' : 'No');
    console.log('  - Cantidad de ubicaciones:', response.dsRespuesta?.tcgubicac?.length || 0);

    // Verificar errores a nivel raíz
    if (response.terrores && response.terrores.length > 0) {
      const error = response.terrores[0];
      console.log('❌ === ERROR EN LA RESPUESTA (NIVEL RAÍZ) ===');
      console.log('📥 Error completo:', error);
      console.log('📥 Código del error:', error.codigo);
      console.log('📥 Descripción del error:', error.descripcion);
      this.toastService.showError(error.descripcion || 'No se encontró la ubicación');
      this.clearUbicacionField();
      return;
    }

    if (response.dsRespuesta && response.dsRespuesta.tcgubicac && response.dsRespuesta.tcgubicac.length > 0) {
      const ubicacionData = response.dsRespuesta.tcgubicac[0];
      console.log('📋 === DATOS DE UBICACIÓN RECIBIDOS ===');
      console.log('📥 Ubicación data:', ubicacionData);
      console.log('📊 Campos de la ubicación:');
      console.log('  - ubicacion:', ubicacionData.ubicacion);
      console.log('  - nombre-ubic:', ubicacionData['nombre-ubic']);
      console.log('  - zona:', ubicacionData.zona);
      console.log('  - text-ubic:', ubicacionData['text-ubic']);
      console.log('  - tiene terrores?', ubicacionData.terrores ? 'Sí' : 'No');

      // Verificar errores dentro del item de ubicación
      if (ubicacionData.terrores && ubicacionData.terrores.length > 0) {
        const error = ubicacionData.terrores[0];
        console.log('❌ === ERROR EN EL ITEM DE UBICACIÓN ===');
        console.log('📥 Error completo:', error);
        console.log('📥 Código del error:', error.codigo);
        console.log('📥 Descripción del error:', error.descripcion);
        this.toastService.showError(error.descripcion || 'Error en la ubicación');
        this.clearUbicacionField();
        return;
      }

      // Verificar si la ubicación tiene datos válidos
      if (!ubicacionData.ubicacion || ubicacionData.ubicacion === 0) {
        console.log('⚠️ === UBICACIÓN VACÍA EN LA RESPUESTA ===');
        console.log('📥 Valor de ubicacion:', ubicacionData.ubicacion);
        this.toastService.showError('La ubicación no tiene datos válidos');
        this.clearUbicacionField();
        return;
      }

      console.log('✅ === UBICACIÓN ENCONTRADA Y VÁLIDA ===');
      console.log('📥 Datos finales:', ubicacionData);
      this.populateUbicacionData(ubicacionData);
      this.toastService.showSuccess('Ubicación encontrada y cargada exitosamente');
    } else {
      console.log('⚠️ === NO SE ENCONTRARON DATOS DE UBICACIÓN ===');
      console.log('📥 dsRespuesta existe?', !!response.dsRespuesta);
      console.log('📥 tcgubicac existe?', !!response.dsRespuesta?.tcgubicac);
      console.log('📥 tcgubicac es array?', Array.isArray(response.dsRespuesta?.tcgubicac));
      console.log('📥 tcgubicac length:', response.dsRespuesta?.tcgubicac?.length);
      this.toastService.showError('No se encontró la ubicación');
      this.clearUbicacionField();
    }
  }

  private populateUbicacionData(ubicacionData: UbicacionItem): void {
    console.log('🔄 === CARGANDO DATOS DE UBICACIÓN AL FORMULARIO ===');
    console.log('📥 Datos recibidos:', ubicacionData);

    // Actualizar el campo ubicación con el valor encontrado
    const ubicacionValue = ubicacionData.ubicacion.toString();
    console.log('📝 Actualizando campo ubicación con valor:', ubicacionValue);
    this.transactionForm.patchValue({
      ubicacion: ubicacionValue
    });

    // Actualizar la descripción de la ubicación
    const nombreUbicacion = ubicacionData['nombre-ubic'] || '';
    console.log('📝 Actualizando descripción con valor:', nombreUbicacion);
    this.ubicacionDescription.set(nombreUbicacion);

    console.log('✅ === DATOS DE UBICACIÓN CARGADOS EXITOSAMENTE ===');
    console.log('📋 Campo ubicación:', ubicacionValue);
    console.log('📋 Descripción:', nombreUbicacion);
    console.log('📋 Valor actual del formulario:', this.transactionForm.get('ubicacion')?.value);
    console.log('📋 Descripción actual:', this.ubicacionDescription());
  }

  private clearUbicacionField(): void {
    console.log('🧹 Limpiando campo de ubicación');
    this.transactionForm.patchValue({
      ubicacion: ''
    });
    this.ubicacionDescription.set('');
    console.log('✅ Campo de ubicación limpiado');
  }

  // Métodos para centro de costos
  onCCostoKeyDown(event: Event): void {
    console.log('⌨️ === EVENTO KEYDOWN EN CENTRO DE COSTO ===');
    const keyboardEvent = event as KeyboardEvent;
    console.log('⌨️ Tecla presionada:', keyboardEvent.key);
    console.log('⌨️ Es Enter?', keyboardEvent.key === 'Enter');

    if (keyboardEvent.key === 'Enter') {
      console.log('⌨️ Enter detectado, previniendo comportamiento por defecto');
      keyboardEvent.preventDefault();
      console.log('⌨️ Llamando a searchCCosto()');
      this.searchCCosto();
    }
  }

  onCCostoBlur(): void {
    console.log('👁️ === EVENTO BLUR EN CENTRO DE COSTO ===');
    console.log('👁️ Llamando a searchCCosto()');
    this.searchCCosto();
  }

  private searchCCosto(): void {
    console.log('🔍 === INICIANDO searchCCosto() ===');
    const cCostoValue = this.transactionForm.get('cCosto')?.value?.trim();
    console.log('🔍 Valor de centro de costo obtenido:', cCostoValue);

    if (!cCostoValue) {
      console.log('⚠️ No hay valor de centro de costo para buscar');
      return;
    }

    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    console.log('🔍 Usuario actual obtenido:', currentUser);
    if (!currentUser) {
      console.log('❌ No se pudo obtener el usuario actual');
      this.toastService.showError('No se pudo obtener la información del usuario actual');
      return;
    }

    const companiaValue = this.transactionForm.get('compania')?.value;
    console.log('🔍 Valor de compañía:', companiaValue);
    if (!companiaValue) {
      console.log('❌ No hay compañía seleccionada');
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    const cuentaValue = this.transactionForm.get('cuenta')?.value;
    console.log('🔍 Valor de cuenta:', cuentaValue);
    if (!cuentaValue) {
      console.log('❌ No hay cuenta seleccionada');
      this.toastService.showError('Debe seleccionar una cuenta primero');
      return;
    }

    // Construir URL manualmente para logging
    const baseUrl = environment.apiUrl;
    const fullUrl = `${baseUrl}/GetLeaveCentroCCxC?pcCompania=${companiaValue}&pcCuentaC=${cuentaValue}&pcCentro=${cCostoValue}&pcLogin=${currentUser.pcLogin || ''}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken || ''}`;

    console.log('🌐 === URL COMPLETA DEL ENDPOINT ===');
    console.log('🔗 URL:', fullUrl);
    console.log('🚀 === LLAMANDO AL SERVICIO CENTRO DE COSTOS ===');

    this.centroCostosService.getCentroCostoByCode(
      companiaValue.toString(),
      cuentaValue,
      cCostoValue,
      currentUser.pcLogin || '',
      currentUser.pcSuper || '',
      currentUser.pcToken || ''
    ).subscribe({
      next: (response) => {
        console.log('✅ === RESPUESTA EXITOSA DEL ENDPOINT CENTRO DE COSTO ===');
        console.log('🔗 URL llamada:', fullUrl);
        console.log('📥 Respuesta completa del servidor:', JSON.stringify(response, null, 2));
        console.log('📊 Tipo de respuesta:', typeof response);
        console.log('📊 Es array?', Array.isArray(response));
        console.log('📊 Tiene dsRespuesta?', 'dsRespuesta' in response);
        console.log('📊 Tiene terrores?', 'terrores' in response);
        this.handleCCostoSearchResponse(response);
      },
      error: (error) => {
        console.error('❌ === ERROR EN LA BÚSQUEDA DE CENTRO DE COSTO ===');
        console.error('🔗 URL que falló:', fullUrl);
        console.error('📥 Error completo:', error);
        console.error('📥 Error status:', error.status);
        console.error('📥 Error message:', error.message);
        console.error('📥 Error body:', error.error);
        this.toastService.showError('Error al buscar el centro de costo');
        this.clearCCostoField();
      }
    });
  }

  private handleCCostoSearchResponse(response: CentroCostoResponse): void {
    console.log('📋 === PROCESANDO RESPUESTA DE CENTRO DE COSTO ===');
    console.log('📥 Respuesta recibida:', response);
    console.log('📊 Estructura de la respuesta:');
    console.log('  - Tiene terrores?', response.terrores ? 'Sí' : 'No');
    console.log('  - Tiene dsRespuesta?', response.dsRespuesta ? 'Sí' : 'No');
    console.log('  - Tiene tgecencos?', response.dsRespuesta?.tgecencos ? 'Sí' : 'No');
    console.log('  - Cantidad de centros de costo:', response.dsRespuesta?.tgecencos?.length || 0);

    // Verificar errores a nivel raíz
    if (response.terrores && response.terrores.length > 0) {
      const error = response.terrores[0];
      console.log('❌ === ERROR EN LA RESPUESTA (NIVEL RAÍZ) ===');
      console.log('📥 Error completo:', error);
      console.log('📥 Código del error:', error.codigo);
      console.log('📥 Descripción del error:', error.descripcion);
      this.toastService.showError(error.descripcion || 'No se encontró el centro de costo');
      this.clearCCostoField();
      return;
    }

    if (response.dsRespuesta && response.dsRespuesta.tgecencos && response.dsRespuesta.tgecencos.length > 0) {
      const centroCostoData = response.dsRespuesta.tgecencos[0];
      console.log('📋 === DATOS DE CENTRO DE COSTO RECIBIDOS ===');
      console.log('📥 Centro de costo data:', centroCostoData);
      console.log('📊 Campos del centro de costo:');
      console.log('  - centro:', centroCostoData.centro);
      console.log('  - nombre-cen:', centroCostoData['nombre-cen']);
      console.log('  - cia:', centroCostoData.cia);
      console.log('  - text-cen:', centroCostoData['text-cen']);
      console.log('  - tiene terrores?', centroCostoData.terrores ? 'Sí' : 'No');

      // Verificar errores dentro del item de centro de costo
      if (centroCostoData.terrores && centroCostoData.terrores.length > 0) {
        const error = centroCostoData.terrores[0];
        console.log('❌ === ERROR EN EL ITEM DE CENTRO DE COSTO ===');
        console.log('📥 Error completo:', error);
        console.log('📥 Código del error:', error.codigo);
        console.log('📥 Descripción del error:', error.descripcion);
        this.toastService.showError(error.descripcion || 'Error en el centro de costo');
        this.clearCCostoField();
        return;
      }

      // Verificar si el centro de costo tiene datos válidos
      if (!centroCostoData.centro || centroCostoData.centro === 0) {
        console.log('⚠️ === CENTRO DE COSTO VACÍO EN LA RESPUESTA ===');
        console.log('📥 Valor de centro:', centroCostoData.centro);
        this.toastService.showError('El centro de costo no tiene datos válidos');
        this.clearCCostoField();
        return;
      }

      console.log('✅ === CENTRO DE COSTO ENCONTRADO Y VÁLIDO ===');
      console.log('📥 Datos finales:', centroCostoData);
      this.populateCCostoData(centroCostoData);
      this.toastService.showSuccess('Centro de costo encontrado y cargado exitosamente');
    } else {
      console.log('⚠️ === NO SE ENCONTRARON DATOS DE CENTRO DE COSTO ===');
      console.log('📥 dsRespuesta existe?', !!response.dsRespuesta);
      console.log('📥 tgecencos existe?', !!response.dsRespuesta?.tgecencos);
      console.log('📥 tgecencos es array?', Array.isArray(response.dsRespuesta?.tgecencos));
      console.log('📥 tgecencos length:', response.dsRespuesta?.tgecencos?.length);
      this.toastService.showError('No se encontró el centro de costo');
      this.clearCCostoField();
    }
  }

  private populateCCostoData(centroCostoData: CentroCostoItem): void {
    console.log('🔄 === CARGANDO DATOS DE CENTRO DE COSTO AL FORMULARIO ===');
    console.log('📥 Datos recibidos:', centroCostoData);

    // Actualizar el campo centro de costo con el valor encontrado
    const centroCostoValue = centroCostoData.centro.toString();
    console.log('📝 Actualizando campo centro de costo con valor:', centroCostoValue);
    this.transactionForm.patchValue({
      cCosto: centroCostoValue
    });

    // Actualizar la descripción del centro de costo
    const nombreCentroCosto = centroCostoData['nombre-cen'] || '';
    console.log('📝 Actualizando descripción con valor:', nombreCentroCosto);
    this.cCostoDescription.set(nombreCentroCosto);

    console.log('✅ === DATOS DE CENTRO DE COSTO CARGADOS EXITOSAMENTE ===');
    console.log('📋 Campo centro de costo:', centroCostoValue);
    console.log('📋 Descripción:', nombreCentroCosto);
    console.log('📋 Valor actual del formulario:', this.transactionForm.get('cCosto')?.value);
    console.log('📋 Descripción actual:', this.cCostoDescription());
  }

  private clearCCostoField(): void {
    console.log('🧹 Limpiando campo de centro de costo');
    this.transactionForm.patchValue({
      cCosto: ''
    });
    this.cCostoDescription.set('');
    console.log('✅ Campo de centro de costo limpiado');
  }

  // Métodos para fondos
  onUFondoKeyDown(event: Event): void {
    console.log('⌨️ === EVENTO KEYDOWN EN FONDO ===');
    const keyboardEvent = event as KeyboardEvent;
    console.log('⌨️ Tecla presionada:', keyboardEvent.key);
    console.log('⌨️ Es Enter?', keyboardEvent.key === 'Enter');

    if (keyboardEvent.key === 'Enter') {
      console.log('⌨️ Enter detectado, previniendo comportamiento por defecto');
      keyboardEvent.preventDefault();
      console.log('⌨️ Llamando a searchUFondo()');
      this.searchUFondo();
    }
  }

  onUFondoBlur(): void {
    console.log('👁️ === EVENTO BLUR EN FONDO ===');
    console.log('👁️ Llamando a searchUFondo()');
    this.searchUFondo();
  }

  private searchUFondo(): void {
    console.log('🔍 === INICIANDO searchUFondo() ===');
    const uFondoValue = this.transactionForm.get('uFondo')?.value?.trim();
    console.log('🔍 Valor de fondo obtenido:', uFondoValue);

    if (!uFondoValue) {
      console.log('⚠️ No hay valor de fondo para buscar');
      return;
    }

    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    console.log('🔍 Usuario actual obtenido:', currentUser);
    if (!currentUser) {
      console.log('❌ No se pudo obtener el usuario actual');
      this.toastService.showError('No se pudo obtener la información del usuario actual');
      return;
    }

    const companiaValue = this.transactionForm.get('compania')?.value;
    console.log('🔍 Valor de compañía:', companiaValue);
    if (!companiaValue) {
      console.log('❌ No hay compañía seleccionada');
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    const cuentaValue = this.transactionForm.get('cuenta')?.value;
    console.log('🔍 Valor de cuenta:', cuentaValue);
    if (!cuentaValue) {
      console.log('❌ No hay cuenta seleccionada');
      this.toastService.showError('Debe seleccionar una cuenta primero');
      return;
    }

    // Construir URL manualmente para logging
    const baseUrl = environment.apiUrl;
    const fullUrl = `${baseUrl}/GetLeaveUtifonCxC?pcCompania=${companiaValue}&pcCuentaC=${cuentaValue}&pcUtifon=${uFondoValue}&pcLogin=${currentUser.pcLogin || ''}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken || ''}`;

    console.log('🌐 === URL COMPLETA DEL ENDPOINT ===');
    console.log('🔗 URL:', fullUrl);
    console.log('🚀 === LLAMANDO AL SERVICIO FONDOS ===');

    this.fondosService.getFondoByCode(
      companiaValue.toString(),
      cuentaValue,
      uFondoValue,
      currentUser.pcLogin || '',
      currentUser.pcSuper || '',
      currentUser.pcToken || ''
    ).subscribe({
      next: (response) => {
        console.log('✅ === RESPUESTA EXITOSA DEL ENDPOINT FONDO ===');
        console.log('🔗 URL llamada:', fullUrl);
        console.log('📥 Respuesta completa del servidor:', JSON.stringify(response, null, 2));
        console.log('📊 Tipo de respuesta:', typeof response);
        console.log('📊 Es array?', Array.isArray(response));
        console.log('📊 Tiene dsRespuesta?', 'dsRespuesta' in response);
        console.log('📊 Tiene terrores?', 'terrores' in response);
        this.handleUFondoSearchResponse(response);
      },
      error: (error) => {
        console.error('❌ === ERROR EN LA BÚSQUEDA DE FONDO ===');
        console.error('🔗 URL que falló:', fullUrl);
        console.error('📥 Error completo:', error);
        console.error('📥 Error status:', error.status);
        console.error('📥 Error message:', error.message);
        console.error('📥 Error body:', error.error);
        this.toastService.showError('Error al buscar el fondo');
        this.clearUFondoField();
      }
    });
  }

  private handleUFondoSearchResponse(response: FondoResponse): void {
    console.log('📋 === PROCESANDO RESPUESTA DE FONDO ===');
    console.log('📥 Respuesta recibida:', response);
    console.log('📊 Estructura de la respuesta:');
    console.log('  - Tiene terrores?', response.terrores ? 'Sí' : 'No');
    console.log('  - Tiene dsRespuesta?', response.dsRespuesta ? 'Sí' : 'No');
    console.log('  - Tiene tcgutifon?', response.dsRespuesta?.tcgutifon ? 'Sí' : 'No');
    console.log('  - Cantidad de fondos:', response.dsRespuesta?.tcgutifon?.length || 0);

    // Verificar errores a nivel raíz
    if (response.terrores && response.terrores.length > 0) {
      const error = response.terrores[0];
      console.log('❌ === ERROR EN LA RESPUESTA (NIVEL RAÍZ) ===');
      console.log('📥 Error completo:', error);
      console.log('📥 Código del error:', error.codigo);
      console.log('📥 Descripción del error:', error.descripcion);
      this.toastService.showError(error.descripcion || 'No se encontró el fondo');
      this.clearUFondoField();
      return;
    }

    if (response.dsRespuesta && response.dsRespuesta.tcgutifon && response.dsRespuesta.tcgutifon.length > 0) {
      const fondoData = response.dsRespuesta.tcgutifon[0];
      console.log('📋 === DATOS DE FONDO RECIBIDOS ===');
      console.log('📥 Fondo data:', fondoData);
      console.log('📊 Campos del fondo:');
      console.log('  - utilfon:', fondoData.utilfon);
      console.log('  - nombre-ufon:', fondoData['nombre-ufon']);
      console.log('  - cia:', fondoData.cia);
      console.log('  - tipo-ufon:', fondoData['tipo-ufon']);
      console.log('  - tiene terrores?', fondoData.terrores ? 'Sí' : 'No');

      // Verificar errores dentro del item de fondo
      if (fondoData.terrores && fondoData.terrores.length > 0) {
        const error = fondoData.terrores[0];
        console.log('❌ === ERROR EN EL ITEM DE FONDO ===');
        console.log('📥 Error completo:', error);
        console.log('📥 Código del error:', error.codigo);
        console.log('📥 Descripción del error:', error.descripcion);
        this.toastService.showError(error.descripcion || 'Error en el fondo');
        this.clearUFondoField();
        return;
      }

      // Verificar si el fondo tiene datos válidos
      if (!fondoData.utilfon || fondoData.utilfon === 0) {
        console.log('⚠️ === FONDO VACÍO EN LA RESPUESTA ===');
        console.log('📥 Valor de utilfon:', fondoData.utilfon);
        this.toastService.showError('El fondo no tiene datos válidos');
        this.clearUFondoField();
        return;
      }

      console.log('✅ === FONDO ENCONTRADO Y VÁLIDO ===');
      console.log('📥 Datos finales:', fondoData);
      this.populateUFondoData(fondoData);
      this.toastService.showSuccess('Fondo encontrado y cargado exitosamente');
    } else {
      console.log('⚠️ === NO SE ENCONTRARON DATOS DE FONDO ===');
      console.log('📥 dsRespuesta existe?', !!response.dsRespuesta);
      console.log('📥 tcgutifon existe?', !!response.dsRespuesta?.tcgutifon);
      console.log('📥 tcgutifon es array?', Array.isArray(response.dsRespuesta?.tcgutifon));
      console.log('📥 tcgutifon length:', response.dsRespuesta?.tcgutifon?.length);
      this.toastService.showError('No se encontró el fondo');
      this.clearUFondoField();
    }
  }

  private populateUFondoData(fondoData: FondoItem): void {
    console.log('🔄 === CARGANDO DATOS DE FONDO AL FORMULARIO ===');
    console.log('📥 Datos recibidos:', fondoData);

    // Actualizar el campo fondo con el valor encontrado
    const fondoValue = fondoData.utilfon.toString();
    console.log('📝 Actualizando campo fondo con valor:', fondoValue);
    this.transactionForm.patchValue({
      uFondo: fondoValue
    });

    // Actualizar la descripción del fondo
    const nombreFondo = fondoData['nombre-ufon'] || '';
    console.log('📝 Actualizando descripción con valor:', nombreFondo);
    this.uFondoDescription.set(nombreFondo);

    console.log('✅ === DATOS DE FONDO CARGADOS EXITOSAMENTE ===');
    console.log('📋 Campo fondo:', fondoValue);
    console.log('📋 Descripción:', nombreFondo);
    console.log('📋 Valor actual del formulario:', this.transactionForm.get('uFondo')?.value);
    console.log('📋 Descripción actual:', this.uFondoDescription());
  }

  private clearUFondoField(): void {
    console.log('🧹 Limpiando campo de fondo');
    this.transactionForm.patchValue({
      uFondo: ''
    });
    this.uFondoDescription.set('');
    console.log('✅ Campo de fondo limpiado');
  }

  // Método para cargar datos de contabilidad (Sección 2)
  private loadContabilidadData(companiaValue: any, fecPerValue: any, loteValue: any, currentUser: any): void {
    console.log('📊 === CARGANDO DATOS DE CONTABILIDAD (SECCIÓN 2) ===');
    console.log('📋 Parámetros:', { companiaValue, fecPerValue, loteValue });

    this.isLoadingContabilidad.set(true);

    this.companiasCxCService.getLeaveLoteCxCCont(
      companiaValue.toString(),
      fecPerValue,
      loteValue.toString(),
      currentUser.pcLogin || '',
      currentUser.pcSuper || '',
      currentUser.pcToken || ''
    ).subscribe({
      next: (response) => {
        console.log('✅ === DATOS DE CONTABILIDAD CARGADOS ===');
        console.log('📥 Respuesta del servidor:', response);
        this.isLoadingContabilidad.set(false);
        this.handleContabilidadResponse(response);
      },
      error: (error) => {
        console.error('❌ === ERROR AL CARGAR DATOS DE CONTABILIDAD ===');
        console.error('📥 Error completo:', error);
        this.isLoadingContabilidad.set(false);
        this.toastService.showError('Error al cargar los datos de contabilidad');
      }
    });
  }

  private handleContabilidadResponse(response: any): void {
    if (response.dsRespuesta && response.dsRespuesta.tccmovaut && response.dsRespuesta.tccmovaut.length > 0) {
      const data = response.dsRespuesta.tccmovaut;
      this.contabilidadData.set(data);
      console.log('DATOS TRAIDOS DE LOTE:', data);
    } else {
      this.contabilidadData.set([]);
    }
  }

  // Cargar lista de cuentas para el popup
  private loadCuentasCxC(): void {
    const currentUser = this.authService.user();
    if (!currentUser) {
      this.toastService.showError('No se pudo obtener la información del usuario actual');
      return;
    }

    const companiaValue = this.transactionForm.get('compania')?.value;
    if (!companiaValue) {
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    console.log('🔍 === CARGANDO LISTA DE CUENTAS ===');
    console.log('📋 Compañía:', companiaValue);

    this.isLoadingCuentas.set(true);
    this.cuentasService.getCuentasList(
      companiaValue.toString(),
      currentUser.pcLogin || '',
      currentUser.pcSuper || '',
      currentUser.pcToken || ''
    ).subscribe({
      next: (response) => {
        this.isLoadingCuentas.set(false);
        console.log('✅ === LISTA DE CUENTAS CARGADA ===');
        console.log('📥 Respuesta del servidor:', response);
        this.handleCuentasListResponse(response);
      },
      error: (error) => {
        this.isLoadingCuentas.set(false);
        console.error('❌ === ERROR AL CARGAR LISTA DE CUENTAS ===');
        console.error('📥 Error completo:', error);
        this.toastService.showError('Error al cargar la lista de cuentas');
      }
    });
  }

  private handleCuentasListResponse(response: CuentaResponse): void {
    console.log('📋 Procesando respuesta de lista de cuentas:', response);

    if (response.terrores && response.terrores.length > 0) {
      const error = response.terrores[0];
      console.log('❌ Error en la respuesta:', error);
      this.toastService.showError(error.descripcion || 'Error al cargar las cuentas');
      return;
    }

    if (response.dsRespuesta && response.dsRespuesta.tcgcontab && response.dsRespuesta.tcgcontab.length > 0) {
      const cuentas = response.dsRespuesta.tcgcontab;
      console.log('✅ Cuentas encontradas:', cuentas.length);
      this.cuentasData.set(cuentas);
      this.originalCuentasData.set(cuentas); // Guardar datos originales
    } else {
      console.log('⚠️ No se encontraron cuentas');
      this.cuentasData.set([]);
      this.originalCuentasData.set([]);
      this.toastService.showInfo('No se encontraron cuentas');
    }
  }

  // Cargar lista de auxiliares para el popup
  private loadAuxiliaresCxC(): void {
    const currentUser = this.authService.user();
    if (!currentUser) {
      this.toastService.showError('No se pudo obtener la información del usuario actual');
      return;
    }

    const companiaValue = this.transactionForm.get('compania')?.value;
    if (!companiaValue) {
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    const cuentaValue = this.transactionForm.get('cuenta')?.value;
    if (!cuentaValue) {
      this.toastService.showError('Debe seleccionar una cuenta primero');
      return;
    }

    console.log('🔍 === CARGANDO LISTA DE AUXILIARES ===');
    console.log('📋 Compañía:', companiaValue);
    console.log('📋 Cuenta:', cuentaValue);

    this.isLoadingAuxiliares.set(true);
    this.auxiliaresService.getAuxiliaresList(
      companiaValue.toString(),
      cuentaValue,
      currentUser.pcLogin || '',
      currentUser.pcSuper || '',
      currentUser.pcToken || ''
    ).subscribe({
      next: (response) => {
        this.isLoadingAuxiliares.set(false);
        console.log('✅ === LISTA DE AUXILIARES CARGADA ===');
        console.log('📥 Respuesta del servidor:', response);
        this.handleAuxiliaresListResponse(response);
      },
      error: (error) => {
        this.isLoadingAuxiliares.set(false);
        console.error('❌ === ERROR AL CARGAR LISTA DE AUXILIARES ===');
        console.error('📥 Error completo:', error);
        this.toastService.showError('Error al cargar la lista de auxiliares');
      }
    });
  }

  private handleAuxiliaresListResponse(response: AuxiliarResponse): void {
    console.log('📋 Procesando respuesta de lista de auxiliares:', response);

    if (response.terrores && response.terrores.length > 0) {
      const error = response.terrores[0];
      console.log('❌ Error en la respuesta:', error);
      this.toastService.showError(error.descripcion || 'Error al cargar los auxiliares');
      return;
    }

    if (response.dsRespuesta && response.dsRespuesta.tcgmaeaux && response.dsRespuesta.tcgmaeaux.length > 0) {
      const auxiliares = response.dsRespuesta.tcgmaeaux;
      console.log('✅ Auxiliares encontrados:', auxiliares.length);
      this.auxiliaresData.set(auxiliares);
      this.originalAuxiliaresData.set(auxiliares); // Guardar datos originales
    } else {
      console.log('⚠️ No se encontraron auxiliares');
      this.auxiliaresData.set([]);
      this.originalAuxiliaresData.set([]);
      this.toastService.showInfo('No se encontraron auxiliares');
    }
  }

  // Cargar lista de ubicaciones para el popup
  private loadUbicacionesCxC(): void {
    const currentUser = this.authService.user();
    if (!currentUser) {
      this.toastService.showError('No se pudo obtener la información del usuario actual');
      return;
    }

    const companiaValue = this.transactionForm.get('compania')?.value;
    if (!companiaValue) {
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    console.log('🔍 === CARGANDO LISTA DE UBICACIONES ===');
    console.log('📋 Compañía:', companiaValue);

    this.isLoadingUbicaciones.set(true);
    this.ubicacionesService.getUbicacionesList(
      companiaValue.toString(),
      currentUser.pcLogin || '',
      currentUser.pcSuper || '',
      currentUser.pcToken || ''
    ).subscribe({
      next: (response) => {
        this.isLoadingUbicaciones.set(false);
        console.log('✅ === LISTA DE UBICACIONES CARGADA ===');
        console.log('📥 Respuesta del servidor:', response);
        this.handleUbicacionesListResponse(response);
      },
      error: (error) => {
        this.isLoadingUbicaciones.set(false);
        console.error('❌ === ERROR AL CARGAR LISTA DE UBICACIONES ===');
        console.error('📥 Error completo:', error);
        this.toastService.showError('Error al cargar la lista de ubicaciones');
      }
    });
  }

  private handleUbicacionesListResponse(response: UbicacionResponse): void {
    console.log('📋 Procesando respuesta de lista de ubicaciones:', response);

    if (response.terrores && response.terrores.length > 0) {
      const error = response.terrores[0];
      console.log('❌ Error en la respuesta:', error);
      this.toastService.showError(error.descripcion || 'Error al cargar las ubicaciones');
      return;
    }

    if (response.dsRespuesta && response.dsRespuesta.tcgubicac && response.dsRespuesta.tcgubicac.length > 0) {
      const ubicaciones = response.dsRespuesta.tcgubicac;
      console.log('✅ Ubicaciones encontradas:', ubicaciones.length);
      this.ubicacionesData.set(ubicaciones);
      this.originalUbicacionesData.set(ubicaciones); // Guardar datos originales
    } else {
      console.log('⚠️ No se encontraron ubicaciones');
      this.ubicacionesData.set([]);
      this.originalUbicacionesData.set([]);
      this.toastService.showInfo('No se encontraron ubicaciones');
    }
  }

  // Cargar lista de centros de costo para el popup
  private loadCentrosCostoCxC(): void {
    const currentUser = this.authService.user();
    if (!currentUser) {
      this.toastService.showError('No se pudo obtener la información del usuario actual');
      return;
    }

    const companiaValue = this.transactionForm.get('compania')?.value;
    if (!companiaValue) {
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    console.log('🔍 === CARGANDO LISTA DE CENTROS DE COSTO ===');
    console.log('📋 Compañía:', companiaValue);

    this.isLoadingCentrosCosto.set(true);
    this.centroCostosService.getCentrosCostoList(
      companiaValue.toString(),
      currentUser.pcLogin || '',
      currentUser.pcSuper || '',
      currentUser.pcToken || ''
    ).subscribe({
      next: (response) => {
        this.isLoadingCentrosCosto.set(false);
        console.log('✅ === LISTA DE CENTROS DE COSTO CARGADA ===');
        console.log('📥 Respuesta del servidor:', response);
        this.handleCentrosCostoListResponse(response);
      },
      error: (error) => {
        this.isLoadingCentrosCosto.set(false);
        console.error('❌ === ERROR AL CARGAR LISTA DE CENTROS DE COSTO ===');
        console.error('📥 Error completo:', error);
        this.toastService.showError('Error al cargar la lista de centros de costo');
      }
    });
  }

  private handleCentrosCostoListResponse(response: CentroCostoResponse): void {
    console.log('📋 Procesando respuesta de lista de centros de costo:', response);

    if (response.terrores && response.terrores.length > 0) {
      const error = response.terrores[0];
      console.log('❌ Error en la respuesta:', error);
      this.toastService.showError(error.descripcion || 'Error al cargar los centros de costo');
      return;
    }

    if (response.dsRespuesta && response.dsRespuesta.tgecencos && response.dsRespuesta.tgecencos.length > 0) {
      const centrosCosto = response.dsRespuesta.tgecencos;
      console.log('✅ Centros de costo encontrados:', centrosCosto.length);
      this.centrosCostoData.set(centrosCosto);
      this.originalCentrosCostoData.set(centrosCosto); // Guardar datos originales
    } else {
      console.log('⚠️ No se encontraron centros de costo');
      this.centrosCostoData.set([]);
      this.originalCentrosCostoData.set([]);
      this.toastService.showInfo('No se encontraron centros de costo');
    }
  }

  // Cargar lista de fondos para el popup
  private loadFondosCxC(): void {
    const currentUser = this.authService.user();
    if (!currentUser) {
      this.toastService.showError('No se pudo obtener la información del usuario actual');
      return;
    }

    const companiaValue = this.transactionForm.get('compania')?.value;
    if (!companiaValue) {
      this.toastService.showError('Debe seleccionar una compañía primero');
      return;
    }

    console.log('🔍 === CARGANDO LISTA DE FONDOS ===');
    console.log('📋 Compañía:', companiaValue);

    this.isLoadingFondos.set(true);
    this.fondosService.getFondosList(
      companiaValue.toString(),
      currentUser.pcLogin || '',
      currentUser.pcSuper || '',
      currentUser.pcToken || ''
    ).subscribe({
      next: (response) => {
        this.isLoadingFondos.set(false);
        console.log('✅ === LISTA DE FONDOS CARGADA ===');
        console.log('📥 Respuesta del servidor:', response);
        this.handleFondosListResponse(response);
      },
      error: (error) => {
        this.isLoadingFondos.set(false);
        console.error('❌ === ERROR AL CARGAR LISTA DE FONDOS ===');
        console.error('📥 Error completo:', error);
        this.toastService.showError('Error al cargar la lista de fondos');
      }
    });
  }

  private handleFondosListResponse(response: FondoResponse): void {
    console.log('📋 Procesando respuesta de lista de fondos:', response);

    if (response.terrores && response.terrores.length > 0) {
      const error = response.terrores[0];
      console.log('❌ Error en la respuesta:', error);
      this.toastService.showError(error.descripcion || 'Error al cargar los fondos');
      return;
    }

    if (response.dsRespuesta && response.dsRespuesta.tcgutifon && response.dsRespuesta.tcgutifon.length > 0) {
      const fondos = response.dsRespuesta.tcgutifon;
      console.log('✅ Fondos encontrados:', fondos.length);
      this.fondosData.set(fondos);
      this.originalFondosData.set(fondos); // Guardar datos originales
    } else {
      console.log('⚠️ No se encontraron fondos');
      this.fondosData.set([]);
      this.originalFondosData.set([]);
      this.toastService.showInfo('No se encontraron fondos');
    }
  }

  /**
   * Carga los datos de un item del lote al formulario de la sección 1
   * @param item Item seleccionado de la tabla de lote
   */
  loadLoteItemToForm(item: any): void {
    console.log('🔄 Cargando datos del lote al formulario:', item);

    // Mapear los datos del item del lote a los campos del formulario
    this.transactionForm.patchValue({
      empresa: item.empresa || '',
      documento: item['numdoc-his'] || '',
      tipoDoc: item.tipodoc || '',
      vendedor: item.vendedor || '',
      comentario: item['text-his'] || '',
      referencia: item['refere-his'] || '',
      aplicDoc: item['apldoc-his'] || '',
      moneda: item.Moneda || '',
      emision: item['fecmov-his'] || '',
      vencimiento: item['fecven-his'] || '',
      monto: item['monto-his'] || 0,
      impuesto: item['desiva-his'] || 0,
      mtoExtran: item['monext-his'] || 0,
      baseImp: item['basiva-his'] || 0
    });

    // Actualizar las descripciones si están disponibles
    if (item['nombre-emp']) {
      this.empresaDescription.set(item['nombre-emp']);
    }
    if (item['nombre-tdoc']) {
      this.tipoDocDescription.set(item['nombre-tdoc']);
    }
    if (item['nombre-vend']) {
      this.vendedorDescription.set(item['nombre-vend']);
    }

    console.log('✅ Datos del lote cargados en el formulario');
    this.toastService.showSuccess('Datos del lote cargados en el formulario');
  }

  validateEmpresaByCode(): void {
    // Evitar llamadas duplicadas si ya hay una validación en progreso
    if (this.isLoadingEmpresas()) {
      console.log('⚠️ Validación de empresa ya en progreso, evitando llamada duplicada');
      return;
    }

    const empresaValue = this.transactionForm.get('empresa')?.value;
    const companiaValue = this.transactionForm.get('compania')?.value;
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!empresaValue || !companiaValue || !currentUser || !currentUser.pcToken || !currentUser.pcLogin) {
      return;
    }

    // Console.log del endpoint y datos enviados
    const baseUrl = environment.apiUrl;
    const endpoint = '/GetLeaveEmpresaCxC';
    const fullUrl = `${baseUrl}${endpoint}?pcCompania=${companiaValue}&pcEmpresa=${empresaValue}&pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;

    console.log('🌐 URL completa:', fullUrl);

    this.isLoadingEmpresas.set(true);
    this.setEmpresaLoading(true);
    this.companiasCxCService.validateEmpresaByCode(
      companiaValue,
      empresaValue,
      currentUser.pcLogin,
      pcSuper,
      currentUser.pcToken
    ).subscribe({
      next: (response: ApiResponse<EmpresaCxC>) => {
        console.log('✅ Respuesta API GetLeaveEmpresaCxC:', response);
        this.isLoadingEmpresas.set(false);
        this.setEmpresaLoading(false);
        this.handleEmpresaValidationResponse(response);
      },
      error: (error) => {
        console.error('❌ Error validating empresa:', error);
        this.isLoadingEmpresas.set(false);
        this.setEmpresaLoading(false);
        this.toastService.showError('Error al validar la empresa');
      }
    });
  }

  private handleEmpresaValidationResponse(response: ApiResponse<EmpresaCxC>): void {
    console.log('📋 Procesando respuesta de validación de empresa:', response);

    // Verificar si hay errores
    if (response.errores && response.errores.length > 0) {
      console.log('⚠️ Errores encontrados:', response.errores);
      const error = response.errores[0];
      if (error.descripcion && error.descripcion.includes('no encontró registro')) {
        console.log('❌ No se encontró registro:', error.descripcion);
        this.toastService.showError(error.descripcion);
        this.empresaDescription.set('');
        return;
      }
    }

    // Procesar datos exitosos
    if (response.dsRespuesta && response.dsRespuesta['tccempresT']) {
      const data = response.dsRespuesta['tccempresT'];
      console.log('📊 Datos encontrados:', { dataLength: data.length, data });

      if (data.length > 0) {
        const item = data[0];
        console.log('🎯 Empresa encontrada:', item);
        this.empresaDescription.set(item['nombre-emp']);
        console.log('✅ Empresa validada:', {
          codigo: item.empresa,
          nombre: item['nombre-emp'],
          nit: item.nit
        });
      }
    } else {
      console.log('⚠️ No se encontraron datos en dsRespuesta:', response.dsRespuesta);
    }
  }

  onEmpresaKeyDown(event: Event): void {
    console.log('🚀 Ejecutando validación de empresa por Enter');
    event.preventDefault();
    this.validateEmpresaByCode();
  }

  onEmpresaBlur(): void {
    console.log('👁️ Campo empresa perdió el foco - ejecutando validación');
    this.validateEmpresaByCode();
  }

  // Tipo Documento methods
  loadTiposDocCxC(): void {
    const currentUser = this.authService.user();
    const companiaValue = this.transactionForm.get('compania')?.value;
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser || !currentUser.pcToken || !currentUser.pcLogin || !currentUser.pcSuper) {
      this.toastService.showError('Usuario no autenticado o compañía no seleccionada');
      return;
    }

    this.isLoadingTiposDoc.set(true);
    this.companiasCxCService.getTiposDoc(
      companiaValue,
      currentUser.pcLogin,
      pcSuper,
      currentUser.pcToken
    ).subscribe({
      next: (response: ApiResponse<TipoDocCxC>) => {
        console.log('✅ Respuesta API GetCETipodoc:', response);
        this.isLoadingTiposDoc.set(false);
        this.handleTiposDocResponse(response);
      },
      error: (error) => {
        console.error('❌ Error loading tipos doc:', error);
        this.isLoadingTiposDoc.set(false);
        this.toastService.showError('Error al cargar tipos de documento');
      }
    });
  }

  private handleTiposDocResponse(response: ApiResponse<TipoDocCxC>): void {
    console.log('📋 Procesando respuesta de tipos doc:', response);

    if (response.dsRespuesta && response.dsRespuesta['tcctipdoc']) {
      this.allTiposDocCxC.set(response.dsRespuesta['tcctipdoc']);
      this.filteredTiposDocCxC.set(response.dsRespuesta['tcctipdoc']);
      console.log('✅ Tipos doc cargados:', response.dsRespuesta['tcctipdoc'].length);
    } else {
      console.log('⚠️ No se encontraron tipos de documento en la respuesta');
      this.allTiposDocCxC.set([]);
      this.filteredTiposDocCxC.set([]);
    }
  }

  validateTipoDocByCode(): void {
    // Evitar llamadas duplicadas si ya hay una validación en progreso
    if (this.isLoadingTiposDoc()) {
      console.log('⚠️ Validación de tipo doc ya en progreso, evitando llamada duplicada');
      return;
    }

    const tipoDocValue = this.transactionForm.get('tipoDoc')?.value;
    const companiaValue = this.transactionForm.get('compania')?.value;
    const empresaValue = this.transactionForm.get('empresa')?.value;
    const numDocValue = this.transactionForm.get('documento')?.value;
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!tipoDocValue || !companiaValue || !empresaValue || !numDocValue || !currentUser || !currentUser.pcToken || !currentUser.pcLogin) {
      console.log('⚠️ Faltan datos requeridos para validar tipo documento');
      this.toastService.showError('Faltan datos requeridos para validar tipo documento. Verifique que estén completos los campos: Compañía, Empresa y Documento.');
      return;
    }

    this.isLoadingTiposDoc.set(true);
    this.setTipoDocLoading(true);
    this.companiasCxCService.validateTipoDocByCode(
      companiaValue,
      empresaValue,
      numDocValue,
      tipoDocValue,
      currentUser.pcLogin,
      pcSuper,
      currentUser.pcToken
    ).subscribe({
      next: (response: ApiResponse<TipoDocCxC>) => {
        console.log('✅ Respuesta API GetLeaveTipoDocCxC:', response);
        this.isLoadingTiposDoc.set(false);
        this.setTipoDocLoading(false);
        this.handleTipoDocValidationResponse(response);
      },
      error: (error) => {
        console.error('❌ Error validating tipo doc:', error);
        this.isLoadingTiposDoc.set(false);
        this.setTipoDocLoading(false);
        this.toastService.showError('Error al validar el tipo de documento');
      }
    });
  }

  private handleTipoDocValidationResponse(response: ApiResponse<TipoDocCxC>): void {
    console.log('📋 Procesando respuesta de validación de tipo doc:', response);

    // Verificar si hay errores en el nivel principal de la respuesta
    if (response.errores && response.errores.length > 0) {
      console.log('⚠️ Errores encontrados en tipo doc:', response.errores);
      const error = response.errores[0];
      if (error.descripcion && error.descripcion.includes('no encontró registro')) {
        console.log('❌ No se encontró registro:', error.descripcion);
        this.toastService.showError(error.descripcion);
        this.tipoDocDescription.set('');
        this.transactionForm.patchValue({ tipoDoc: '' });
        return;
      }
    }

    // Procesar datos exitosos
    if (response.dsRespuesta && response.dsRespuesta['tcctipdoc']) {
      const data = response.dsRespuesta['tcctipdoc'];
      console.log('📊 Datos encontrados:', { dataLength: data.length, data });

      if (data.length > 0) {
        const item = data[0];
        console.log('🎯 Tipo doc encontrado:', item);
        this.tipoDocDescription.set(item['nombre-tdoc']);
        console.log('✅ Tipo documento validado:', {
          codigo: item.tipodoc,
          nombre: item['nombre-tdoc'],
          siglas: item['siglas-tdoc']
        });
      } else {
        console.log('⚠️ No se encontraron datos en tcctipdoc');
        this.toastService.showError('No se encontró registro para el tipo de documento ingresado');
        this.tipoDocDescription.set('');
        this.transactionForm.patchValue({ tipoDoc: '' });
      }
    } else {
      console.log('⚠️ No se encontraron datos en dsRespuesta:', response.dsRespuesta);
      this.toastService.showError('No se encontró registro para el tipo de documento ingresado');
      this.tipoDocDescription.set('');
      this.transactionForm.patchValue({ tipoDoc: '' });
    }
  }

  onTipoDocKeyDown(event: Event): void {
    console.log('🚀 Ejecutando validación de tipo doc por Enter');
    event.preventDefault();
    this.validateTipoDocByCode();
  }

  onTipoDocBlur(): void {
    console.log('👁️ Campo tipo doc perdió el foco - ejecutando validación');
    this.validateTipoDocByCode();
  }

  // Documento methods
  loadDocumentosCxC(): void {
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);
    const companiaValue = this.transactionForm.get('compania')?.value;
    const empresaValue = this.transactionForm.get('empresa')?.value;

    if (!currentUser || !currentUser.pcToken || !currentUser.pcLogin || !companiaValue || !empresaValue) {
      this.toastService.showError('Usuario no autenticado, compañía o empresa no seleccionada');
      return;
    }

    this.isLoadingDocumentos.set(true);
    this.setDocumentoLoading(true);
    this.companiasCxCService.getDocumentos(
      companiaValue,
      empresaValue,
      currentUser.pcLogin,
      pcSuper,
      currentUser.pcToken
    ).subscribe({
      next: (response: ApiResponse<DocumentoCxC>) => {
        console.log('✅ Respuesta API GetCEccdocumeCxC:', response);
        this.isLoadingDocumentos.set(false);
        this.setDocumentoLoading(false);
        this.handleDocumentosResponse(response);
      },
      error: (error) => {
        console.error('❌ Error loading documentos:', error);
        this.isLoadingDocumentos.set(false);
        this.setDocumentoLoading(false);
        this.toastService.showError('Error al cargar documentos');
      }
    });
  }

  private handleDocumentosResponse(response: ApiResponse<DocumentoCxC>): void {
    console.log('📋 Procesando respuesta de documentos:', response);

    if (response.dsRespuesta && response.dsRespuesta['tccdocume']) {
      this.allDocumentosCxC.set(response.dsRespuesta['tccdocume']);
      this.filteredDocumentosCxC.set(response.dsRespuesta['tccdocume']);
      console.log('✅ Documentos cargados:', response.dsRespuesta['tccdocume'].length);
    } else {
      console.log('⚠️ No se encontraron documentos en la respuesta');
      this.allDocumentosCxC.set([]);
      this.filteredDocumentosCxC.set([]);
    }
  }

  // Fecha Emision methods
  validateFechaEmision(): void {
    // Evitar llamadas duplicadas si ya hay una validación en progreso
    if (this.isLoadingFechaEmision()) {
      console.log('⚠️ Validación de fecha emisión ya en progreso, evitando llamada duplicada');
      return;
    }

    const fechaEmisionValue = this.transactionForm.get('emision')?.value;
    const companiaValue = this.transactionForm.get('compania')?.value;
    const fechaPerValue = this.transactionForm.get('fechaPer')?.value;
    const empresaValue = this.transactionForm.get('empresa')?.value;
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    console.log('🔍 Validando fecha emisión:', {
      fechaEmision: fechaEmisionValue,
      compania: companiaValue,
      fechaPer: fechaPerValue,
      empresa: empresaValue,
      hasUser: !!currentUser
    });

    if (!fechaEmisionValue) {
      console.log('⚠️ Fecha de emisión no ingresada');
      return;
    }

    if (!companiaValue || !fechaPerValue || !empresaValue || !currentUser || !currentUser.pcToken || !currentUser.pcLogin) {
      console.log('⚠️ Faltan datos requeridos para validar fecha de emisión');
      this.toastService.showError('Faltan datos requeridos: compañía, fecha de período o empresa no seleccionada');
      this.transactionForm.patchValue({ emision: '' });
      return;
    }

    this.isLoadingFechaEmision.set(true);
    this.setFechaEmisionLoading(true);
    this.companiasCxCService.validateFechaEmision(
      companiaValue,
      fechaEmisionValue,
      fechaPerValue,
      empresaValue,
      currentUser.pcLogin,
      pcSuper,
      currentUser.pcToken
    ).subscribe({
      next: (response: ApiResponse<FechaEmisionCxC>) => {
        console.log('✅ Respuesta API GetLeaveFechaEmisionCxC:', response);
        this.isLoadingFechaEmision.set(false);
        this.setFechaEmisionLoading(false);
        this.handleFechaEmisionValidationResponse(response);
      },
      error: (error) => {
        console.error('❌ Error validating fecha emision:', error);
        this.isLoadingFechaEmision.set(false);
        this.setFechaEmisionLoading(false);
        this.toastService.showError('Error al validar la fecha de emisión');
      }
    });
  }

  private handleFechaEmisionValidationResponse(response: ApiResponse<FechaEmisionCxC>): void {
    console.log('📋 Procesando respuesta de validación de fecha emisión:', response);

    if (response.dsRespuesta && response.dsRespuesta['tFechaEmisionCxC'] && response.dsRespuesta['tFechaEmisionCxC'].length > 0) {
      const fechaEmision = response.dsRespuesta['tFechaEmisionCxC'][0];

      // Check for errors in the response
      if (fechaEmision.terrores && fechaEmision.terrores.length > 0) {
        // Show the first error message and clear the field
        const error = fechaEmision.terrores[0];
        console.log('❌ Error en fecha emisión:', error);
        this.toastService.showError(error.descripcion);
        this.transactionForm.patchValue({ emision: '' });
        return;
      }

      console.log('✅ Fecha de emisión validada:', fechaEmision['fecmov-his']);
    } else {
      console.log('⚠️ No se encontró información de fecha de emisión en la respuesta');
      this.toastService.showError('No se encontró información de fecha de emisión');
      this.transactionForm.patchValue({ emision: '' });
    }
  }

  onFechaEmisionKeyDown(event: Event): void {
    console.log('🚀 Ejecutando validación de fecha emisión por Enter');
    event.preventDefault();
    this.validateFechaEmision();
  }

  onFechaEmisionBlur(): void {
    console.log('👁️ Campo fecha emisión perdió el foco - validando fecha completa');
    const fechaValue = this.transactionForm.get('emision')?.value;

    // Solo validar si la fecha está completa (formato YYYY-MM-DD)
    if (fechaValue && fechaValue.length === 10 && this.isValidDateFormat(fechaValue)) {
      console.log('📅 Fecha emisión completa detectada:', fechaValue);
      this.validateFechaEmision();
    } else {
      console.log('📅 Fecha emisión incompleta o inválida, saltando validación');
    }
  }


  // Fecha Vencimiento methods
  validateFechaVencimiento(): void {
    // Evitar llamadas duplicadas si ya hay una validación en progreso
    if (this.isLoadingFechaVencimiento()) {
      console.log('⚠️ Validación de fecha vencimiento ya en progreso, evitando llamada duplicada');
      return;
    }

    const fechaVencimientoValue = this.transactionForm.get('vencimiento')?.value;
    const companiaValue = this.transactionForm.get('compania')?.value;
    const fechaEmisionValue = this.transactionForm.get('emision')?.value;
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    console.log('🔍 Validando fecha vencimiento:', {
      fechaVencimiento: fechaVencimientoValue,
      compania: companiaValue,
      fechaEmision: fechaEmisionValue,
      hasUser: !!currentUser
    });

    if (!fechaVencimientoValue) {
      console.log('⚠️ Fecha de vencimiento no ingresada');
      return;
    }

    if (!companiaValue || !fechaEmisionValue || !currentUser || !currentUser.pcToken || !currentUser.pcLogin) {
      console.log('⚠️ Faltan datos requeridos para validar fecha de vencimiento');
      this.toastService.showError('Faltan datos requeridos: compañía o fecha de emisión no seleccionada');
      this.transactionForm.patchValue({ vencimiento: '' });
      return;
    }

    this.isLoadingFechaVencimiento.set(true);
    this.setFechaVencimientoLoading(true);
    this.companiasCxCService.validateFechaVencimiento(
      companiaValue,
      fechaEmisionValue,
      fechaVencimientoValue,
      currentUser.pcLogin,
      pcSuper,
      currentUser.pcToken
    ).subscribe({
      next: (response: ApiResponse<FechaVencimientoCxC>) => {
        console.log('✅ Respuesta API GetLeaveFechaVencimientoCxC:', response);
        this.isLoadingFechaVencimiento.set(false);
        this.setFechaVencimientoLoading(false);
        this.handleFechaVencimientoValidationResponse(response);
      },
      error: (error) => {
        console.error('❌ Error validating fecha vencimiento:', error);
        this.isLoadingFechaVencimiento.set(false);
        this.setFechaVencimientoLoading(false);
        this.toastService.showError('Error al validar la fecha de vencimiento');
      }
    });
  }

  private handleFechaVencimientoValidationResponse(response: ApiResponse<FechaVencimientoCxC>): void {
    console.log('📋 Procesando respuesta de validación de fecha vencimiento:', response);

    if (response.dsRespuesta && response.dsRespuesta['tFechaVencimientoCxC'] && response.dsRespuesta['tFechaVencimientoCxC'].length > 0) {
      const fechaVencimiento = response.dsRespuesta['tFechaVencimientoCxC'][0];

      // Check for errors in the response
      if (fechaVencimiento.terrores && fechaVencimiento.terrores.length > 0) {
        // Show the first error message and clear the field
        const error = fechaVencimiento.terrores[0];
        console.log('❌ Error en fecha vencimiento:', error);
        this.toastService.showError(error.descripcion);
        this.transactionForm.patchValue({ vencimiento: '' });
        return;
      }

      console.log('✅ Fecha de vencimiento validada:', fechaVencimiento['fecven-his']);
    } else {
      console.log('⚠️ No se encontró información de fecha de vencimiento en la respuesta');
      this.toastService.showError('No se encontró información de fecha de vencimiento');
      this.transactionForm.patchValue({ vencimiento: '' });
    }
  }

  onFechaVencimientoKeyDown(event: Event): void {
    console.log('🚀 Ejecutando validación de fecha vencimiento por Enter');
    event.preventDefault();
    this.validateFechaVencimiento();
  }

  onFechaVencimientoBlur(): void {
    console.log('👁️ Campo fecha vencimiento perdió el foco - validando fecha completa');
    const fechaValue = this.transactionForm.get('vencimiento')?.value;

    // Solo validar si la fecha está completa (formato YYYY-MM-DD)
    if (fechaValue && fechaValue.length === 10 && this.isValidDateFormat(fechaValue)) {
      console.log('📅 Fecha vencimiento completa detectada:', fechaValue);
      this.validateFechaVencimiento();
    } else {
      console.log('📅 Fecha vencimiento incompleta o inválida, saltando validación');
    }
  }


  // Moneda methods
  loadMonedas(): void {
    console.log('🔍 Cargando monedas...');

    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser || !currentUser.pcToken || !currentUser.pcLogin) {
      console.log('⚠️ Usuario no autenticado');
      this.toastService.showError('Usuario no autenticado');
      return;
    }

    this.isLoadingMonedas.set(true);
    this.monedasService.getMonedas(
      currentUser.pcLogin,
      pcSuper,
      currentUser.pcToken
    ).subscribe({
      next: (response) => {
        console.log('✅ Respuesta API GetCEgemoneda:', response);
        this.isLoadingMonedas.set(false);

        if (response.dsRespuesta && response.dsRespuesta.tgemoneda) {
          // Check for errors
          if (response.dsRespuesta.terrores && response.dsRespuesta.terrores.length > 0) {
            const error = response.dsRespuesta.terrores[0];
            console.log('❌ Error en monedas:', error);
            this.toastService.showError(error.descripcion);
            return;
          }

          this.monedasData.set(response.dsRespuesta.tgemoneda);
          this.allMonedas.set(response.dsRespuesta.tgemoneda);
          this.filteredItems.set(response.dsRespuesta.tgemoneda);
          console.log('✅ Monedas cargadas:', response.dsRespuesta.tgemoneda.length);
        }
      },
      error: (error) => {
        console.error('❌ Error al cargar monedas:', error);
        this.isLoadingMonedas.set(false);
        this.toastService.showError('Error al cargar monedas');
      }
    });
  }

  validateMoneda(): void {
    if (this.isLoadingMonedas()) {
      console.log('⚠️ Validación de moneda ya en progreso');
      return;
    }

    const monedaValue = this.transactionForm.get('moneda')?.value;
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    console.log('🔍 Validando moneda:', { moneda: monedaValue });

    if (!monedaValue) {
      console.log('⚠️ Moneda no ingresada');
      return;
    }

    if (!currentUser || !currentUser.pcToken || !currentUser.pcLogin) {
      console.log('⚠️ Usuario no autenticado');
      this.toastService.showError('Usuario no autenticado');
      this.transactionForm.patchValue({ moneda: '' });
      this.monedaDescription.set('');
      return;
    }

    this.isLoadingMonedas.set(true);
    this.monedasService.validateMoneda(
      monedaValue,
      currentUser.pcLogin,
      pcSuper,
      currentUser.pcToken
    ).subscribe({
      next: (response) => {
        console.log('✅ Respuesta API GetLeaveMoneda:', response);
        this.isLoadingMonedas.set(false);

        if (response.dsRespuesta && response.dsRespuesta.tgemoneda && response.dsRespuesta.tgemoneda.length > 0) {
          const moneda = response.dsRespuesta.tgemoneda[0];

          // Check for errors
          if (response.dsRespuesta.terrores && response.dsRespuesta.terrores.length > 0) {
            const error = response.dsRespuesta.terrores[0];
            console.log('❌ Error en moneda:', error);
            this.toastService.showError(error.descripcion);
            this.transactionForm.patchValue({ moneda: '' });
            this.monedaDescription.set('');
            return;
          }

          console.log('✅ Moneda validada:', moneda['nombre-mon']);
          this.monedaDescription.set(moneda['nombre-mon']);
        } else {
          console.log('⚠️ No se encontró la moneda');
          this.toastService.showError('No se encontró la moneda');
          this.transactionForm.patchValue({ moneda: '' });
          this.monedaDescription.set('');
        }
      },
      error: (error) => {
        console.error('❌ Error al validar moneda:', error);
        this.isLoadingMonedas.set(false);
        this.toastService.showError('Error al validar moneda');
        this.transactionForm.patchValue({ moneda: '' });
        this.monedaDescription.set('');
      }
    });
  }

  onMonedaKeyDown(event: Event): void {
    console.log('🚀 Ejecutando validación de moneda por Enter');
    event.preventDefault();
    this.validateMoneda();
  }

  onMonedaBlur(): void {
    console.log('👁️ Campo moneda perdió el foco - ejecutando validación');
    const monedaValue = this.transactionForm.get('moneda')?.value;

    if (monedaValue && monedaValue.trim() !== '') {
      this.validateMoneda();
    }
  }

  // Aplica Doc methods
  validateAplicaDoc(): void {
    // Evitar llamadas duplicadas si ya hay una validación en progreso
    if (this.isLoadingAplicaDoc()) {
      console.log('⚠️ Validación de aplicación documento ya en progreso, evitando llamada duplicada');
      return;
    }

    const aplicaDocValue = this.transactionForm.get('aplicDoc')?.value;
    const companiaValue = this.transactionForm.get('compania')?.value;
    const empresaValue = this.transactionForm.get('empresa')?.value;
    const documentoValue = this.transactionForm.get('documento')?.value;
    const tipoDocValue = this.transactionForm.get('tipoDoc')?.value;
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!aplicaDocValue) {
      console.log('⚠️ Aplicación documento no ingresada');
      return;
    }

    if (!companiaValue || !empresaValue || !documentoValue || !tipoDocValue || !currentUser || !currentUser.pcToken || !currentUser.pcLogin) {
      console.log('⚠️ Faltan datos requeridos para validar aplicación documento');
      this.toastService.showError('Faltan datos requeridos: compañía, empresa, documento o tipo documento no seleccionado');
      this.transactionForm.patchValue({ aplicDoc: '' });
      return;
    }

    this.isLoadingAplicaDoc.set(true);
    this.setAplicaDocLoading(true);
    this.companiasCxCService.validateAplicaDoc(
      companiaValue,
      empresaValue,
      aplicaDocValue,
      tipoDocValue,
      currentUser.pcLogin,
      pcSuper,
      currentUser.pcToken
    ).subscribe({
      next: (response: ApiResponse<AplicaDocCxC>) => {
        console.log('✅ Respuesta API GetLeaveAplicaDocCxC:', response);
        this.isLoadingAplicaDoc.set(false);
        this.setAplicaDocLoading(false);
        this.handleAplicaDocValidationResponse(response);
      },
      error: (error) => {
        console.error('❌ Error validating aplicación documento:', error);
        this.isLoadingAplicaDoc.set(false);
        this.setAplicaDocLoading(false);
        this.toastService.showError('Error al validar la aplicación documento');
      }
    });
  }

  private handleAplicaDocValidationResponse(response: ApiResponse<AplicaDocCxC>): void {
    console.log('📋 Procesando respuesta de validación de aplicación documento:', response);

    if (response.dsRespuesta && response.dsRespuesta['tAplicaDocCxC'] && response.dsRespuesta['tAplicaDocCxC'].length > 0) {
      const aplicaDoc = response.dsRespuesta['tAplicaDocCxC'][0];

      // Check for errors in the response
      if (aplicaDoc.terrores && aplicaDoc.terrores.length > 0) {
        // Show the first error message and clear the field
        const error = aplicaDoc.terrores[0];
        console.log('❌ Error en aplicación documento:', error);
        this.toastService.showError(error.descripcion);
        this.transactionForm.patchValue({ aplicDoc: '' });
        return;
      }

      console.log('✅ Aplicación documento validada:', aplicaDoc['num-doc']);
    } else {
      console.log('⚠️ No se encontró información de aplicación documento en la respuesta');
      this.toastService.showError('No se encontró información de aplicación documento');
      this.transactionForm.patchValue({ aplicDoc: '' });
    }
  }

  onAplicaDocKeyDown(event: Event): void {
    console.log('🚀 Ejecutando validación de aplicación documento por Enter');
    event.preventDefault();
    this.validateAplicaDoc();
  }

  onAplicaDocBlur(): void {
    console.log('👁️ Campo aplicación documento perdió el foco - ejecutando validación');
    this.validateAplicaDoc();
  }

  // Monto methods
  validateMonto(): void {
    // Evitar llamadas duplicadas si ya hay una validación en progreso
    if (this.isLoadingMonto()) {
      console.log('⚠️ Validación de monto ya en progreso, evitando llamada duplicada');
      return;
    }

    const montoValue = this.transactionForm.get('monto')?.value;
    const companiaValue = this.transactionForm.get('compania')?.value;
    const monedaValue = this.transactionForm.get('moneda')?.value;
    const tipoDocValue = this.transactionForm.get('tipoDoc')?.value;
    const fechaEmisionValue = this.transactionForm.get('emision')?.value;
    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);


    if (!montoValue) {
      console.log('⚠️ Monto no ingresado');
      return;
    }

    if (!companiaValue || !monedaValue || !tipoDocValue || !fechaEmisionValue || !currentUser || !currentUser.pcToken || !currentUser.pcLogin) {
      console.log('⚠️ Faltan datos requeridos para validar monto');
      this.toastService.showError('Faltan datos requeridos: compañía, moneda, tipo documento o fecha de emisión no seleccionado');
      this.transactionForm.patchValue({ monto: '' });
      return;
    }

    this.isLoadingMonto.set(true);
    this.setMontoLoading(true);
    this.companiasCxCService.validateMonto(
      companiaValue,
      monedaValue,
      tipoDocValue,
      fechaEmisionValue,
      montoValue.toString(),
      currentUser.pcLogin,
      pcSuper,
      currentUser.pcToken
    ).subscribe({
      next: (response: ApiResponse<MontoCxC>) => {
        console.log('✅ Respuesta API GetLeaveMontoCxC:', response);
        this.isLoadingMonto.set(false);
        this.setMontoLoading(false);
        this.handleMontoValidationResponse(response);
      },
      error: (error) => {
        console.error('❌ Error validating monto:', error);
        this.isLoadingMonto.set(false);
        this.setMontoLoading(false);
        this.toastService.showError('Error al validar el monto');
      }
    });
  }

  private handleMontoValidationResponse(response: ApiResponse<MontoCxC>): void {
    console.log('📋 Procesando respuesta de validación de monto:', response);

    if (response.dsRespuesta && response.dsRespuesta['tcchistorM'] && response.dsRespuesta['tcchistorM'].length > 0) {
      const monto = response.dsRespuesta['tcchistorM'][0];

      // Check for errors in the response
      if (monto.terrores && monto.terrores.length > 0) {
        // Show the first error message and clear the field
        const error = monto.terrores[0];
        console.log('❌ Error en monto:', error);
        this.toastService.showError(error.descripcion);
        this.transactionForm.patchValue({ monto: '' });
        return;
      }

      console.log('✅ Monto validado:', monto['monto-his']);
    } else {
      console.log('⚠️ No se encontró información de monto en la respuesta');
      this.toastService.showError('No se encontró información de monto');
      this.transactionForm.patchValue({ monto: '' });
    }
  }

  onMontoKeyDown(event: Event): void {
    console.log('🚀 Ejecutando validación de monto por Enter');
    event.preventDefault();
    this.validateMonto();
  }

  onMontoBlur(): void {
    console.log('👁️ Campo monto perdió el foco - ejecutando validación');
    this.validateMonto();
  }

  onFormKeyDown(event: KeyboardEvent): void {
    // Prevent form submission when Enter key is pressed
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
    }
  }

  // Section navigation
  goToSection(section: number): void {
    this.currentSection.set(section);
  }

  // Save methods for different sections
  saveSection1(): void {
    this.saveTransaction();
  }

  saveSection2(): void {
    this.saveContabilidad();
  }

  private saveContabilidad(): void {
    // Validar campos de la sección 2
    if (!this.isSection2Valid()) {
      const errors = this.getSection2Errors();
      this.toastService.showError('Por favor complete todos los campos requeridos de la sección 2');
      this.markSection2Touched();
      return;
    }

    const currentUser = this.authService.user();
    const pcSuper = String(currentUser?.pcSuper);

    if (!currentUser) {
      this.toastService.showError('No se pudo obtener la información del usuario actual');
      return;
    }

    // Mapear datos del formulario al JSON de contabilidad
    const contabilidadData = this.mapToContabilidadJSON();

    // Log específico para endpoint de sección 2
    const endpoint = `${environment.apiUrl}/UpdateContCxC?pcLogin=${currentUser.pcLogin}&pcSuper=${pcSuper}&pcToken=${currentUser.pcToken}`;
    console.log('ENDPOINT LOTE SECCION 2:', endpoint);
    console.log('JSON ENVIADO SECCION 2:', JSON.stringify(contabilidadData, null, 2));

    // Mostrar loading global
    this.loadingService.show('Guardando contabilidad...');

    this.companiasCxCService.updateContCxC(
      contabilidadData,
      currentUser.pcLogin || '',
      currentUser.pcToken || '',
      currentUser.pcSuper || ''
    ).subscribe({
      next: (response) => {
        this.toastService.showSuccess('Contabilidad guardada exitosamente');
        this.loadingService.hide();
        this.clearSection2Fields();

        // Simular Enter en el input lote para recargar datos de la tabla
        const companiaValue = this.transactionForm.get('compania')?.value;
        const fecPerValue = this.transactionForm.get('fechaPer')?.value;
        const loteValue = this.transactionForm.get('lote')?.value;

        if (companiaValue && fecPerValue && loteValue) {
          this.loadContabilidadData(companiaValue, fecPerValue, loteValue, currentUser);
        }
      },
      error: (error) => {
        this.toastService.showError('Error al guardar la contabilidad');
        this.loadingService.hide();
      }
    });
  }

  private mapToContabilidadJSON(): any {
    const formValue = this.transactionForm.value;
    const currentUser = this.authService.user();

    console.log("****DATOS CAPTURADOS SECCIÓN 2****");
    console.log(formValue);
    console.log("**********************************");

    // Determinar si es Debe o Haber y asignar el monto correspondiente
    const esDebe = formValue.debeHaber === '1';
    const montoDebe = esDebe ? (parseFloat(formValue.montoLinea) || 0.00) : 0.00;
    const montoHaber = esDebe ? 0.00 : (parseFloat(formValue.montoLinea) || 0.00);

    console.log("🔍 Mapeo de montos:");
    console.log("- debeHaber:", formValue.debeHaber);
    console.log("- montoLinea:", formValue.montoLinea);
    console.log("- esDebe:", esDebe);
    console.log("- montoDebe final:", montoDebe);
    console.log("- montoHaber final:", montoHaber);

    return {
      tccmovaut: [{
        "Agrega-Mova": "",
        "auxiliar": parseInt(formValue.auxiliar) || 0,
        "nombre-aux": this.auxiliarDescription() || "",
        "Cantid-Com": parseFloat(formValue.cantidad) || 0.000,
        "centro": parseInt(formValue.cCosto) || 0,
        "nombre-cen": this.cCostoDescription() || "",
        "cia": parseInt(formValue.compania) || 0,
        "nombre-cia": this.companiaDescription() || "",
        "ClasGxF": 0,
        "cuenta": formValue.cuenta || "",
        "nombre-cta": this.cuentaDescription() || "",
        "date-ctrl": new Date().toISOString().split('T')[0],
        "debcre-com": esDebe,
        "debe-com": montoDebe,
        "descri-com": formValue.descripcion || "",
        "estado-com": false,
        "fecha-com": formValue.fechaPer || "",
        "fecper-com": formValue.fechaPer || "",
        "haber-com": montoHaber,
        "login-ctrl": currentUser?.pcLogin || "",
        "monext-com": parseFloat(formValue.montoOtra) || 0.00,
        "Monfasb-Com": 0.00,
        "monto-com": parseFloat(formValue.montoLinea) || 0.00,
        "numero-com": parseInt(formValue.lote) || 0,
        "proced-com": "T",
        "refere-com": formValue.referencia || "",
        "secuen-com": 1,
        "text-com": "",
        "tipcom": 0,
        "ubicacion": parseInt(formValue.ubicacion) || 0,
        "nombre-ubic": this.ubicacionDescription() || "",
        "utilfon": parseInt(formValue.uFondo) || 0,
        "nombre-ufon": this.uFondoDescription() || "",
        "monto-debe": montoDebe,
        "monto-haber": montoHaber,
        "monto-diferencia": montoDebe - montoHaber,
        "tparent": currentUser?.pcLogin || ""
      }]
    };
  }

  private isSection2Valid(): boolean {
    console.log('🔍 === VALIDANDO SECCIÓN 2 ===');
    const requiredFields = ['compania', 'fechaPer', 'lote', 'cuenta', 'auxiliar', 'ubicacion', 'cCosto', 'uFondo', 'montoLinea', 'montoOtra'];

    console.log('📋 Campos requeridos:', requiredFields);

    const validationResults = requiredFields.map(field => {
      const control = this.transactionForm.get(field);
      const value = control?.value;
      const isValid = value !== null && value !== undefined && value !== '';

      console.log(`  ${field}:`, {
        value: value,
        isValid: isValid,
        controlExists: !!control,
        controlValid: control?.valid,
        controlTouched: control?.touched
      });

      return isValid;
    });

    const allValid = validationResults.every(result => result);
    console.log('✅ Validación general:', allValid);

    return allValid;
  }

  private getSection2Errors(): string[] {
    console.log('❌ === OBTENIENDO ERRORES DE SECCIÓN 2 ===');
    const errors: string[] = [];
    const requiredFields = ['compania', 'fechaPer', 'lote', 'cuenta', 'auxiliar', 'ubicacion', 'cCosto', 'uFondo', 'montoLinea', 'montoOtra'];

    requiredFields.forEach(field => {
      const control = this.transactionForm.get(field);
      const value = control?.value;
      const isInvalid = control && (control.invalid || !value);

      console.log(`  ${field}:`, {
        value: value,
        controlExists: !!control,
        controlInvalid: control?.invalid,
        hasValue: !!value,
        isInvalid: isInvalid
      });

      if (isInvalid) {
        errors.push(field);
      }
    });

    console.log('🚨 Campos con errores:', errors);
    return errors;
  }

  private markSection2Touched(): void {
    const section2Fields = ['compania', 'fechaPer', 'lote', 'cuenta', 'auxiliar', 'ubicacion', 'cCosto', 'uFondo', 'montoLinea', 'montoOtra'];
    section2Fields.forEach(field => {
      this.transactionForm.get(field)?.markAsTouched();
    });
  }

  private clearSection2Fields(): void {
    console.log('🧹 Limpiando campos de la sección 2');
    this.transactionForm.patchValue({
      cuenta: '',
      auxiliar: '',
      ubicacion: '',
      cCosto: '',
      uFondo: '',
      montoDebe: '',
      montoHaber: ''
    });

    // Limpiar descripciones
    this.cuentaDescription.set('');
    this.auxiliarDescription.set('');
    this.ubicacionDescription.set('');
    this.cCostoDescription.set('');
    this.uFondoDescription.set('');

    console.log('✅ Campos de la sección 2 limpiados');
  }

  // Clear methods for different sections
  clearSection1(): void {
    console.log('🧹 === LIMPIANDO SECCIÓN 1 ===');
    this.clearSection1Fields();
  }

  clearSection2(): void {
    console.log('🧹 === LIMPIANDO SECCIÓN 2 ===');
    this.clearSection2Fields();
  }

  // Print methods for different sections
  printSection1(): void {
    console.log('🖨️ === IMPRIMIENDO SECCIÓN 1 ===');
    // TODO: Implementar impresión de sección 1
  }

  printSection2(): void {
    console.log('🖨️ === IMPRIMIENDO SECCIÓN 2 ===');
    // TODO: Implementar impresión de sección 2
  }

  // Delete methods for different sections
  deleteSection1(): void {
    console.log('🗑️ === ELIMINANDO SECCIÓN 1 ===');
    // TODO: Implementar eliminación de sección 1
  }

  deleteSection2(): void {
    console.log('🗑️ === ELIMINANDO SECCIÓN 2 ===');
    // TODO: Implementar eliminación de sección 2
  }
}
