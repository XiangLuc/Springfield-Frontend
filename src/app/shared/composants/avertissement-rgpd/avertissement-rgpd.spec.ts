import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AvertissementRgpd } from './avertissement-rgpd';

describe('AvertissementRgpd', () => {
  let component: AvertissementRgpd;
  let fixture: ComponentFixture<AvertissementRgpd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvertissementRgpd],
    }).compileComponents();

    fixture = TestBed.createComponent(AvertissementRgpd);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
