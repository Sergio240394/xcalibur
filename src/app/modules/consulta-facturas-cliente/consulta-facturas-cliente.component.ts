import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CompaniesService, SearchItem } from '../../core/services/companies.service';
import { EmpresasService } from '../../core/services/empresas.service';
import { DocumentTypesService } from '../../core/services/document-types.service';
import { VendedoresService, VendedorItem } from '../../core/services/vendedores.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { CollapsibleSectionComponent } from '../../shared/components/collapsible-section/collapsible-section.component';
import { environment } from '../../../environments/environment';

// Usar la interfaz FacturaData del archivo de interfaces
import { FacturaData } from '../../core/interfaces/auth.interface';

// SearchItem interface is now imported from the service

@Component({
  selector: 'app-consulta-facturas-cliente',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, HttpClientModule, CollapsibleSectionComponent],
  templateUrl: './consulta-facturas-cliente.component.html',
  styleUrls: ['./consulta-facturas-cliente.component.css']
})
export class ConsultaFacturasClienteComponent implements OnInit {
  public readonly facturaForm: FormGroup;
  public readonly showPopup = signal<boolean>(false);
  public readonly popupTitle = signal<string>('');
  public searchTerm: string = '';
  public readonly currentPopupType = signal<string>('');

  // Empty array for clean start
  public readonly facturas = signal<FacturaData[]>([]);

  // Signals for field descriptions
  public readonly companiaDescription = signal<string>('');
  public readonly empresaDescription = signal<string>('');
  public readonly tipoDescription = signal<string>('');
  public readonly socioDescription = signal<string>('');
  public readonly gerenteDescription = signal<string>('');

  public readonly filteredItems = signal<SearchItem[]>([]);
  public readonly isLoading = signal<boolean>(false);
  public readonly allCompanies = signal<SearchItem[]>([]);
  public readonly allEmpresas = signal<SearchItem[]>([]);
  public readonly allDocumentTypes = signal<SearchItem[]>([]);
  public readonly allVendedores = signal<VendedorItem[]>([]);
  public readonly allGerentes = signal<VendedorItem[]>([]);

  // empresas will now be loaded from API

  private readonly tipos: SearchItem[] = [
    { codigo: '1', descripcion: 'FACTURA DE VENTA' },
    { codigo: '2', descripcion: 'NOTA CRÉDITO' },
    { codigo: '3', descripcion: 'NOTA DÉBITO' }
  ];

  // socios ahora se cargarán desde la API

  // gerentes ahora se cargarán desde la API (mismo endpoint que socios)

  constructor(
    private fb: FormBuilder,
    private companiesService: CompaniesService,
    private empresasService: EmpresasService,
    private documentTypesService: DocumentTypesService,
    private vendedoresService: VendedoresService,
    private authService: AuthService,
    private toastService: ToastService,
    private http: HttpClient
  ) {
    this.facturaForm = this.fb.group({
      compania: ['', Validators.required],
      empresa: [''],
      tipo: [''],
      socio: [''],
      gerente: [''],
      fechaDesde: [''],
      fechaHasta: [''],
      factura: ['', Validators.required],
      saldo: ['0.00'],
      saldoExt: ['0.00']
    });
  }

  ngOnInit(): void {
    // Initialize form with default values
    this.calculateSaldo();
  }

  public onSubmit(): void {
    if (this.facturaForm.valid) {
      console.log('Formulario enviado:', this.facturaForm.value);
      // Here you would typically make an API call
      this.performSearch();
    } else {
      console.log('Formulario inválido');
      this.markFormGroupTouched();

      // Show specific field errors
      const fieldErrors: string[] = [];
      const fieldNames: { [key: string]: string } = {
        compania: 'Compañía',
        empresa: 'Empresa',
        tipo: 'Tipo',
        socio: 'Socio',
        gerente: 'Gerente',
        factura: 'Factura'
      };

      Object.keys(this.facturaForm.controls).forEach(key => {
        const control = this.facturaForm.get(key);
        if (control && control.errors && control.errors['required']) {
          fieldErrors.push(fieldNames[key] || key);
        }
      });

      if (fieldErrors.length > 0) {
        console.log(`Campos requeridos faltantes: ${fieldErrors.join(', ')}`);
      }
    }
  }

