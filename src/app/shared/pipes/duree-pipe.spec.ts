import { DureePipe } from './duree-pipe';

describe('DureePipe', () => {
  const pipe = new DureePipe();

  it('affiche les minutes seules en dessous d’une heure', () => {
    expect(pipe.transform(42)).toBe('42 min');
  });

  it('affiche les heures et les minutes en dessous d’un jour', () => {
    expect(pipe.transform(5 * 60 + 12)).toBe('5 h 12 min');
  });

  it('affiche les jours et les heures au-delà', () => {
    expect(pipe.transform(47 * 60)).toBe('1 j 23 h');
    expect(pipe.transform(72 * 60 + 30)).toBe('3 j 0 h');
  });
});
