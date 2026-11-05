import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { EquipementDetails } from './equipement-details';

describe('EquipementDetails', () => {
  let component: EquipementDetails;
  let fixture: ComponentFixture<EquipementDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EquipementDetails],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(EquipementDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