  public onClear(): void {
    this.facturaForm.patchValue({
      compania: '',
      empresa: '',
      tipo: '',
      socio: '',
      gerente: '',
      fechaDesde: '',
      fechaHasta: '',
      factura: '',
      saldo: '0.00',
      saldoExt: '0.00'
    });

    // Limpiar las descripciones
    this.companiaDescription.set('');
    this.empresaDescription.set('');
    this.tipoDescription.set('');
    this.socioDescription.set('');
    this.gerenteDescription.set('');

    this.calculateSaldo();
  }

  public onReport(): void {
    console.log('Generando reporte por pantalla...');
    // Here you would typically generate a report
  }


  public openPopup(type: string): void {
    this.currentPopupType.set(type);
    this.showPopup.set(true);
    this.searchTerm = '';

    switch (type) {
      case 'compania':
        this.popupTitle.set('Seleccionar Compañía');
        this.loadCompanies();
        break;
      case 'empresa':
        this.popupTitle.set('Seleccionar Empresa');
        this.loadEmpresas();
        break;
      case 'tipo':
        console.log('🔍 Abriendo modal de tipos de documento - Registros disponibles:', this.tipos);
        this.popupTitle.set('Seleccionar Tipo de Documento');
        this.loadDocumentTypes();
        break;
      case 'socio':
        console.log('🔍 Abriendo modal de socios - Llamando endpoint GetCEVendedor');
        this.popupTitle.set('Seleccionar Socio');
        this.loadVendedores();
        break;
      case 'gerente':
        console.log('🔍 Abriendo modal de gerentes - Llamando endpoint GetCEVendedor');
        this.popupTitle.set('Seleccionar Gerente');
        this.loadGerentes();
        break;
    }
  }

  public closePopup(): void {
    this.showPopup.set(false);
    this.searchTerm = '';
    this.currentPopupType.set('');
  }

  public selectItem(item: SearchItem): void {
    const popupType = this.currentPopupType();

    switch (popupType) {
      case 'compania':
        this.facturaForm.patchValue({ compania: item.codigo });
        this.companiaDescription.set(item.descripcion);
        break;
      case 'empresa':
        this.facturaForm.patchValue({ empresa: item.codigo });
        this.empresaDescription.set(item.descripcion);
        break;
      case 'tipo':
        this.facturaForm.patchValue({ tipo: item.codigo });
        this.tipoDescription.set(item.descripcion);
        break;
      case 'socio':
        console.log('✅ Socio seleccionado:', item);
        this.facturaForm.patchValue({ socio: item.codigo });
        this.socioDescription.set(item.descripcion);
        break;
      case 'gerente':
        console.log('✅ Gerente seleccionado:', item);
        this.facturaForm.patchValue({ gerente: item.codigo });
        this.gerenteDescription.set(item.descripcion);
        break;
    }

    this.closePopup();
  }

