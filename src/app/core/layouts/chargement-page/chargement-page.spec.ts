import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ChargementPage } from './chargement-page';

describe('ChargementPage', () => {
  let component: ChargementPage;
  let fixture: ComponentFixture<ChargementPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargementPage],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ChargementPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
