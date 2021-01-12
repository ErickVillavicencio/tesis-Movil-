import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MisRutasPageRoutingModule } from './mis-rutas-routing.module';

import { MisRutasPage } from './mis-rutas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MisRutasPageRoutingModule
  ],
  declarations: [MisRutasPage]
})
export class MisRutasPageModule {}
