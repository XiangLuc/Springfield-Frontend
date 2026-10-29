import { EtatEquipement, StatutIncident } from '../../../api/models/ApiEquipement';

export type TonBadge = 'succes' | 'alerte' | 'erreur';

export const LIBELLES_ETAT_EQUIPEMENT: Record<EtatEquipement, string> = {
  EN_SERVICE: 'En service',
  DEGRADE: 'Dégradé',
  HORS_SERVICE: 'Hors service',
};

export const LIBELLES_STATUT_INCIDENT: Record<StatutIncident, string> = {
  OUVERT: 'Non affecté',
  AFFECTE: 'Affecté',
  RESOLU: 'Résolu',
};

export const TONS_ETAT_EQUIPEMENT: Record<EtatEquipement, TonBadge> = {
  EN_SERVICE: 'succes',
  DEGRADE: 'alerte',
  HORS_SERVICE: 'erreur',
};

export const TONS_STATUT_INCIDENT: Record<StatutIncident, TonBadge> = {
  OUVERT: 'erreur',
  AFFECTE: 'alerte',
  RESOLU: 'succes',
};
