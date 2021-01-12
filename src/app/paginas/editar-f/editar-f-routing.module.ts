import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditarFPage } from './editar-f.page';

const routes: Routes = [
  {
    path: '',
    component: EditarFPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditarFPageRoutingModule {}
