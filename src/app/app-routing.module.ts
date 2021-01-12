import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./paginas/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'intro',
    loadChildren: () => import('./paginas/intro/intro.module').then( m => m.IntroPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./paginas/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'registro',
    loadChildren: () => import('./paginas/registro/registro.module').then( m => m.RegistroPageModule)
  },
  {
    path: 'crud',
    loadChildren: () => import('./paginas/crud/crud.module').then( m => m.CrudPageModule)
  },
  {
    path: 'informacion-punto',
    loadChildren: () => import('./paginas/informacion-punto/informacion-punto.module').then( m => m.InformacionPuntoPageModule)
  },
  {
    path: 'crear-ruta/:id',
    loadChildren: () => import('./paginas/crear-ruta/crear-ruta.module').then( m => m.CrearRutaPageModule)
  },
  {
    path: 'mis-rutas',
    loadChildren: () => import('./paginas/mis-rutas/mis-rutas.module').then( m => m.MisRutasPageModule)
  },
  {
    path: 'ruta',
    loadChildren: () => import('./paginas/ruta/ruta.module').then( m => m.RutaPageModule)
  },
  {
    path: 'editar',
    loadChildren: () => import('./paginas/editar/editar.module').then( m => m.EditarPageModule)
  },
  {
    path: 'agregar-puntos',
    loadChildren: () => import('./paginas/agregar-puntos/agregar-puntos.module').then( m => m.AgregarPuntosPageModule)
  },
  {
    path: 'editar-f',
    loadChildren: () => import('./paginas/editar-f/editar-f.module').then( m => m.EditarFPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
