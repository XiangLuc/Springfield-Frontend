import { DureePipe } from './duree-pipe';

describe('DureePipe', () => {
  const pipe = new DureePipe();

  it('indique « moins d’une heure » pour une durée nulle', () => {
    expect(pipe.transform(0)).toBe('moins d’une heure');
  });

  it('affiche les heures seules en dessous d’un jour', () => {
    expect(pipe.transform(5)).toBe('5 h');
  });

  it('affiche les jours et les heures au-delà', () => {
    expect(pipe.transform(47)).toBe('1 j 23 h');
    expect(pipe.transform(72)).toBe('3 j 0 h');
  });
});
