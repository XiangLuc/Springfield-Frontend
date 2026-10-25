import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = TestBed.inject(NotificationService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('affiche une notification de succès', () => {
    service.succes('Compte créé.');

    expect(service.notifications()).toEqual([{ id: 1, type: 'succes', message: 'Compte créé.' }]);
  });

  it('retire une notification fermée par l’utilisateur', () => {
    service.erreur('Erreur.');
    service.fermer(service.notifications()[0].id);

    expect(service.notifications()).toEqual([]);
  });

  it('retire automatiquement une notification au bout de quelques secondes', () => {
    service.info('Vous êtes déconnecté.');
    vi.advanceTimersByTime(5000);

    expect(service.notifications()).toEqual([]);
  });
});
