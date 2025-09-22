export interface MenuItemData {
  sistema: string;
  sistAbrev: string;
  grupoMen: string;
  nombreMen: string;
  loginCtrl: string;
  token: string;
  superClav: boolean;
  tparent: string;
}

export interface MenuResponse {
  dsRespuesta: {
    tgemenu: MenuItemData[];
  };
}

export interface MenuLevel1 {
  sistema: string;
  sistAbrev: string;
  grupos: MenuLevel2[];
}

export interface MenuLevel2 {
  grupoMen: string;
  items: MenuLevel3[];
}

export interface MenuLevel3 {
  nombreMen: string;
  loginCtrl: string;
  token: string;
  superClav: boolean;
  tparent: string;
}
