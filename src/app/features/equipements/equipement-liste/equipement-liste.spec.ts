import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Equipement } from '../../../../api/models/ApiEquipement';
import { EquipementListe } from './equipement-liste';

const ASCENSEUR: Equipement = {
  id: 1,
  reference: 'ASC-001',
  libelle: 'Ascenseur quai A',
  description: null,
  type: { id: 1, nom: 'Ascenseur' },
  station: { id: 1, nom: 'Springfield Centre' },
  etat: 'EN_SERVICE',
};

describe('EquipementListe', () => {
  let fixture: ComponentFixture<EquipementListe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipementListe],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EquipementListe);
    fixture.componentRef.setInput('equipements', [ASCENSEUR]);
    await fixture.whenStable();
  });

  it('affiche une ligne par équipement avec un lien vers sa fiche', () => {
    const element: HTMLElement = fixture.nativeElement;
    const lien = element.querySelector<HTMLAnchorElement>('a.lien');

    expect(element.querySelectorAll('tr.ligne').length).toBe(1);
    expect(lien?.textContent?.trim()).toBe('Ascenseur quai A');
    expect(lien?.getAttribute('href')).toBe('/equipements/1');
  });
});