  private performSearch(): void {
    console.log('🔍 === INICIANDO CONSULTA DE FACTURA ===');
    console.log('📋 Formulario válido:', this.facturaForm.valid);
    console.log('📋 Valores del formulario:', this.facturaForm.value);

    const currentUser = this.authService.user();
    console.log('👤 Usuario actual:', {
      hasUser: !!currentUser,
      pcLogin: currentUser?.pcLogin,
      pcToken: currentUser?.pcToken ? currentUser.pcToken.substring(0, 10) + '...' : 'No token',
      pcSuper: currentUser?.pcSuper
    });

    if (!currentUser || !currentUser.pcToken || !currentUser.pcLogin || currentUser.pcSuper === undefined) {
      console.error('❌ No hay datos de autenticación disponibles');
      return;
    }

    const formData = this.facturaForm.value;
    const request = {
      pcCompania: formData.compania || '',
      pcEmpresa: formData.empresa || '',
      pcTipo: formData.tipo || '',
      pcSocio: formData.socio || '',
      pcGerente: formData.gerente || '',
      pcFactura: formData.factura || '',
      pcLogin: currentUser.pcLogin,
      pcSuper: currentUser.pcSuper.toString(),
      pcToken: currentUser.pcToken
    };

    console.log('📤 === DATOS ENVIADOS AL ENDPOINT ===');
    console.log('📤 URL del endpoint:', `${environment.apiUrl}/GetFactura`);
    console.log('📤 Parámetros de la petición:', {
      pcCompania: request.pcCompania,
      pcEmpresa: request.pcEmpresa,
      pcTipo: request.pcTipo,
      pcSocio: request.pcSocio,
      pcGerente: request.pcGerente,
      pcFactura: request.pcFactura,
      pcLogin: request.pcLogin,
      pcSuper: request.pcSuper,
      pcToken: request.pcToken.substring(0, 10) + '...' // Solo mostrar parte del token por seguridad
    });

    // Construir URL completa con parámetros - solo enviar los que tienen valores
    const urlParams = new URLSearchParams();

    // Parámetros obligatorios siempre se envían
    urlParams.append('pcCompania', request.pcCompania);
    urlParams.append('pcFactura', request.pcFactura);
    urlParams.append('pcLogin', request.pcLogin);
    urlParams.append('pcSuper', request.pcSuper);
    urlParams.append('pcToken', request.pcToken);

    // Parámetros opcionales solo si tienen valores
    if (request.pcEmpresa && request.pcEmpresa.trim() !== '') {
      urlParams.append('pcEmpresa', request.pcEmpresa);
    }
    if (request.pcTipo && request.pcTipo.trim() !== '') {
      urlParams.append('pcTipo', request.pcTipo);
    }
    if (request.pcSocio && request.pcSocio.trim() !== '') {
      urlParams.append('pcSocio', request.pcSocio);
    }
    if (request.pcGerente && request.pcGerente.trim() !== '') {
      urlParams.append('pcGerente', request.pcGerente);
    }

    const fullUrl = `${environment.apiUrl}/GetFactura?${urlParams.toString()}`;
    console.log('📤 URL completa con parámetros:', fullUrl);
    console.log('📤 Timestamp de envío:', new Date().toISOString());

    // ===== URL EXACTA DEL ENDPOINT =====
    console.log('🌐 URL EXACTA ENVIADA:', fullUrl);
    // ====================================

    // Realizar llamada real a la API
    this.http.get(fullUrl).subscribe({
      next: (response: any) => {
        console.log('📥 === RESPUESTA RECIBIDA DEL ENDPOINT ===');
        console.log('📥 Respuesta completa del servidor:', JSON.stringify(response, null, 2));
        console.log('📥 Tipo de respuesta:', typeof response);
        console.log('📥 Estructura de la respuesta:', {
          hasDsRespuesta: !!response.dsRespuesta,
          hasTcchistor: !!response.dsRespuesta?.tcchistor,
          tcchistorLength: response.dsRespuesta?.tcchistor?.length || 0
        });
        console.log('📥 Timestamp de recepción:', new Date().toISOString());

        // Verificar si hay errores en la respuesta
        const hasErrors = this.checkForErrors(response.dsRespuesta.tcchistor);

        if (hasErrors) {
          // Si hay errores, no actualizar facturas y mostrar toast de warning
          this.facturas.set([]);
        } else {
          // Si no hay errores, actualizar facturas y mostrar toast de éxito
          this.facturas.set(response.dsRespuesta.tcchistor);

          // Mostrar toast de éxito si se encontraron facturas
          if (this.facturas().length > 0) {
            this.toastService.showSuccess(`Se encontraron ${this.facturas().length} factura(s) para el cliente seleccionado`);
          }
        }

        this.calculateSaldo();
      },
      error: (error) => {
        console.error('❌ Error en la consulta de facturas:', error);
        this.facturas.set([]);
        this.toastService.showError('Error al consultar las facturas. Por favor, intente nuevamente.');
        this.calculateSaldo();
      }
    });
  }

