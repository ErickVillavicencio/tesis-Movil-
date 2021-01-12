import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InformacionPuntoPage } from './informacion-punto.page';

describe('InformacionPuntoPage', () => {
  let component: InformacionPuntoPage;
  let fixture: ComponentFixture<InformacionPuntoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformacionPuntoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InformacionPuntoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
