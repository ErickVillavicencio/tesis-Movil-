import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarPuntosPageRoutingModule } from './agregar-puntos-routing.module';

import { AgregarPuntosPage } from './agregar-puntos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarPuntosPageRoutingModule
  ],
  declarations: [AgregarPuntosPage]
})
export class AgregarPuntosPageModule {}
