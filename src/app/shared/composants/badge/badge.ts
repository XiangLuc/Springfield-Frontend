import { Component, computed, input } from '@angular/core';
import { EtatEquipement, StatutIncident } from '../../../../api/models/ApiEquipement';
import {
  LIBELLES_ETAT_EQUIPEMENT,
  LIBELLES_STATUT_INCIDENT,
  TONS_ETAT_EQUIPEMENT,
  TONS_STATUT_INCIDENT,
} from '../../libelles/libelles';

const LIBELLES = { ...LIBELLES_ETAT_EQUIPEMENT, ...LIBELLES_STATUT_INCIDENT };
const TONS = { ...TONS_ETAT_EQUIPEMENT, ...TONS_STATUT_INCIDENT };

@Component({
  imports: [],
  selector: 'app-badge',
  styleUrl: './badge.scss',
  templateUrl: './badge.html',
  host: { '[class]': 'ton()' },
})
export class Badge {
  valeur = input.required<EtatEquipement | StatutIncident>();

  libelle = computed(() => LIBELLES[this.valeur()]);
  ton = computed(() => TONS[this.valeur()]);
}
