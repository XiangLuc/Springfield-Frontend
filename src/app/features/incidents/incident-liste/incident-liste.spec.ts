import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IncidentListe } from './incident-liste';

const PAGE_VIDE = { contenu: [], page: 0, taille: 20, totalElements: 0, totalPages: 0 };

describe('IncidentListe', () => {
  let component: IncidentListe;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentListe],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    component = TestBed.createComponent(IncidentListe).componentInstance;
    http = TestBed.inject(HttpTestingController);
  });

  it('charge la première page, du plus récemment ouvert au plus ancien', () => {
    const requete = http.expectOne((r) => r.url === '/api/incidents');

    expect(requete.request.params.get('page')).toBe('0');
    expect(requete.request.params.get('sort')).toBe('dateOuverture,desc');
    expect(requete.request.params.has('statut')).toBe(false);
  });

  it('transmet le statut choisi et revient à la première page', () => {
    http.expectOne((r) => r.url === '/api/incidents').flush(PAGE_VIDE);

    component.filtrerParStatut('AFFECTE');

    const requete = http.expectOne((r) => r.url === '/api/incidents');
    expect(requete.request.params.get('statut')).toBe('AFFECTE');
    expect(requete.request.params.get('page')).toBe('0');
  });
});
