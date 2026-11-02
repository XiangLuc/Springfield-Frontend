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

  it('charge les incidents résolus depuis l’historique de l’API', async () => {
    http.expectOne('/api/incidents/historique').flush([]);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('Aucun incident résolu pour le moment.');
  });
});
