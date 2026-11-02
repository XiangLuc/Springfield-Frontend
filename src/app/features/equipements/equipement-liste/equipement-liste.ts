import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { Equipement } from '../../../../api/models/ApiEquipement';
import { Badge } from '../../../shared/composants/badge/badge';

@Component({
  imports: [RouterLink, MatIconModule, MatTableModule, Badge],
  selector: 'app-equipement-liste',
  styleUrl: './equipement-liste.scss',
  templateUrl: './equipement-liste.html',
})
export class EquipementListe {
  colonnes = ['reference', 'libelle', 'type', 'etat', 'action'];

  equipements = input.required<Equipement[]>();
}
