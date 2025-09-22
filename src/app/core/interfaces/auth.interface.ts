export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  pcToken?: string;
  pcLogin?: string;
  pcSuper?: boolean;
}

export interface MenuItem {
  sistema: string;
  'sist-abrev': string;
  'grupo-men': string;
  'nombre-men': string;
  'login-ctrl': string;
  token: string;
  'super-clav': boolean;
  tparent: string;
  terrores?: Array<{
    codigo: string;
    descripcion: string;
    tPARENT: string;
  }>;
}

export interface LoginApiResponse {
  dsRespuesta: {
    tgemenu: MenuItem[];
  };
}

export interface UserData {
  Agrega: string;
  'Agrega-Clav': string;
  'bgcolfil-gen': number;
  'bgcolfra-gen': number;
  'bgcoltex-gen': number;
  Bloqueo: boolean;
  Codper: string;
  Contador: number;
  CrudCons: boolean;
  CrudElim: boolean;
  CrudMod: boolean;
  CrudSave: boolean;
  'date-ctrl': string;
  'fecfin-clav': string | null;
  'fecini-clav': string | null;
  Fecpass: string;
  'fgcolfil-gen': number;
  'fgcolfra-gen': number;
  'fgcolre1-gen': number;
  'fgcolre2-gen': number;
  'fgcoltex-gen': number;
  'idioma-gen': string;
  login: string;
  'login-ctrl': string;
  'nombre-clav': string;
  Nuevo: boolean;
  'password-clav': string;
  'password-clav2': string;
  Perfil: boolean;
  'runpel-gen': boolean;
  'runson-gen': boolean;
  'super-clav': boolean;
  'text-clav': string;
  tperfil: string;
  tparent: string;
}

export interface UsersApiResponse {
  dsRespuesta: {
    tgeclaves2: UserData[];
  };
}

export interface PerfilData {
  Codper: string;
  'login-ctrl': string;
  tparent: string;
}

export interface PerfilesApiResponse {
  dsRespuesta: {
    tgeclaves3: PerfilData[];
  };
}

export interface UpdateUserData {
  Agrega: string;
  'Agrega-Clav': string;
  'bgcolfil-gen': number;
  'bgcolfra-gen': number;
  'bgcoltex-gen': number;
  Bloqueo: boolean;
  Codper: string;
  Contador: number;
  CrudCons: boolean;
  CrudElim: boolean;
  CrudMod: boolean;
  CrudSave: boolean;
  'date-ctrl': string;
  'fecfin-clav': string;
  'fecini-clav': string;
  Fecpass: string;
  'fgcolfil-gen': number;
  'fgcolfra-gen': number;
  'fgcolre1-gen': number;
  'fgcolre2-gen': number;
  'fgcoltex-gen': number;
  'idioma-gen': string;
  login: string;
  'login-ctrl': string;
  'nombre-clav': string;
  Nuevo: boolean;
  'password-clav': string;
  'password-clav2': string;
  Perfil: boolean;
  'runpel-gen': boolean;
  'runson-gen': boolean;
  'super-clav': boolean;
  'text-clav': string;
  tperfil: string;
  tparent: string;
  'agrega-userWin': string;
  'agrega-emailinter': string;
  'agrega-accinv': string;
  'agrega-indgen': string;
  'agrega-GUID': string;
  'agrega-CodEmpleado': string;
}

export interface UpdateUsuariosRequest {
  dsRespuesta: {
    tgeclaves: UpdateUserData[];
  };
}

// GetFactura interfaces
export interface GetFacturaRequest {
  pcCompania: string;
  pcEmpresa: string;
  pcTipo: string;
  pcSocio: string;
  pcGerente: string;
  pcFactura: string;
  pcLogin: string;
  pcSuper: string;
  pcToken: string;
}

export interface FacturaData {
  agencia: number;
  'Agrega-Hist': string;
  'apldoc-his': number;
  'autret-his': number;
  'basiva-his': number;
  cia: number | null;
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
  'date-ctrl': string | null;
  'desiva-his': number;
  empresa: number;
  'nombre-emp': string;
  'estado-his': boolean;
  'fecmov-his': string | null;
  'fecperi-his': string | null;
  'fecven-his': string | null;
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
  'nombre-zon': string;
  'saldo-doc': number;
  salext: number;
  tparent: string;
  terrores?: Array<{
    codigo: string;
    descripcion: string;
    tPARENT: string;
  }>;
}

export interface GetFacturaResponse {
  dsRespuesta: {
    tcchistor: FacturaData[];
  };
}
