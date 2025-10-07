import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface CompaniaCxC {
  'Agrega-Cias': string;
  cia: number;
  ClaveResolucion: string;
  'date-ctrl': string;
  'direc-cia': string;
  DS_BRANCH_ID: string;
  DS_ClaveResolucion: number;
  DS_FechaFinResolucion: string;
  DS_FechaIniResolucion: string;
  DS_MatMercantil: string;
  DS_NroResolucionDian: string;
  DS_Prefijo: string;
  DS_RangoFinResolucion: number;
  DS_RangoIniResolucion: number;
  'fax-cia': string;
  FechaFinResolucion: string;
  FechaIniResolucion: string;
  'login-ctrl': string;
  MatMercantil: string;
  nit: string;
  'nombre-cia': string;
  'nomrep-cia': string;
  NroResolucionDian: string;
  ObserParametros: string;
  Prefijo01: string;
  Prefijo02: string;
  Prefijo03: string;
  RangoFinResolucion: number;
  RangoIniResolucion: number;
  Resolucion01: string;
  Resolucion03: string;
  Resolucion04: string;
  Resolucion05: string;
  'rif-cia': string;
  RutaFormatos: string;
  'telefo-cia': string;
  'telex-cia': string;
  'text-cia': string;
  'zonpos-cia': string;
  'fecperi-his': string | null;
  'fecmov-his': string | null;
  cuadre: boolean;
  tparent: string;
}

export interface FechaPeriodoCxC {
  cia: number | null;
  'login-ctrl': string;
  'nombre-cia': string;
  'fecperi-his': string | null;
  tparent: string;
  terrores?: {
    codigo: string;
    descripcion: string;
    tPARENT: string;
  }[];
}

export interface LoteCxC {
  agencia: number;
  'Agrega-Hist': string;
  'apldoc-his': number;
  'autret-his': number;
  'basiva-his': number;
  cia: number;
  'nombre-cia': string;
  cobrador: number;
  'coddes-his': number;
  'codigo-cob1': number;
  'codigo-cob2': number;
  'codigo-cob3': number;
  'codigo-cob4': number;
  'codigo-cob5': number;
  'codrec-his': number;
  'codret-his': number;
  'costo-his': number;
  'cuenta-his': string;
  'date-ctrl': string;
  'desiva-his': number;
  empresa: number;
  'nombre-emp': string;
  'estado-his': boolean;
  'fecmov-his': string;
  'fecperi-his': string;
  'fecven-his': string;
  'login-ctrl': string;
  'lote-his': number;
  'mondes-his': number;
  Moneda: number;
  'monext-his': number;
  'monica-his': number;
  'monrec-his': number;
  'monret-his': number;
  'monto-his': number;
  'numdoc-his': number;
  'numrec-his': number;
  'proced-his': string;
  produc: number;
  'refere-his': number;
  'secuen-his': number;
  'text-his': string;
  tipcomi: number;
  tipoconce: number;
  tipodoc: number;
  'nombre-tdoc': string;
  vendedor: number;
  'nombre-vend': string;
  ventel: number;
  zona: number;
  'monto-debe': number;
  'monto-haber': number;
  'monto-diferencia': number;
  tparent: string;
  terrores?: {
    codigo: string;
    descripcion: string;
    tPARENT: string;
  }[];
}

export interface EmpresaCxC {
  'abrenom-emp': string;
  'Agrega-Empr': string;
  'bacord-emp': boolean;
  'cappag-emp': number;
  'capsus-emp': number;
  'causa-susp': number;
  cia: number;
  ciudad: string;
  clacob: string;
  claven: string;
  cobrador: number;
  'codigo-cob1': number;
  'codigo-cob2': number;
  'codigo-cob3': number;
  'codigo-cob4': number;
  'codigo-cob5': number;
  'condpago': number;
  'contri-emp': number;
  'date-ctrl': string;
  'diacaj-emp': number;
  'direc-emp': string;
  'dirent-emp': string;
  'email-emp': string;
  empresa: number;
  'fax-emp': string;
  'fecauli-emp': string | null;
  'fecing-emp': string;
  'fecmdreg-emp': string | null;
  'fecreg-emp': string | null;
  'limite-emp': number;
  localidad: number;
  'login-ctrl': string;
  moneda: number;
  negocio: number;
  nit: string;
  'nombre-emp': string;
  'nomcon-emp': string;
  pais: string;
  'pordes-emp': number;
  'razsoc-emp': string;
  'regmer-emp': string;
  'rif-emp': string;
  ruta: number;
  sector: number;
  'secuen-emp': number;
  'telefo-emp': string;
  'telex-emp': string;
  'text-emp': string;
  'tipocli': number;
  'tippre-emp': number;
  transporte: number;
  vendedor: number;
  zona: number;
  'zonpos-emp': string;
  tparent: string;
  terrores?: {
    codigo: string;
    descripcion: string;
    tPARENT: string;
  }[];
}

