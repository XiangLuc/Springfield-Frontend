import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Utilisateur } from '../../../api/models/ApiUtilisateur';
import { AuthService } from './auth.service';

const AGENT: Utilisateur = { prenom: 'Hélène', profil: 'AGENT', libelleProfil: 'Agent' };
const AUCUN_CONTENU = { status: 204, statusText: 'No Content' };

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('mémorise l’utilisateur après une connexion réussie', () => {
    service.connecter({ login: 'agent1', motDePasse: 'secret' }).subscribe();
    httpTesting.expectOne('/api/auth/connexion').flush(AGENT);

    expect(service.utilisateurConnecte()).toEqual(AGENT);
  });

  it('considère le visiteur comme déconnecté quand le serveur ne renvoie aucun utilisateur', () => {
    service.chargerUtilisateurConnecte().subscribe();
    httpTesting.expectOne('/api/auth/info').flush(null, AUCUN_CONTENU);

    expect(service.utilisateurConnecte()).toBeNull();
  });

  it('oublie l’utilisateur après la déconnexion', () => {
    service.connecter({ login: 'agent1', motDePasse: 'secret' }).subscribe();
    httpTesting.expectOne('/api/auth/connexion').flush(AGENT);

    service.deconnecter().subscribe();
    httpTesting.expectOne('/api/auth/deconnexion').flush(null, AUCUN_CONTENU);

    expect(service.utilisateurConnecte()).toBeNull();
  });
});
