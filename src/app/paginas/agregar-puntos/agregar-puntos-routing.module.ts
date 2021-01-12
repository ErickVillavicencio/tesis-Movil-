import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarPuntosPage } from './agregar-puntos.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarPuntosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarPuntosPageRoutingModule {}
