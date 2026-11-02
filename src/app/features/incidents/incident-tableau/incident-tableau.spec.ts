import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IncidentResume } from '../../../../api/models/ApiIncident';
import { IncidentTableau } from './incident-tableau';

const INCIDENT: IncidentResume = {
  id: 7,
  description: 'Porte bloquée',
  statut: 'AFFECTE',
  libelleStatut: 'Affecté',
  dateOuverture: '2026-11-01T08:00:00',
  dateResolution: null,
  dureeOuvertureEnHeures: 47,
  equipementId: 1,
  referenceEquipement: 'ASC-001',
  libelleEquipement: 'Ascenseur quai A',
  station: 'Springfield Centre',
  prestataireId: 1,
  prestataire: 'Élévation Services',
};

describe('IncidentTableau', () => {
  let fixture: ComponentFixture<IncidentTableau>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentTableau],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentTableau);
    fixture.componentRef.setInput('incidents', [INCIDENT]);
    fixture.componentRef.setInput('colonnes', ['equipement', 'duree', 'prestataire']);
    await fixture.whenStable();
  });

  it('affiche uniquement les colonnes demandées', () => {
    const entetes = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('th'));

    expect(entetes.map((entete) => entete.textContent?.trim())).toEqual([
      'Équipement',
      'Durée',
      'Prestataire',
    ]);
  });

  it('affiche l’équipement, sa station et la durée formatée, avec un lien vers le détail', () => {
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('a.lien')?.getAttribute('href')).toBe('/incidents/7');
    expect(element.textContent).toContain('Springfield Centre');
    expect(element.textContent).toContain('1 j 23 h');
    expect(element.textContent).toContain('Élévation Services');
  });
});
