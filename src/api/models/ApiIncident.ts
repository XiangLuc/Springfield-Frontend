import { Equipement, Prestataire, StatutIncident } from './ApiEquipement';

export const LONGUEUR_MAX_DESCRIPTION = 500;

export interface IncidentResume {
  id: number;
  description: string;
  dateOuverture: string;
  statut: StatutIncident;
  prestataire: Prestataire | null;
  dateResolution: string | null;
  equipement: Equipement;
  dureeOuvertureEnMinutes: number;
}

export interface Evaluation {
  note: number;
  commentaire: string | null;
  dateEvaluation: string;
}

export interface IncidentDetail {
  incident: IncidentResume;
  evaluation: Evaluation | null;
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
