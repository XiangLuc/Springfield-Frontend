import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { IncidentListe } from './incident-liste';

describe('IncidentListe', () => {
  let component: IncidentListe;
  let fixture: ComponentFixture<IncidentListe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentListe],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(IncidentListe);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