export interface TipoDocCxC {
  'afecxc-tdoc': boolean;
  'afeinv-tdoc': boolean;
  'afesta-tdoc': boolean;
  'Agrega-Tipd': string | null;
  auxiliarm1: number;
  centrom1: number;
  cia: number;
  'nombre-cia': string;
  'clase-tdoc': number;
  cuentam1: string;
  'date-ctrl': string;
  'login-ctrl': string;
  'nombre-tdoc': string;
  'numfac-tdoc': number;
  'numped-tdoc': number;
  'profac-tdoc': number;
  'siglas-tdoc': string;
  'text-tdoc': string;
  tipcomi: number;
  tipodoc: number;
  ubicacionm1: number;
  'saldo-doc': number;
  'fecemi-doc': string | null;
  'fecven-doc': string | null;
  descripcion: string;
  tparent: string;
  terrores?: {
    codigo: string;
    descripcion: string;
    tPARENT: string;
  }[];
}

export interface DocumentoCxC {
  agencia: number;
  'Agrega-Docu': string;
  'aplica-doc': number;
  'autret-doc': number;
  'banco-doc': number;
  'basiva-doc': number;
  Centro: number;
  cia: number;
  'nombre-cia': string;
  'comisi-doc': number;
  'date-ctrl': string | null;
  'desiva-doc': number;
  empresa: number;
  'fecemi-doc': string;
  'fecpres-doc': string | null;
  'fecven-doc': string;
  'login-ctrl': string;
  moneda: number;
  'monext-doc': number;
  'monica-doc': number;
  'monori-doc': number;
  'monrec-doc': number;
  'monret-doc': number;
  'num-doc': number;
  produc: number;
  'saldo-doc': number;
  'salext-doc': number;
  'sitgir-doc': number;
  'text-doc': string;
  tipcomi: number;
  tipodoc: number;
  'vecpres-doc': number;
  vendedor: number;
  ventel: number;
  zona: number;
  tparent: string;
  terrores?: {
    codigo: string;
    descripcion: string;
    tPARENT: string;
  }[];
}

export interface FechaEmisionCxC {
  cia: number;
  'login-ctrl': string;
  'nombre-cia': string;
  'fecmov-his': string;
  'fecven-his': string;
  tparent: string;
  terrores?: {
    codigo: string;
    descripcion: string;
    tPARENT: string;
  }[];
}

export interface FechaVencimientoCxC {
  cia: number;
  'login-ctrl': string;
  'nombre-cia': string;
  'fecmov-his': string;
  'fecven-his': string;
  tparent: string;
  terrores?: {
    codigo: string;
    descripcion: string;
    tPARENT: string;
  }[];
}

export interface AplicaDocCxC {
  cia: number;
  'login-ctrl': string;
  'nombre-cia': string;
  empresa: number;
  tipodoc: number;
  'nombre-tdoc': string;
  'num-doc': number;
  tparent: string;
  terrores?: {
    codigo: string;
    descripcion: string;
    tPARENT: string;
  }[];
}

export interface MontoCxC {
  cia: number;
  'nombre-cia': string;
  'basiva-his': number;
  'desiva-his': number;
  'login-ctrl': string;
  Moneda: number;
  'monext-his': number;
  'monto-his': number;
  zona: number;
  tparent: string;
  terrores?: {
    codigo: string;
    descripcion: string;
    tPARENT: string;
  }[];
}

