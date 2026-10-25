export type Profil = 'AGENT' | 'RESPONSABLE_EXPLOITATION';

export interface Utilisateur {
  prenom: string;
  profil: Profil;
  libelleProfil: string;
}

export interface Identifiants {
  login: string;
  motDePasse: string;
}

export interface NouvelAgent {
  login: string;
  motDePasse: string;
  prenom: string;
}
