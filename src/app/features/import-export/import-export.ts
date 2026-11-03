import { HttpErrorResponse } from '@angular/common/http';
import { Component, computed, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Observable, finalize } from 'rxjs';
import { ResultatImport } from '../../../api/models/ApiImport';
import { EquipementService } from '../../core/services/equipement.service';
import { IncidentService } from '../../core/services/incident.service';
import { NotificationService } from '../../core/services/notification.service';
import { StationService } from '../../core/services/station.service';
import { messageErreur } from '../../shared/erreurs/message-erreur';
import { telechargerCsv } from '../../shared/fichiers/fichiers-csv';

type CibleImport = 'stations' | 'equipements';

interface PresentationCible {
  valeur: CibleImport;
  libelle: string;
  icone: string;
  colonnes: string;
  exemple: string;
}

const CIBLES: PresentationCible[] = [
  {
    valeur: 'stations',
    libelle: 'Stations',
    icone: 'subway',
    colonnes: 'nom',
    exemple: 'exemples/stations.csv',
  },
  {
    valeur: 'equipements',
    libelle: 'Équipements',
    icone: 'build',
    colonnes: 'reference ; libelle ; type ; station',
    exemple: 'exemples/equipements.csv',
  },
];

const EXTENSION_CSV = '.csv';
const TAILLE_MAX_EN_OCTETS = 1024 * 1024;
const NOM_FICHIER_EXPORT = 'historique_incidents.csv';

@Component({
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatTableModule],
  selector: 'app-import-export',
  styleUrl: './import-export.scss',
  templateUrl: './import-export.html',
})
export class ImportExport {
  cibles = CIBLES;
  extensionCsv = EXTENSION_CSV;
  colonnesEchecs = ['numeroLigne', 'contenu', 'raison'];

  cible = signal<CibleImport | null>(null);
  fichier = signal<File | null>(null);
  resultat = signal<ResultatImport | null>(null);
  erreur = signal<string | null>(null);
  importEnCours = signal(false);
  exportEnCours = signal(false);

  presentation = computed(() => CIBLES.find((cible) => cible.valeur === this.cible()));

  constructor(
    private stationService: StationService,
    private equipementService: EquipementService,
    private incidentService: IncidentService,
    private notificationService: NotificationService,
  ) {}

  choisirCible(cible: CibleImport): void {
    this.cible.set(cible);
    this.fichier.set(null);
    this.resultat.set(null);
    this.erreur.set(null);
  }

  choisirFichier(evenement: Event): void {
    const selecteur = evenement.target as HTMLInputElement;
    const fichier = selecteur.files?.[0] ?? null;
    selecteur.value = '';
    this.resultat.set(null);
    this.erreur.set(fichier ? this.problemeDuFichier(fichier) : null);
    this.fichier.set(fichier && !this.erreur() ? fichier : null);
  }

  importer(): void {
    const fichier = this.fichier();
    if (!fichier) {
      return;
    }
    this.importEnCours.set(true);
    this.erreur.set(null);
    this.envoyer(fichier)
      .pipe(finalize(() => this.importEnCours.set(false)))
      .subscribe({
        next: (resultat) => {
          this.resultat.set(resultat);
          this.fichier.set(null);
        },
        error: (erreur: HttpErrorResponse) => this.erreur.set(messageErreur(erreur)),
      });
  }

  exporterHistorique(): void {
    this.exportEnCours.set(true);
    this.incidentService
      .exporterHistorique()
      .pipe(finalize(() => this.exportEnCours.set(false)))
      .subscribe({
        next: (contenu) => telechargerCsv(contenu, NOM_FICHIER_EXPORT),
        error: (erreur: HttpErrorResponse) =>
          this.notificationService.erreur(messageErreur(erreur)),
      });
  }

  private envoyer(fichier: File): Observable<ResultatImport> {
    return this.cible() === 'stations'
      ? this.stationService.importer(fichier)
      : this.equipementService.importer(fichier);
  }

  private problemeDuFichier(fichier: File): string | null {
    if (!fichier.name.toLowerCase().endsWith(EXTENSION_CSV)) {
      return 'Choisissez un fichier CSV.';
    }
    if (fichier.size === 0) {
      return 'Le fichier CSV est vide.';
    }
    if (fichier.size > TAILLE_MAX_EN_OCTETS) {
      return 'Le fichier dépasse la taille maximale de 1 Mo.';
    }
    return null;
  }
}
