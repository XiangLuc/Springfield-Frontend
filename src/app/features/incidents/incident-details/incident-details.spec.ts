import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { IncidentDetail } from '../../../../api/models/ApiIncident';
import { Profil, Utilisateur } from '../../../../api/models/ApiUtilisateur';
import { AuthService } from '../../../core/services/auth.service';
import { IncidentDetails } from './incident-details';

const DETAIL: IncidentDetail = {
  incident: {
    id: 7,
    description: 'Porte bloquée',
    dateOuverture: '2026-11-01T08:00:00',
    statut: 'OUVERT',
    prestataire: null,
    dateResolution: null,
    equipement: {
      id: 1,
      reference: 'ASC-001',
      libelle: 'Ascenseur quai A',
      description: null,
      type: { id: 1, nom: 'Ascenseur' },
      station: { id: 1, nom: 'Springfield Centre' },
      etat: 'HORS_SERVICE',
    },
    dureeOuvertureEnMinutes: 47 * 60,
  },
  evaluation: null,
};

async function afficherIncidentEnTantQue(profil: Profil) {
  const utilisateur: Utilisateur = { prenom: 'Marge', profil, libelleProfil: profil };
  TestBed.configureTestingModule({
    providers: [
      provideRouter([{ path: 'incidents/:id', component: IncidentDetails }]),
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: AuthService, useValue: { utilisateurConnecte: signal(utilisateur) } },
    ],
  });
  const harness = await RouterTestingHarness.create();
  // Router.navigateByUrl rend la main dès le composant activé, sans attendre la réponse HTTP
  await TestBed.inject(Router).navigateByUrl('/incidents/7');
  const http = TestBed.inject(HttpTestingController);
  http.expectOne('/api/incidents/7').flush(DETAIL);
  harness.detectChanges();
  return { element: harness.routeNativeElement as HTMLElement, http };
}

describe('IncidentDetails', () => {
  it('affiche la durée d’ouverture et la station de l’incident', async () => {
    const { element } = await afficherIncidentEnTantQue('AGENT');

    expect(element.textContent).toContain('Incident n°7');
    expect(element.textContent).toContain('Springfield Centre');
    expect(element.textContent).toContain('1 j 23 h');
  });

  it('ne propose ni affectation ni résolution à un agent', async () => {
    const { element, http } = await afficherIncidentEnTantQue('AGENT');

    http.expectNone('/api/prestataires');
    expect(element.textContent).not.toContain("Déclarer l'incident résolu");
    expect(element.textContent).toContain('Seul un responsable d');
  });

  it('propose l’affectation et la résolution au responsable d’exploitation', async () => {
    const { element, http } = await afficherIncidentEnTantQue('RESPONSABLE_EXPLOITATION');

    http.expectOne('/api/prestataires').flush([]);
    expect(element.textContent).toContain('Affecter');
    expect(element.textContent).toContain("Déclarer l'incident résolu");
  });
});
