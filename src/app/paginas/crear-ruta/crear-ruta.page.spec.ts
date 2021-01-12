import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CrearRutaPage } from './crear-ruta.page';

describe('CrearRutaPage', () => {
  let component: CrearRutaPage;
  let fixture: ComponentFixture<CrearRutaPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearRutaPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CrearRutaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
