import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditarFPageRoutingModule } from './editar-f-routing.module';

import { EditarFPage } from './editar-f.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditarFPageRoutingModule
  ],
  declarations: [EditarFPage]
})
export class EditarFPageModule {}
