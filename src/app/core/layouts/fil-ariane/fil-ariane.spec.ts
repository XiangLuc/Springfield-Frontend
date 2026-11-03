import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FilAriane } from './fil-ariane';

describe('FilAriane', () => {
  let component: FilAriane;
  let fixture: ComponentFixture<FilAriane>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilAriane],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FilAriane);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
