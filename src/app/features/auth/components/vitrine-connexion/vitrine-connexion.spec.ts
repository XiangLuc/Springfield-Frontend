import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VitrineConnexion } from './vitrine-connexion';

describe('VitrineConnexion', () => {
  let component: VitrineConnexion;
  let fixture: ComponentFixture<VitrineConnexion>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VitrineConnexion],
    }).compileComponents();

    fixture = TestBed.createComponent(VitrineConnexion);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
