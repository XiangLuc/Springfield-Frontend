import { StatutIncident } from './ApiEquipement';

export const LONGUEUR_MAX_DESCRIPTION = 500;
export const NOTE_MINIMALE = 1;
export const NOTE_MAXIMALE = 5;
export const LONGUEUR_MAX_COMMENTAIRE = 500;

export interface IncidentResume {
  id: number;
  description: string;
  statut: StatutIncident;
  libelleStatut: string;
  dateOuverture: string;
  dateResolution: string | null;
  dureeOuvertureEnHeures: number;
  equipementId: number;
  referenceEquipement: string;
  libelleEquipement: string;
  station: string;
  prestataireId: number | null;
  prestataire: string | null;
}

export interface Page<T> {
  contenu: T[];
  page: number;
  taille: number;
  totalElements: number;
  totalPages: number;
}

export interface FiltresIncidents {
  motCle: string;
  statut: StatutIncident | null;
  stationId: number | null;
  prestataireId: number | null;
  ouvertDepuis: string;
  ouvertJusquAu: string;
}

export interface CriteresRecherche extends Partial<FiltresIncidents> {
  page: number;
  taille: number;
  tri: string;
}

export interface Evaluation {
  id: number;
  incidentId: number;
  prestataire: string;
  note: number;
  commentaire: string | null;
  dateEvaluation: string;
}

export interface CreationEvaluation {
  note: number;
  commentaire: string;
}

export interface DeclarationIncident {
  equipementId: number;
  description: string;
}

export interface ModificationIncident {
  description: string;
}

export interface Affectation {
  prestataireId: number;
}
