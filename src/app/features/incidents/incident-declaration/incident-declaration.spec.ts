import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IncidentDeclaration } from './incident-declaration';

describe('IncidentDeclaration', () => {
  let component: IncidentDeclaration;
  let fixture: ComponentFixture<IncidentDeclaration>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentDeclaration],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentDeclaration);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    http.expectOne('/api/stations').flush([]);
    await fixture.whenStable();
  });

  it('refuse une description composée uniquement d’espaces', () => {
    component.formulaire.setValue({ stationId: 1, equipementId: 1, description: '   ' });

    expect(component.formulaire.controls.description.invalid).toBe(true);
  });

  it('n’envoie rien au serveur tant que le formulaire est invalide', () => {
    component.declarer();

    http.expectNone('/api/incidents');
    expect(component.formulaire.controls.equipementId.touched).toBe(true);
  });
});
