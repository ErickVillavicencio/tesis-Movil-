import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InformacionPuntoPage } from './informacion-punto.page';

const routes: Routes = [
  {
    path: '',
    component: InformacionPuntoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InformacionPuntoPageRoutingModule {}
