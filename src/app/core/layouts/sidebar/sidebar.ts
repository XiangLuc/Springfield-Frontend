import { Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Profil } from '../../../../api/models/ApiUtilisateur';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

interface LienNavigation {
  libelle: string;
  icone: string;
  chemin: string;
  profil?: Profil;
}

interface SectionNavigation {
  titre: string;
  liens: LienNavigation[];
}

const SECTIONS: SectionNavigation[] = [
  {
    titre: 'Général',
    liens: [
      { libelle: 'Accueil', icone: 'home', chemin: '/' },
      {
        libelle: 'Tableau de bord',
        icone: 'dashboard',
        chemin: '/tableau-de-bord',
        profil: 'RESPONSABLE_EXPLOITATION',
      },
    ],
  },
  {
    titre: 'Réseau',
    liens: [
      { libelle: 'Stations', icone: 'subway', chemin: '/stations' },
      { libelle: 'Incidents', icone: 'warning', chemin: '/incidents' },
      { libelle: 'Historique', icone: 'history', chemin: '/historique' },
      {
        libelle: 'Prestataires',
        icone: 'engineering',
        chemin: '/prestataires',
        profil: 'RESPONSABLE_EXPLOITATION',
      },
    ],
  },
  {
    titre: 'Administration',
    liens: [
      {
        libelle: 'Ajouter un agent',
        icone: 'person_add',
        chemin: '/agents/nouveau',
        profil: 'RESPONSABLE_EXPLOITATION',
      },
    ],
  },
];

@Component({
  imports: [
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatTooltipModule,
  ],
  selector: 'app-sidebar',
  styleUrl: './sidebar.scss',
  templateUrl: './sidebar.html',
  host: { '[class.replie]': 'replie()' },
})
export class Sidebar {
  replie = input(false);
  repliementDemande = output();
  lienSuivi = output();

  sections;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
  ) {
    this.sections = computed(() => {
      const profil = this.authService.utilisateurConnecte()?.profil;
      return SECTIONS.map((section) => ({
        ...section,
        liens: section.liens.filter((lien) => !lien.profil || lien.profil === profil),
      })).filter((section) => section.liens.length > 0);
    });
  }

  deconnecter(): void {
    this.authService.deconnecter().subscribe(() => {
      this.notificationService.info('Vous êtes déconnecté.');
      this.router.navigate(['/connexion']);
    });
  }
}
