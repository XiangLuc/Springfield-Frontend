import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { PrestataireNote } from '../../../../api/models/ApiEquipement';
import { IncidentResume } from '../../../../api/models/ApiIncident';
import { Profil, Utilisateur } from '../../../../api/models/ApiUtilisateur';
import { AuthService } from '../../../core/services/auth.service';
import { IncidentDetails } from './incident-details';

const DETAIL: IncidentResume = {
  id: 7,
  description: 'Porte bloquée',
  statut: 'OUVERT',
  libelleStatut: 'Non affecté',
  dateOuverture: '2026-11-01T08:00:00',
  dateResolution: null,
  dureeOuvertureEnHeures: 47,
  equipementId: 1,
  referenceEquipement: 'ASC-001',
  libelleEquipement: 'Ascenseur quai A',
  station: 'Springfield Centre',
  prestataireId: null,
  prestataire: null,
  prestataireSousSurveillance: false,
};

const SURVEILLE: PrestataireNote = {
  id: 2,
  nom: 'Dupont Réseaux',
  email: null,
  telephone: null,
  noteMoyenne: 2.8,
  nombreEvaluations: 6,
  sousSurveillance: true,
};

const NON_SURVEILLE: PrestataireNote = { ...SURVEILLE, id: 3, nom: 'Otis', sousSurveillance: false };

const MESSAGE_SURVEILLANCE =
  "Le prestataire « Dupont Réseaux » est sous surveillance : confirmez explicitement l'affectation pour continuer.";

async function afficherIncidentEnTantQue(profil: Profil, incident: IncidentResume = DETAIL) {
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
  http.expectOne('/api/incidents/7').flush(incident);
  harness.detectChanges();
  return { harness, element: harness.routeNativeElement as HTMLElement, http };
}

async function afficherAffectationAvecPrestataires(prestataires: PrestataireNote[]) {
  const affichage = await afficherIncidentEnTantQue('RESPONSABLE_EXPLOITATION');
  affichage.http.expectOne('/api/prestataires').flush(prestataires);
  affichage.harness.detectChanges();
  const composant = affichage.harness.routeDebugElement!.componentInstance as IncidentDetails;
  return { ...affichage, composant };
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

  it('signale sur le détail qu’un incident est affecté à un prestataire sous surveillance', async () => {
    const affecte: IncidentResume = {
      ...DETAIL,
      statut: 'AFFECTE',
      prestataireId: 2,
      prestataire: 'Dupont Réseaux',
      prestataireSousSurveillance: true,
    };
    const { element } = await afficherIncidentEnTantQue('AGENT', affecte);

    expect(element.textContent).toContain('Dupont Réseaux');
    expect(element.textContent).toContain('sous surveillance');
  });

  it('n’ajoute la mention « sous surveillance » qu’aux prestataires surveillés dans la liste de choix', async () => {
    const { element, harness } = await afficherAffectationAvecPrestataires([SURVEILLE, NON_SURVEILLE]);

    element.querySelector<HTMLElement>('.mat-mdc-select-trigger')!.click();
    harness.detectChanges();
    const libelles = Array.from(document.querySelectorAll('mat-option')).map((option) =>
      option.textContent?.trim(),
    );

    expect(libelles).toEqual(['Dupont Réseaux (sous surveillance)', 'Otis']);
  });

  it('demande une confirmation quand le serveur refuse un prestataire surveillé, puis la transmet', async () => {
    const { composant, element, harness, http } = await afficherAffectationAvecPrestataires([SURVEILLE]);
    composant.prestataireChoisi.setValue(SURVEILLE.id);

    composant.affecter();
    const premiereDemande = http.expectOne('/api/incidents/7/prestataire');
    expect(premiereDemande.request.body).toEqual({ prestataireId: 2, confirmationSurveillance: false });
    premiereDemande.flush({ message: MESSAGE_SURVEILLANCE }, { status: 409, statusText: 'Conflict' });
    harness.detectChanges();

    expect(element.textContent).toContain('surveillance');
    expect(element.textContent).toContain("Confirmer l'affectation");

    composant.confirmerAffectation();
    const demandeConfirmee = http.expectOne('/api/incidents/7/prestataire');
    expect(demandeConfirmee.request.body).toEqual({ prestataireId: 2, confirmationSurveillance: true });
    demandeConfirmee.flush({
      ...DETAIL,
      statut: 'AFFECTE',
      prestataireId: 2,
      prestataire: 'Dupont Réseaux',
      prestataireSousSurveillance: true,
    });
    harness.detectChanges();

    expect(composant.avertissementSurveillance()).toBeNull();
    expect(composant.incident()?.statut).toBe('AFFECTE');
  });

  it('affecte directement un prestataire non surveillé, sans confirmation', async () => {
    const { composant, http } = await afficherAffectationAvecPrestataires([NON_SURVEILLE]);
    composant.prestataireChoisi.setValue(NON_SURVEILLE.id);

    composant.affecter();
    const demande = http.expectOne('/api/incidents/7/prestataire');
    expect(demande.request.body).toEqual({ prestataireId: 3, confirmationSurveillance: false });
    demande.flush({ ...DETAIL, statut: 'AFFECTE', prestataireId: 3, prestataire: 'Otis' });

    expect(composant.avertissementSurveillance()).toBeNull();
  });
});
