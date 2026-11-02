import { DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { IncidentResume } from '../../../../api/models/ApiIncident';
import { Badge } from '../../../shared/composants/badge/badge';
import { DureePipe } from '../../../shared/pipes/duree-pipe';

export type ColonneIncident =
  | 'dateOuverture'
  | 'dateResolution'
  | 'equipement'
  | 'description'
  | 'duree'
  | 'statut'
  | 'prestataire'
  | 'action';

@Component({
  imports: [DatePipe, RouterLink, MatIconModule, MatTableModule, Badge, DureePipe],
  selector: 'app-incident-tableau',
  styleUrl: './incident-tableau.scss',
  templateUrl: './incident-tableau.html',
})
export class IncidentTableau {
  incidents = input.required<IncidentResume[]>();
  colonnes = input.required<ColonneIncident[]>();
}
