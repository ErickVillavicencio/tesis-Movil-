import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditarFPage } from './editar-f.page';

describe('EditarFPage', () => {
  let component: EditarFPage;
  let fixture: ComponentFixture<EditarFPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarFPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditarFPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
