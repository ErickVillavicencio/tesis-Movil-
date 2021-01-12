import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InformacionPuntoPageRoutingModule } from './informacion-punto-routing.module';

import { InformacionPuntoPage } from './informacion-punto.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformacionPuntoPageRoutingModule
  ],
  declarations: [InformacionPuntoPage]
})
export class InformacionPuntoPageModule {}
