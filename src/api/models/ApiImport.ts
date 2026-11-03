export interface LigneEchouee {
  numeroLigne: number;
  contenu: string;
  raison: string;
}

export interface ResultatImport {
  nombreSucces: number;
  nombreEchecs: number;
  lignesEchouees: LigneEchouee[];
}
