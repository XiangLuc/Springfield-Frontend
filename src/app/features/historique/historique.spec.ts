import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Historique } from './historique';

describe('Historique', () => {
  let fixture: ComponentFixture<Historique>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Historique],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Historique);
    http = TestBed.inject(HttpTestingController);
  });

  it('demande uniquement les incidents résolus, du plus récent au plus ancien', async () => {
    const requete = http.expectOne((r) => r.url === '/api/incidents');
    expect(requete.request.params.get('statut')).toBe('RESOLU');
    expect(requete.request.params.get('sort')).toBe('dateResolution,desc');

    requete.flush({ contenu: [], page: 0, taille: 20, totalElements: 0, totalPages: 0 });
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Aucun incident résolu pour le moment.');
  });
});
