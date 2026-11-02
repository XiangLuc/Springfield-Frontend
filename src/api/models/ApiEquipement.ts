import { Station } from './ApiStation';

export type EtatEquipement = 'EN_SERVICE' | 'DEGRADE' | 'HORS_SERVICE';

export type StatutIncident = 'OUVERT' | 'AFFECTE' | 'RESOLU';

export interface TypeEquipement {
  id: number;
  nom: string;
}

export interface Equipement {
  id: number;
  reference: string;
  libelle: string;
  description: string | null;
  type: TypeEquipement;
  station: Station;
  etat: EtatEquipement;
}

export interface Prestataire {
  id: number;
  nom: string;
  email: string | null;
  telephone: string | null;
}

export interface PrestataireNote extends Prestataire {
  noteMoyenne: number | null;
  nombreEvaluations: number;
}

export interface Incident {
  id: number;
  description: string;
  dateOuverture: string;
  statut: StatutIncident;
  prestataire: Prestataire | null;
  dateResolution: string | null;
}
