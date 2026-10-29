import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FicheEquipement } from './fiche-equipement';

describe('FicheEquipement', () => {
  let component: FicheEquipement;
  let fixture: ComponentFixture<FicheEquipement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FicheEquipement],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(FicheEquipement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
