export type NiveauAttention = 'ROUGE' | 'ORANGE' | 'VERT' | 'AFFECTE';

export interface IncidentActif {
  id: number;
  description: string;
  dateOuverture: string;
  dureeOuvertureEnHeures: number;
  niveauAttention: NiveauAttention;
  libelleNiveauAttention: string;
  stationId: number;
  station: string;
  referenceEquipement: string;
  libelleEquipement: string;
  typeEquipement: string;
  prestataire: string | null;
}

export interface DonneesTableauDeBord {
  nombreIncidentsActifs: number;
  nombreParNiveau: Record<NiveauAttention, number>;
  dureeMoyenneOuvertureEnHeures: number;
  nombreStationsTouchees: number;
  incidents: IncidentActif[];
}
