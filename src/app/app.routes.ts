import { Route, Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { profilGuard } from './core/guards/profil-guard';

const estResponsable: Partial<Route> = {
  canActivate: [profilGuard],
  data: { profil: 'RESPONSABLE_EXPLOITATION' },
};

export const routes: Routes = [
  {
    path: 'connexion',
    loadComponent: () =>
      import('./features/auth/pages/connexion/connexion').then((m) => m.Connexion),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./core/layouts/layout/layout').then((m) => m.Layout),
    children: [
      {
        path: '',
        title: 'Accueil',
        loadComponent: () => import('./features/accueil/accueil').then((m) => m.Accueil),
      },
      {
        path: 'tableau-de-bord',
        title: 'Tableau de bord',
        ...estResponsable,
        loadComponent: () =>
          import('./features/tableau-de-bord/tableau-de-bord').then((m) => m.TableauDeBord),
      },
      {
        path: 'stations',
        title: 'Stations',
        loadComponent: () => import('./features/stations/stations').then((m) => m.Stations),
      },
      {
        path: 'equipements/:id',
        title: 'Fiche équipement',
        loadComponent: () =>
          import('./features/equipements/equipement-details/equipement-details').then(
            (m) => m.EquipementDetails,
          ),
      },
      {
        path: 'incidents',
        title: 'Incidents',
        loadComponent: () =>
          import('./features/incidents/incident-liste/incident-liste').then((m) => m.IncidentListe),
      },
      {
        path: 'incidents/nouveau',
        title: 'Déclarer un incident',
        loadComponent: () =>
          import('./features/incidents/incident-declaration/incident-declaration').then(
            (m) => m.IncidentDeclaration,
          ),
      },
      {
        path: 'incidents/:id',
        title: 'Détail incident',
        loadComponent: () =>
          import('./features/incidents/incident-details/incident-details').then(
            (m) => m.IncidentDetails,
          ),
      },
      {
        path: 'historique',
        title: 'Historique',
        loadComponent: () => import('./features/historique/historique').then((m) => m.Historique),
      },
      {
        path: 'prestataires',
        title: 'Prestataires',
        ...estResponsable,
        loadComponent: () =>
          import('./features/prestataires/prestataires').then((m) => m.Prestataires),
      },
      {
        path: 'agents/nouveau',
        ...estResponsable,
        loadComponent: () =>
          import('./features/auth/pages/inscription/inscription').then((m) => m.Inscription),
      },
      {
        path: 'import-export',
        title: 'Import / export',
        ...estResponsable,
        loadComponent: () =>
          import('./features/import-export/import-export').then((m) => m.ImportExport),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