export interface ApiResponse<T> {
  dsRespuesta: {
    [key: string]: T[];
  };
  errores?: {
    descripcion: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class CompaniasCxCService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene las compañías disponibles para el usuario
   * @param pcLogin Login del usuario
   * @param pcSuper Super usuario
   * @param pcToken Token de autenticación
   * @returns Observable con la lista de compañías
   */
  getCompanias(pcLogin: string, pcSuper: string, pcToken: string): Observable<ApiResponse<CompaniaCxC>> {
    const params = new HttpParams()
      .set('pcLogin', pcLogin)
      .set('pcSuper', pcSuper)
      .set('pcToken', pcToken);

    const url = `${this.baseUrl}/GetCEGEciasCxC`;
    const fullUrl = `${url}?pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;
    console.log('🌐 URL COMPLETA GetCEGEciasCxC:', fullUrl);

    return this.http.get<ApiResponse<CompaniaCxC>>(url, { params });
  }

  /**
   * Valida una compañía específica
   * @param pcCompania Código de la compañía
   * @param pcEmpresa Código de la empresa
   * @param pcLogin Login del usuario
   * @param pcSuper Super usuario
   * @param pcToken Token de autenticación
   * @returns Observable con la respuesta de validación
   */
  validateCompania(pcCompania: string, pcEmpresa: string, pcLogin: string, pcSuper: string, pcToken: string): Observable<ApiResponse<any>> {
    const params = new HttpParams()
      .set('pcCompania', pcCompania)
      .set('pcEmpresa', pcEmpresa)
      .set('pcLogin', pcLogin)
      .set('pcSuper', pcSuper)
      .set('pcToken', pcToken);

    const url = `${this.baseUrl}/GetLeaveEmpresaCxC`;
    const fullUrl = `${url}?pcCompania=${pcCompania}&pcEmpresa=${pcEmpresa}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;
    console.log('🌐 URL COMPLETA GetLeaveEmpresaCxC:', fullUrl);

    return this.http.get<ApiResponse<any>>(url, { params });
  }

  /**
   * Valida una compañía específica usando GetLeaveGEciasCxC
   * @param pcCompania Código de la compañía
   * @param pcLogin Login del usuario
   * @param pcSuper Super usuario
   * @param pcToken Token de autenticación
   * @returns Observable con la respuesta de validación
   */
  validateCompaniaByCode(pcCompania: string, pcLogin: string, pcSuper: string, pcToken: string): Observable<ApiResponse<CompaniaCxC>> {
    const params = new HttpParams()
      .set('pcCompania', pcCompania)
      .set('pcLogin', pcLogin)
      .set('pcSuper', pcSuper)
      .set('pcToken', pcToken);

    const url = `${this.baseUrl}/GetLeaveGEciasCxC`;
    const fullUrl = `${url}?pcCompania=${pcCompania}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;
    console.log('🌐 URL COMPLETA GetLeaveGEciasCxC:', fullUrl);

    return this.http.get<ApiResponse<CompaniaCxC>>(url, { params });
  }

  /**
   * Valida una fecha de período usando GetLeaveFecPerCxC
   * @param pcCompania Código de la compañía
   * @param pcFechaPeriodo Fecha del período
   * @param pcLogin Login del usuario
   * @param pcSuper Super usuario
   * @param pcToken Token de autenticación
   * @returns Observable con la respuesta de validación
   */
  validateFecPer(pcCompania: string, pcFechaPeriodo: string, pcLogin: string, pcSuper: string, pcToken: string): Observable<ApiResponse<FechaPeriodoCxC>> {
    const params = new HttpParams()
      .set('pcCompania', pcCompania)
      .set('pcFechaPeriodo', pcFechaPeriodo)
      .set('pcLogin', pcLogin)
      .set('pcSuper', pcSuper)
      .set('pcToken', pcToken);

    const url = `${this.baseUrl}/GetLeaveFecPerCxC`;
    const fullUrl = `${url}?pcCompania=${pcCompania}&pcFechaPeriodo=${pcFechaPeriodo}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;
    console.log('🌐 URL COMPLETA GetLeaveFecPerCxC:', fullUrl);

    return this.http.get<ApiResponse<FechaPeriodoCxC>>(url, { params });
  }

  /**
   * Valida un lote usando GetLeaveLoteCxC
   * @param pcCompania Código de la compañía
   * @param pcFechaPer Fecha del período
   * @param pcLote Número del lote
   * @param pcLogin Login del usuario
   * @param pcSuper Super usuario
   * @param pcToken Token de autenticación
   * @returns Observable con la respuesta de validación
   */
  validateLote(pcCompania: string, pcFechaPer: string, pcLote: string, pcLogin: string, pcSuper: string, pcToken: string): Observable<ApiResponse<LoteCxC>> {
    const params = new HttpParams()
      .set('pcCompania', pcCompania)
      .set('pcFechaPer', pcFechaPer)
      .set('pcLote', pcLote)
      .set('pcLogin', pcLogin)
      .set('pcSuper', pcSuper)
      .set('pcToken', pcToken);

    const url = `${this.baseUrl}/GetLeaveLoteCxC`;
    const fullUrl = `${url}?pcCompania=${pcCompania}&pcFechaPer=${pcFechaPer}&pcLote=${pcLote}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;
    console.log('🌐 URL COMPLETA GetLeaveLoteCxC:', fullUrl);

    return this.http.get<ApiResponse<LoteCxC>>(url, { params });
  }

  /**
   * Obtiene las empresas disponibles usando GetCEEmpresa
   * @param pcCompania Código de la compañía
   * @param pcLogin Login del usuario
   * @param pcSuper Super usuario
   * @param pcToken Token de autenticación
   * @returns Observable con la lista de empresas
   */
  getEmpresas(pcCompania: string, pcLogin: string, pcSuper: string, pcToken: string): Observable<ApiResponse<EmpresaCxC>> {
    const params = new HttpParams()
      .set('pcCompania', pcCompania)
      .set('pcLogin', pcLogin)
      .set('pcSuper', pcSuper)
      .set('pcToken', pcToken);

    const url = `${this.baseUrl}/GetCEEmpresa`;
    const fullUrl = `${url}?pcCompania=${pcCompania}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;
    console.log('🌐 URL COMPLETA GetCEEmpresa:', fullUrl);

    return this.http.get<ApiResponse<EmpresaCxC>>(url, { params });
  }

  /**
   * Valida una empresa específica usando GetLeaveEmpresaCxC
   * @param pcCompania Código de la compañía
   * @param pcEmpresa Código de la empresa
   * @param pcLogin Login del usuario
   * @param pcSuper Super usuario
   * @param pcToken Token de autenticación
   * @returns Observable con la respuesta de validación
   */
  validateEmpresaByCode(pcCompania: string, pcEmpresa: string, pcLogin: string, pcSuper: string, pcToken: string): Observable<ApiResponse<EmpresaCxC>> {
    const params = new HttpParams()
      .set('pcCompania', pcCompania)
      .set('pcEmpresa', pcEmpresa)
      .set('pcLogin', pcLogin)
      .set('pcSuper', pcSuper)
      .set('pcToken', pcToken);

    const url = `${this.baseUrl}/GetLeaveEmpresaCxC`;
    const fullUrl = `${url}?pcCompania=${pcCompania}&pcEmpresa=${pcEmpresa}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;
    console.log('🌐 URL COMPLETA GetLeaveEmpresaCxC:', fullUrl);

    return this.http.get<ApiResponse<EmpresaCxC>>(url, { params });
  }

  /**
   * Obtiene tipos de documento usando GetCETipodoc
   * @param pcCompania Código de la compañía
   * @param pcLogin Login del usuario
   * @param pcSuper Super usuario
   * @param pcToken Token de autenticación
   * @returns Observable con la lista de tipos de documento
   */
  getTiposDoc(pcCompania: string, pcLogin: string, pcSuper: string, pcToken: string): Observable<ApiResponse<TipoDocCxC>> {
    const params = new HttpParams()
      .set('pcCompania', pcCompania)
      .set('pcLogin', pcLogin)
      .set('pcSuper', pcSuper)
      .set('pcToken', pcToken);

    const url = `${this.baseUrl}/GetCETipodoc`;
    const fullUrl = `${url}?pcCompania=${pcCompania}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;
    console.log('🌐 URL COMPLETA GetCETipodoc:', fullUrl);

    return this.http.get<ApiResponse<TipoDocCxC>>(url, { params });
  }

  /**
   * Valida un tipo de documento específico usando GetLeaveTipoDocCxC
   * @param pcCompania Código de la compañía
   * @param pcEmpresa Código de la empresa
   * @param pcNumDoc Número de documento
   * @param pcTipodoc Código del tipo de documento
   * @param pcLogin Login del usuario
   * @param pcSuper Super usuario
   * @param pcToken Token de autenticación
   * @returns Observable con la respuesta de validación
   */
  validateTipoDocByCode(pcCompania: string, pcEmpresa: string, pcNumDoc: string, pcTipodoc: string, pcLogin: string, pcSuper: string, pcToken: string): Observable<ApiResponse<TipoDocCxC>> {
    const params = new HttpParams()
      .set('pcCompania', pcCompania)
      .set('pcEmpresa', pcEmpresa)
      .set('pcNum-doc', pcNumDoc)
      .set('pcTipodoc', pcTipodoc)
      .set('pcLogin', pcLogin)
      .set('pcSuper', pcSuper)
      .set('pcToken', pcToken);

    const url = `${this.baseUrl}/GetLeaveTipoDocCxC`;
    const fullUrl = `${url}?pcCompania=${pcCompania}&pcEmpresa=${pcEmpresa}&pcNum-doc=${pcNumDoc}&pcTipodoc=${pcTipodoc}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;
    console.log('🌐 URL COMPLETA GetLeaveTipoDocCxC:', fullUrl);

    return this.http.get<ApiResponse<TipoDocCxC>>(url, { params });
  }

  /**
   * Obtiene documentos usando GetCEccdocumeCxC
   * @param pcCompania Código de la compañía
   * @param pcEmpresa Código de la empresa
   * @param pcLogin Login del usuario
   * @param pcSuper Super usuario
   * @param pcToken Token de autenticación
   * @returns Observable con la lista de documentos
   */
  getDocumentos(pcCompania: string, pcEmpresa: string, pcLogin: string, pcSuper: string, pcToken: string): Observable<ApiResponse<DocumentoCxC>> {
    const params = new HttpParams()
      .set('pcCompania', pcCompania)
      .set('pcEmpresa', pcEmpresa)
      .set('pcLogin', pcLogin)
      .set('pcSuper', pcSuper)
      .set('pcToken', pcToken);

    const url = `${this.baseUrl}/GetCEccdocumeCxC`;
    const fullUrl = `${url}?pcCompania=${pcCompania}&pcEmpresa=${pcEmpresa}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;
    console.log('🌐 URL COMPLETA GetCEccdocumeCxC:', fullUrl);

    return this.http.get<ApiResponse<DocumentoCxC>>(url, { params });
  }

  /**
   * Valida una fecha de emisión usando GetLeaveFechaEmisionCxC
   * @param pcCompania Código de la compañía
   * @param pcFechaEmision Fecha de emisión
   * @param pcFechaPeriodo Fecha del período
   * @param pcEmpresa Código de la empresa
   * @param pcLogin Login del usuario
   * @param pcSuper Super usuario
   * @param pcToken Token de autenticación
   * @returns Observable con la respuesta de validación
   */
  validateFechaEmision(pcCompania: string, pcFechaEmision: string, pcFechaPeriodo: string, pcEmpresa: string, pcLogin: string, pcSuper: string, pcToken: string): Observable<ApiResponse<FechaEmisionCxC>> {
    const params = new HttpParams()
      .set('pcCompania', pcCompania)
      .set('pcFechaEmision', pcFechaEmision)
      .set('pcFechaPeriodo', pcFechaPeriodo)
      .set('pcEmpresa', pcEmpresa)
      .set('pcLogin', pcLogin)
      .set('pcSuper', pcSuper)
      .set('pcToken', pcToken);

    const url = `${this.baseUrl}/GetLeaveFechaEmisionCxC`;
    const fullUrl = `${url}?pcCompania=${pcCompania}&pcFechaEmision=${pcFechaEmision}&pcFechaPeriodo=${pcFechaPeriodo}&pcEmpresa=${pcEmpresa}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;
    console.log('🌐 URL COMPLETA GetLeaveFechaEmisionCxC:', fullUrl);

    return this.http.get<ApiResponse<FechaEmisionCxC>>(url, { params });
  }

  /**
   * Valida una fecha de vencimiento usando GetLeaveFechaVencimientoCxC
   * @param pcCompania Código de la compañía
   * @param pcFechaEmision Fecha de emisión
   * @param pcFechaVencimiento Fecha de vencimiento
   * @param pcLogin Login del usuario
   * @param pcSuper Super usuario
   * @param pcToken Token de autenticación
   * @returns Observable con la respuesta de validación
   */
  validateFechaVencimiento(pcCompania: string, pcFechaEmision: string, pcFechaVencimiento: string, pcLogin: string, pcSuper: string, pcToken: string): Observable<ApiResponse<FechaVencimientoCxC>> {
    const params = new HttpParams()
      .set('pcCompania', pcCompania)
      .set('pcFechaEmision', pcFechaEmision)
      .set('pcFechaVencimiento', pcFechaVencimiento)
      .set('pcLogin', pcLogin)
      .set('pcSuper', pcSuper)
      .set('pcToken', pcToken);

    const url = `${this.baseUrl}/GetLeaveFechaVencimientoCxC`;
    const fullUrl = `${url}?pcCompania=${pcCompania}&pcFechaEmision=${pcFechaEmision}&pcFechaVencimiento=${pcFechaVencimiento}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;
    console.log('🌐 URL COMPLETA GetLeaveFechaVencimientoCxC:', fullUrl);

    return this.http.get<ApiResponse<FechaVencimientoCxC>>(url, { params });
  }

  /**
   * Valida una aplicación de documento usando GetLeaveAplicaDocCxC
   * @param pcCompania Código de la compañía
   * @param pcEmpresa Código de la empresa
   * @param pcNumdoc Número de documento
   * @param pcTipodoc Tipo de documento
   * @param pcLogin Login del usuario
   * @param pcSuper Super usuario
   * @param pcToken Token de autenticación
   * @returns Observable con la respuesta de validación
   */
  validateAplicaDoc(pcCompania: string, pcEmpresa: string, pcNumdoc: string, pcTipodoc: string, pcLogin: string, pcSuper: string, pcToken: string): Observable<ApiResponse<AplicaDocCxC>> {
    const params = new HttpParams()
      .set('pcCompania', pcCompania)
      .set('pcEmpresa', pcEmpresa)
      .set('pcNumdoc', pcNumdoc)
      .set('pcTipodoc', pcTipodoc)
      .set('pcLogin', pcLogin)
      .set('pcSuper', pcSuper)
      .set('pcToken', pcToken);

    const url = `${this.baseUrl}/GetLeaveAplicaDocCxC`;
    const fullUrl = `${url}?pcCompania=${pcCompania}&pcEmpresa=${pcEmpresa}&pcNumdoc=${pcNumdoc}&pcTipodoc=${pcTipodoc}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;
    console.log('🌐 URL COMPLETA GetLeaveAplicaDocCxC:', fullUrl);

    return this.http.get<ApiResponse<AplicaDocCxC>>(url, { params });
  }

  /**
   * Valida un monto usando GetLeaveMontoCxC
   * @param pcCompania Código de la compañía
   * @param pcMoneda Código de la moneda
   * @param pcTipodoc Tipo de documento
   * @param pcFechaEmision Fecha de emisión
   * @param pcMonto Monto a validar
   * @param pcLogin Login del usuario
   * @param pcSuper Super usuario
   * @param pcToken Token de autenticación
   * @returns Observable con la respuesta de validación
   */
  validateMonto(pcCompania: string, pcMoneda: string, pcTipodoc: string, pcFechaEmision: string, pcMonto: string, pcLogin: string, pcSuper: string, pcToken: string): Observable<ApiResponse<MontoCxC>> {
    const params = new HttpParams()
      .set('pcCompania', pcCompania)
      .set('pcMoneda', pcMoneda)
      .set('pcTipodoc', pcTipodoc)
      .set('pcFechaEmision', pcFechaEmision)
      .set('pcMonto', pcMonto)
      .set('pcLogin', pcLogin)
      .set('pcSuper', pcSuper)
      .set('pcToken', pcToken);

    const url = `${this.baseUrl}/GetLeaveMontoCxC`;
    const fullUrl = `${url}?pcCompania=${pcCompania}&pcMoneda=${pcMoneda}&pcTipodoc=${pcTipodoc}&pcFechaEmision=${pcFechaEmision}&pcMonto=${pcMonto}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;
    console.log('🌐 URL COMPLETA GetLeaveMontoCxC:', fullUrl);

    return this.http.get<ApiResponse<MontoCxC>>(url, { params });
  }

  /**
   * Actualiza transacciones de cuentas por cobrar
   * @param transactionData Datos de la transacción a actualizar
   * @param pcLogin Login del usuario actual
   * @param pcToken Token de autenticación
   * @param pcSuper Valor de super-clav del usuario actual
   * @returns Observable con la respuesta del servidor
   */
  updateCTCxC(transactionData: any, pcLogin: string, pcToken: string, pcSuper: string): Observable<any> {
    const apiUrl = `${this.baseUrl}/UpdateCTCxC?pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;

    console.log('🌐 === ENVIANDO PETICIÓN AL API UpdateCTCxC ===');
    console.log('🌐 URL completa:', apiUrl);
    console.log('🌐 Método: PUT');
    console.log('🌐 Parámetros de URL:', {
      pcLogin,
      pcSuper,
      pcToken: pcToken.substring(0, 10) + '...' // Solo mostrar parte del token por seguridad
    });
    console.log('🌐 Body de la petición:', JSON.stringify(transactionData, null, 2));
    console.log('🌐 Timestamp:', new Date().toISOString());

    return this.http.put(apiUrl, transactionData).pipe(
      map(response => {
        console.log('✅ === RESPUESTA EXITOSA DEL API UpdateCTCxC ===');
        console.log('📥 Respuesta completa:', response);
        console.log('📥 Tipo de respuesta:', typeof response);
        console.log('📥 Timestamp:', new Date().toISOString());
        return response;
      }),
      catchError(error => {
        console.error('❌ === ERROR EN LA PETICIÓN AL API UpdateCTCxC ===');
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

  /**
   * Actualiza los datos de contabilidad de cuentas por cobrar (Sección 2)
   * @param transactionData Datos de la transacción a actualizar
   * @param pcLogin Login del usuario actual
   * @param pcToken Token de autenticación
   * @param pcSuper Valor de super-clav del usuario actual
   * @returns Observable con la respuesta del servidor
   */
  updateContCxC(transactionData: any, pcLogin: string, pcToken: string, pcSuper: string): Observable<any> {
    const apiUrl = `${this.baseUrl}/UpdateContCxC?pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;

    console.log('🌐 === ENVIANDO PETICIÓN AL API UpdateContCxC ===');
    console.log('🌐 URL completa:', apiUrl);
    console.log('🌐 Método: PUT');
    console.log('🌐 Parámetros de URL:', {
      pcLogin,
      pcSuper,
      pcToken: pcToken.substring(0, 10) + '...' // Solo mostrar parte del token por seguridad
    });
    console.log('🌐 Body de la petición:', JSON.stringify(transactionData, null, 2));
    console.log('🌐 Timestamp:', new Date().toISOString());

    return this.http.put(apiUrl, transactionData).pipe(
      map(response => {
        console.log('✅ === RESPUESTA EXITOSA DEL API UpdateContCxC ===');
        console.log('📥 Respuesta completa:', response);
        console.log('📥 Tipo de respuesta:', typeof response);
        console.log('📥 Timestamp:', new Date().toISOString());
        return response;
      }),
      catchError(error => {
        console.error('❌ === ERROR EN LA PETICIÓN AL API UpdateContCxC ===');
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

  /**
   * Obtiene los datos de contabilidad de un lote específico (Sección 2)
   * @param pcCompania Código de la compañía
   * @param pcFechaPer Fecha del período
   * @param pcLote Número del lote
   * @param pcLogin Login del usuario actual
   * @param pcSuper Valor de super-clav del usuario actual
   * @param pcToken Token de autenticación
   * @returns Observable con la respuesta del servidor
   */
  getLeaveLoteCxCCont(
    pcCompania: string,
    pcFechaPer: string,
    pcLote: string,
    pcLogin: string,
    pcSuper: string,
    pcToken: string
  ): Observable<any> {
    const apiUrl = `${this.baseUrl}/GetLeaveLoteCxCCont?pcCompania=${pcCompania}&pcFechaPer=${pcFechaPer}&pcLote=${pcLote}&pcLogin=${pcLogin}&pcSuper=${pcSuper}&pcToken=${pcToken}`;

    console.log('🌐 === ENVIANDO PETICIÓN AL API GetLeaveLoteCxCCont ===');
    console.log('🌐 URL completa:', apiUrl);
    console.log('🌐 Método: GET');
    console.log('🌐 Parámetros de URL:', {
      pcCompania,
      pcFechaPer,
      pcLote,
      pcLogin,
      pcSuper,
      pcToken: pcToken.substring(0, 10) + '...' // Solo mostrar parte del token por seguridad
    });
    console.log('🌐 Timestamp:', new Date().toISOString());

    return this.http.get(apiUrl).pipe(
      map(response => {
        console.log('✅ === RESPUESTA EXITOSA DEL API GetLeaveLoteCxCCont ===');
        console.log('📥 Respuesta completa:', response);
        console.log('📥 Tipo de respuesta:', typeof response);
        console.log('📥 Timestamp:', new Date().toISOString());
        return response;
      }),
      catchError(error => {
        console.error('❌ === ERROR EN LA PETICIÓN AL API GetLeaveLoteCxCCont ===');
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