  /**
   * Verifica si hay errores en la respuesta del endpoint
   * @param tcchistor Array de facturas de la respuesta
   * @returns true si hay errores, false si no
   */
  private checkForErrors(tcchistor: any[]): boolean {
    if (!tcchistor || tcchistor.length === 0) {
      return false;
    }

    // Verificar si algún elemento tiene errores
    for (const item of tcchistor) {
      if (item.terrores && Array.isArray(item.terrores) && item.terrores.length > 0) {
        // Mostrar toast de warning con el primer error encontrado
        const firstError = item.terrores[0];
        const errorMessage = firstError.descripcion || 'Error desconocido';

        this.toastService.showWarning(errorMessage);
        return true;
      }
    }

    return false;
  }

  private calculateSaldo(): void {
    // Calculate total balance from facturas using correct property names
    const totalSaldo = this.facturas().reduce((sum, factura) => sum + (factura['saldo-doc'] || 0), 0);
    const totalSaldoExt = this.facturas().reduce((sum, factura) => sum + (factura['salext'] || 0), 0);

    this.facturaForm.patchValue({
      saldo: totalSaldo.toFixed(2),
      saldoExt: totalSaldoExt.toFixed(2)
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.facturaForm.controls).forEach(key => {
      const control = this.facturaForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Carga los tipos de documento desde la API
   */
  private loadDocumentTypes(): void {
    const currentUser = this.authService.user();
    const companiaValue = this.facturaForm.get('compania')?.value;

    if (!currentUser || !currentUser.pcToken) {
      console.error('❌ No user authentication data available for document types:', {
        hasUser: !!currentUser,
        hasToken: !!currentUser?.pcToken
      });
      this.filteredItems.set([]);
      return;
    }

    if (!companiaValue) {
      console.error('❌ No company selected for document types:', {
        companiaValue: companiaValue
      });
      this.filteredItems.set([]);
      return;
    }

    this.isLoading.set(true);

    console.log('🚀 Calling document types API with parameters:', {
      pcCompania: companiaValue,
      pcToken: currentUser.pcToken,
      timestamp: new Date().toISOString()
    });

    this.documentTypesService.getDocumentTypes(companiaValue, currentUser.pcToken).subscribe({
      next: (documentTypes) => {
        console.log('📊 Processing document types data:', {
          documentTypesLength: documentTypes.length,
          firstDocumentType: documentTypes[0],
          timestamp: new Date().toISOString()
        });

        this.allDocumentTypes.set(documentTypes);
        this.filteredItems.set(documentTypes);
        this.isLoading.set(false);

        console.log('✅ Document types loaded successfully:', {
          allDocumentTypesLength: this.allDocumentTypes().length,
          filteredItemsLength: this.filteredItems().length,
          isLoading: this.isLoading()
        });
      },
      error: (error) => {
        console.error('❌ Error loading document types:', error);
        this.filteredItems.set([]);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Carga las empresas desde la API
   */
  private loadEmpresas(): void {
    const currentUser = this.authService.user();
    const companiaValue = this.facturaForm.get('compania')?.value;

    if (!currentUser || !currentUser.pcLogin || currentUser.pcSuper === undefined) {
      console.error('❌ No user authentication data available for empresas:', {
        hasUser: !!currentUser,
        hasLogin: !!currentUser?.pcLogin,
        hasSuper: currentUser?.pcSuper !== undefined,
        pcSuper: currentUser?.pcSuper
      });
      this.filteredItems.set([]);
      return;
    }

    if (!companiaValue) {
      console.error('❌ No company selected for empresas:', {
        companiaValue: companiaValue
      });
      this.filteredItems.set([]);
      return;
    }

    this.isLoading.set(true);

    console.log('🚀 Calling empresas API with parameters:', {
      pcCompania: companiaValue,
      pcLogin: currentUser.pcLogin,
      pcSuper: currentUser.pcSuper,
      timestamp: new Date().toISOString()
    });

    this.empresasService.getEmpresas(companiaValue, currentUser.pcLogin, currentUser.pcSuper, currentUser.pcToken || '').subscribe({
      next: (empresas) => {
        console.log('📊 Processing empresas data:', {
          empresasLength: empresas.length,
          firstEmpresa: empresas[0],
          timestamp: new Date().toISOString()
        });

        this.allEmpresas.set(empresas);
        this.filteredItems.set(empresas);
        this.isLoading.set(false);

        console.log('✅ Empresas loaded successfully:', {
          allEmpresasLength: this.allEmpresas().length,
          filteredItemsLength: this.filteredItems().length,
          isLoading: this.isLoading()
        });
      },
      error: (error) => {
        console.error('❌ Error loading empresas:', error);
        this.filteredItems.set([]);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Carga los vendedores desde la API
   */
  private loadVendedores(): void {
    const currentUser = this.authService.user();
    const companiaValue = this.facturaForm.get('compania')?.value;

    if (!currentUser || !currentUser.pcToken || !currentUser.pcLogin || currentUser.pcSuper === undefined) {
      console.error('❌ No user authentication data available for vendedores:', {
        hasUser: !!currentUser,
        hasToken: !!currentUser?.pcToken,
        hasLogin: !!currentUser?.pcLogin,
        hasSuper: currentUser?.pcSuper !== undefined,
        pcSuper: currentUser?.pcSuper
      });
      this.filteredItems.set([]);
      return;
    }

    if (!companiaValue) {
      console.error('❌ No company selected for vendedores:', {
        companiaValue: companiaValue
      });
      this.filteredItems.set([]);
      return;
    }

    this.isLoading.set(true);

    console.log('🚀 Calling vendedores API with parameters:', {
      pcCompania: companiaValue,
      pcLogin: currentUser.pcLogin,
      pcSuper: currentUser.pcSuper,
      pcToken: currentUser.pcToken.substring(0, 10) + '...',
      timestamp: new Date().toISOString()
    });

    this.vendedoresService.getVendedores(companiaValue, currentUser.pcLogin, currentUser.pcSuper, currentUser.pcToken).subscribe({
      next: (vendedores) => {
        console.log('📊 Processing vendedores data:', {
          vendedoresLength: vendedores.length,
          firstVendedor: vendedores[0],
          timestamp: new Date().toISOString()
        });

        this.allVendedores.set(vendedores);
        this.filteredItems.set(vendedores);
        this.isLoading.set(false);

        console.log('✅ Vendedores loaded successfully:', {
          allVendedoresLength: this.allVendedores().length,
          filteredItemsLength: this.filteredItems().length,
          isLoading: this.isLoading()
        });
      },
      error: (error) => {
        console.error('❌ Error loading vendedores:', error);
        this.filteredItems.set([]);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Carga los gerentes desde la API (mismo endpoint que vendedores)
   */
  private loadGerentes(): void {
    const currentUser = this.authService.user();
    const companiaValue = this.facturaForm.get('compania')?.value;

    if (!currentUser || !currentUser.pcToken || !currentUser.pcLogin || currentUser.pcSuper === undefined) {
      console.error('❌ No user authentication data available for gerentes:', {
        hasUser: !!currentUser,
        hasToken: !!currentUser?.pcToken,
        hasLogin: !!currentUser?.pcLogin,
        hasSuper: currentUser?.pcSuper !== undefined,
        pcSuper: currentUser?.pcSuper
      });
      this.filteredItems.set([]);
      return;
    }

    if (!companiaValue) {
      console.error('❌ No company selected for gerentes:', {
        companiaValue: companiaValue
      });
      this.filteredItems.set([]);
      return;
    }

    this.isLoading.set(true);

    console.log('🚀 Calling gerentes API with parameters:', {
      pcCompania: companiaValue,
      pcLogin: currentUser.pcLogin,
      pcSuper: currentUser.pcSuper,
      pcToken: currentUser.pcToken.substring(0, 10) + '...',
      timestamp: new Date().toISOString()
    });

    this.vendedoresService.getVendedores(companiaValue, currentUser.pcLogin, currentUser.pcSuper, currentUser.pcToken).subscribe({
      next: (gerentes) => {
        console.log('📊 Processing gerentes data:', {
          gerentesLength: gerentes.length,
          firstGerente: gerentes[0],
          timestamp: new Date().toISOString()
        });

        this.allGerentes.set(gerentes);
        this.filteredItems.set(gerentes);
        this.isLoading.set(false);

        console.log('✅ Gerentes loaded successfully:', {
          allGerentesLength: this.allGerentes().length,
          filteredItemsLength: this.filteredItems().length,
          isLoading: this.isLoading()
        });
      },
      error: (error) => {
        console.error('❌ Error loading gerentes:', error);
        this.filteredItems.set([]);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Carga las compañías desde la API
   */
  private loadCompanies(): void {
    const currentUser = this.authService.user();
    if (!currentUser || !currentUser.pcLogin || currentUser.pcSuper === undefined) {
      console.error('❌ No user authentication data available for companies:', {
        hasUser: !!currentUser,
        hasLogin: !!currentUser?.pcLogin,
        hasSuper: currentUser?.pcSuper !== undefined,
        pcSuper: currentUser?.pcSuper
      });
      this.filteredItems.set([]);
      return;
    }

    this.isLoading.set(true);
    this.companiesService.getCompanies(currentUser.pcLogin, currentUser.pcSuper).subscribe({
      next: (companies) => {
        console.log('📊 Processing companies data:', {
          companiesLength: companies.length,
          firstCompany: companies[0],
          timestamp: new Date().toISOString()
        });

        this.allCompanies.set(companies);
        this.filteredItems.set(companies);
        this.isLoading.set(false);

        console.log('✅ Companies loaded successfully:', {
          allCompaniesLength: this.allCompanies().length,
          filteredItemsLength: this.filteredItems().length,
          isLoading: this.isLoading()
        });
      },
      error: (error) => {
        console.error('❌ Error loading companies:', error);
        this.filteredItems.set([]);
        this.isLoading.set(false);
      }
    });
  }

  /**
   * Filtra los elementos basado en el término de búsqueda
   */
  public onSearch(): void {
    const popupType = this.currentPopupType();

    if (popupType === 'compania' && this.allCompanies().length > 0) {
      const filtered = this.companiesService.filterCompanies(
        this.allCompanies(),
        this.searchTerm
      );
      this.filteredItems.set(filtered);
      console.log('🔍 Filtered companies:', filtered.length);
    } else if (popupType === 'empresa' && this.allEmpresas().length > 0) {
      const filtered = this.empresasService.filterEmpresas(
        this.allEmpresas(),
        this.searchTerm
      );
      this.filteredItems.set(filtered);
      console.log('🔍 Filtered empresas:', filtered.length);
    } else if (popupType === 'tipo' && this.allDocumentTypes().length > 0) {
      const filtered = this.documentTypesService.filterDocumentTypes(
        this.allDocumentTypes(),
        this.searchTerm
      );
      this.filteredItems.set(filtered);
      console.log('🔍 Filtered document types:', filtered.length);
    } else if (popupType === 'socio' && this.allVendedores().length > 0) {
      const filtered = this.vendedoresService.filterVendedores(
        this.allVendedores(),
        this.searchTerm
      );
      this.filteredItems.set(filtered);
      console.log('🔍 Filtered vendedores:', filtered.length);
    } else if (popupType === 'gerente' && this.allGerentes().length > 0) {
      const filtered = this.vendedoresService.filterVendedores(
        this.allGerentes(),
        this.searchTerm
      );
      this.filteredItems.set(filtered);
      console.log('🔍 Filtered gerentes:', filtered.length);
    }
  }
}
