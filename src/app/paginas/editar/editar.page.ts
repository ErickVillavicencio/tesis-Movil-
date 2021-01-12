import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController } from '@ionic/angular';
import { AccessProviders } from '../../providers/access-providers';
import { Storage } from '@ionic/storage';


//mapa...\
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Map, tileLayer, marker, polyline } from 'leaflet';
import * as L from 'leaflet';
import { identifierModuleUrl } from '@angular/compiler';
//_______________________//

@Component({
  selector: 'app-editar',
  templateUrl: './editar.page.html',
  styleUrls: ['./editar.page.scss'],
})
export class EditarPage implements OnInit {

  datastorage: any;
  idUsuario:string;
  nombre: string;
  id: string;
  puntos: any;
  disableButton;


horaInicio : string;
numeroAdultos : number;
numeroNinios : number;



  lista =[];
  filtro =[];
  puntosAgregados =[];
  puntosNoAgregados =[];

  valores =[];
  
  
  categorias =[];
  categoriaSeleccionada = null;

  subCategorias =[];
  listasubCategorias =[];
  subCategoriaSeleccionada= null;
  
  parroquias =[]; 
  parroquiaSeleccionada= null;

  //map//
  map: L.map;
  markerPuntosAgregdos = new Array();
  markerPuntosNoAgregdos = new Array();
  //___-_//

  constructor(

    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private accesPrvds: AccessProviders,
    private storage: Storage,
    public navCtrl: NavController,

  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){


    this.disableButton = false;
    this.storage.get('storage_xxx').then((res) => {
      this.datastorage = res;
      console.log(this.datastorage);
      this.id = this.datastorage[0].idRuta;
      this.selectsController(this.datastorage);
      this.llenarListas(this.datastorage);
      
    });
  }






putSubCategoria(a){
  this.subCategorias=[];
for(var i = 0; i< this.listasubCategorias.length; i++){
var id = this.listasubCategorias[i].id;
var descripcion = this.listasubCategorias[i].descripcion;

if(this.listasubCategorias[i].idCategoria == a){

  this.subCategorias.push({
    "id": id,
    "descripcion": descripcion
  });
}
}
console.log( this.subCategorias);
  }

  selectsController(datastorage){

     //creo y muestro el mapa
     this.map =  L.map('map', {
      center: [0.0893651, -78.4055, 13.5],
      zoom: 13,
      renderer: L.canvas()
    })
    tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    //____//

    this.valores         = datastorage[datastorage.length-5].valores;
    this.nombre          = this.valores[0].nombreRuta;
    this.idUsuario       = this.valores[0].idUsuario;
    this.horaInicio      = this.valores[0].horaInicio;
    this.numeroAdultos   = this.valores[0].numeroAdultos;
    this.numeroNinios    = this.valores[0].numeroNinios;
    this.id              = this.valores[0].idRuta;
    this.parroquias      = datastorage[datastorage.length-4].parroquias;
    this.categorias      = datastorage[datastorage.length-3].categoria;  
    this.listasubCategorias = datastorage[datastorage.length-2].subcategoria;


  }



filtrar(){
  var condicion;

//si los 3 combos estan vacios
  if(this.parroquiaSeleccionada == null && this.categoriaSeleccionada == null && this.subCategoriaSeleccionada == null){
    condicion ='';
    this.proceso_actualizar_filtro(condicion);
   }   
   //si solo el combo parroquia fue elegido
 else if(this.parroquiaSeleccionada != null && this.categoriaSeleccionada == null && this.subCategoriaSeleccionada == null){
 condicion ='AND puntoturistico.idParroquia =' +  this.parroquiaSeleccionada;
 this.proceso_actualizar_filtro(condicion);
}
   //si solo el combo categoria fue elegido
   else if(this.parroquiaSeleccionada == null && this.categoriaSeleccionada != null && this.subCategoriaSeleccionada == null){
    condicion ='AND puntoturistico.categoriaId     =' +  this.categoriaSeleccionada;
    this.proceso_actualizar_filtro(condicion);
   }
//si los combos categoria y subcategoria fueron elejidos
else if(this.parroquiaSeleccionada == null && this.categoriaSeleccionada != null && this.subCategoriaSeleccionada != null){
  condicion =' AND puntoturistico.categoriaId     =' +  this.categoriaSeleccionada +
             ' AND puntoturistico.subCategoriaId  =' +  this.subCategoriaSeleccionada
  this.proceso_actualizar_filtro(condicion);
 }
//si los combos parroquia y categoria fueronelejidos
else if(this.parroquiaSeleccionada != null && this.categoriaSeleccionada != null && this.subCategoriaSeleccionada == null){
  condicion ='AND puntoturistico.idParroquia =' +  this.parroquiaSeleccionada + 
             ' AND puntoturistico.categoriaId =' +  this.categoriaSeleccionada;
  this.proceso_actualizar_filtro(condicion);
 }
 //si todos los combos fueron elejidos
 else if(this.parroquiaSeleccionada != null && this.categoriaSeleccionada != null && this.subCategoriaSeleccionada != null){

  condicion =' AND puntoturistico.idParroquia     =' +  this.parroquiaSeleccionada + 
             ' AND puntoturistico.categoriaId     =' +  this.categoriaSeleccionada +
             ' AND puntoturistico.subCategoriaId  =' +  this.subCategoriaSeleccionada;
  this.proceso_actualizar_filtro(condicion);
 }
}




async proceso_actualizar_filtro(condicion){

 console.log(condicion);
  this.disableButton = true;
  const loader = await this.loadingCtrl.create({
    message: 'Espere porfavor',
  });
  loader.present();
  return new Promise(resolve =>{
    let body = {
      aksi:'proceso_editarRuta_filtro',
      condicion: condicion,
      idRuta: this.id,        
      idUsuario: this.idUsuario,
      nombre : this.nombre,
      horaInicio: this.horaInicio,
      numeroAdultos: this.numeroAdultos,
      numeroNinios: this.numeroNinios    
    }
    this.accesPrvds.postData(body, 'rutaApi.php').subscribe((res:any)=>{
      if(res.success == true){
          loader.dismiss();
          this.disableButton = false;
          this.storage.set('storage_xxx',res.result);// crea el almacenamiento 
         this.navCtrl.navigateRoot(['/editar-f']);
      }else{
          loader.dismiss();
          this.disableButton = false;
          this.presentToast('Error al cargar');      
      }
      },(err)=>{
        loader.dismiss();
        this.disableButton = false;  
        this.presentToast('Tiempo Agotado');             
    });
  });
  }



llenarListas(datastorage){
var prueba =[];
var idx;
var categoria, costoAdulto,costoNinio, id, idRuta,imagen, 
latitud,longuitud,nombre,
parroquia,subcategoria,tiempoEstimado;


longuitud = datastorage.length -1;
prueba = datastorage[longuitud].lista;

for(var i=0; i<prueba.length; i++ ){
idx = prueba[i].idPunto;
this.lista.push(idx);
}

  for(var i=0; i<(datastorage.length)-1; i++){

    categoria = datastorage[i].categoriaNombre; 
    costoAdulto = datastorage[i].costoAdulto; 
    costoNinio = datastorage[i].costoNinio; 
    id = datastorage[i].id; 
    idRuta = datastorage[i].idRuta; 
    imagen = datastorage[i].imagen; 
    latitud = datastorage[i].latitud; 
    longuitud = datastorage[i].longuitud; 
    nombre = datastorage[i].nombre; 
    parroquia = datastorage[i].nombreParroquia; 
    subcategoria = datastorage[i].subcategoriaNombre; 
    tiempoEstimado = datastorage[i].tiempoEstimado; 


if(this.lista.includes(id)){
  this.puntosAgregados.push(  {
    "categoria": categoria,
    "costoAdulto": costoAdulto,
    "costoNinio": costoNinio,
    "id": id,
    "idRuta": idRuta,
    "imagen": imagen,
    "latitud": latitud,
    "longuitud": longuitud,
    "nombre": nombre,
    "parroquia": parroquia,
    "subcategoria": subcategoria,
    "tiempoEstimado": tiempoEstimado
  }); 
}else{
  this.puntosNoAgregados.push(  {
    "categoria": categoria,
    "costoAdulto": costoAdulto,
    "costoNinio": costoNinio,
    "id": id,
    "idRuta": idRuta,
    "imagen": imagen,
    "latitud": latitud,
    "longuitud": longuitud,
    "nombre": nombre,
    "parroquia": parroquia,
    "subcategoria": subcategoria,
    "tiempoEstimado": tiempoEstimado
  }); 
}

  }

  this.crearpuntosAgregados(this.puntosAgregados);
  this.crearpuntosNoAgregados(this.puntosNoAgregados);

}


crearpuntosAgregados(puntos){

  for (let i = 0; i < puntos.length; i++) {

    let idPunto = puntos[i].id;
    let idRuta = this.id;
    let nombre: string = puntos[i].nombreParroquia;
    let dirImagen = 'https://rutaescondida.000webhostapp.com//Tesis/Vista/' + puntos[i].imagen;
    let LamMarker = new L.marker([parseFloat(puntos[i].latitud), parseFloat(puntos[i].longuitud)]
      , {
        icon: L.divIcon({
          html: '<img src="' + dirImagen + '" style="height: 80px;width: 80px;border-radius: 50%; border: solid;border-color: blue">',
          iconSize: [0, 0]
        })
      });
    this.markerPuntosAgregdos.push(LamMarker);
    this.map.addLayer(this.markerPuntosAgregdos[i]);

    //marker[i].bindPopup('<ion-button id="btnInfo" class="btnInfo   color="light">Agregar</ion-button>');
    this.markerPuntosAgregdos[i].bindPopup(
      '<div class="tarjeta">' +
      '<div class="titulo">' +
      '<label>' + puntos[i].nombre + '</label>' +
      '</div>' +
      '<div class="card">' +
      '<br>' +
      '<div class="contenedorImagen"><img class="imgRedonda" src="' + dirImagen + '" /></div>' +
      '<div class="contenedor">' +
      '<div class="separator"></div>' +
      '<TABLE class="tabla" >' +
      '<TR><TH>Parroquia: </TH>' +
      '<TD>' + puntos[i].parroquia + '</TD></TR>' +
      '<TR><TH>Categoria:</TH>' +
      '<TD>' + puntos[i].categoria + '</TD></TR>' +
      '<TR><TH>Subcategoria:</TH>' +
      '<TD>' + puntos[i].subcategoria + '</TR>' +
      '<TR><TH>Costo Adultos:</TH>' +
      '<TD>$' + puntos[i].costoAdulto + '</TR>' +
      '<TR><TH>Costo Niños:</TH>' +
      '<TD>$' + puntos[i].costoNinio + '</TR>' +
      '<TR><TH>Tiempo:</TH>' +
      '<TD>' + puntos[i].tiempoEstimado + '</TR>' +
      '</TABLE>' +
      '<div class="boton" style = "text-align: center;">' +
      '<ion-button id="btnInfo" class="btnInfo color="light">Eliminar</ion-button>' +
      '</div>'
    ).on("popupopen", (a) => {
      var popUp = a.target.getPopup()
      popUp.getElement()
        .querySelector(".btnInfo")
        .addEventListener("click", e => {
          this.tryEliminarPunto(idPunto, idRuta);
          //this.Eliminar(idPunto);      
        });
    })
  
  }
}

crearpuntosNoAgregados(puntos){
  
 for (let i = 0; i < puntos.length; i++) {

    let idPunto = puntos[i].id;
    let idRuta = this.id;
    let dirImagen = 'https://rutaescondida.000webhostapp.com//Tesis/Vista/' + puntos[i].imagen;
    let LamMarker = new L.marker([parseFloat(puntos[i].latitud), parseFloat(puntos[i].longuitud)]
      , {
        icon: L.divIcon({
          html: '<img src="' + dirImagen + '" style="height: 80px;width: 80px;border-radius: 50%; border: solid;border-color: red">',
          iconSize: [0, 0]
        })
      });
    this.markerPuntosNoAgregdos.push(LamMarker);
    this.map.addLayer(this.markerPuntosNoAgregdos[i]);

    //marker[i].bindPopup('<ion-button id="btnInfo" class="btnInfo   color="light">Agregar</ion-button>');
    this.markerPuntosNoAgregdos[i].bindPopup(
      '<div class="tarjeta">' +
      '<div class="titulo">' +
      '<label>' + puntos[i].nombre + '</label>' +
      '</div>' +
      '<div class="card">' +
      '<br>' +
      '<div class="contenedorImagen"><img class="imgRedonda" src="' + dirImagen + '" /></div>' +
      '<div class="contenedor">' +
      '<div class="separator"></div>' +
      '<TABLE class="tabla" >' +
      '<TR><TH>Parroquia: </TH>' +
      '<TD>' + puntos[i].parroquia + '</TD></TR>' +
      '<TR><TH>Categoria:</TH>' +
      '<TD>' + puntos[i].categoria + '</TD></TR>' +
      '<TR><TH>Subcategoria:</TH>' +
      '<TD>' + puntos[i].subcategoria + '</TR>' +
      '<TR><TH>Costo Adultos:</TH>' +
      '<TD>$' + puntos[i].costoAdulto + '</TR>' +
      '<TR><TH>Costo Niños:</TH>' +
      '<TD>$' + puntos[i].costoNinio + '</TR>' +
      '<TR><TH>Tiempo:</TH>' +
      '<TD>' + puntos[i].tiempoEstimado + '</TR>' +
      '</TABLE>' +
      '<div class="boton" style = "text-align: center;">' +
      '<ion-button id="btnInfo" class="btnInfo color="light">Agregar</ion-button>' +
      '</div>'
    ).on("popupopen", (a) => {
      var popUp = a.target.getPopup()
      popUp.getElement()
        .querySelector(".btnInfo")
        .addEventListener("click", e => {
        this.tryAgregarPunto(idPunto, idRuta);      
          //  this.Agregar(idPunto);        
        });
    })
  
  }
}




 async tryEliminarPunto(idPunto, idRuta){
  this.disableButton = true;
  const loader = await this.loadingCtrl.create({
   // message: 'Espere porfavor',
  });
  loader.present();

  return new Promise(resolve =>{
    let body = {
      aksi:'proceso_eliminar_punto',
      idPunto: idPunto,
      idRuta: idRuta
    }
    this.accesPrvds.postData(body, 'rutaApi.php').subscribe((res:any)=>{
      if(res.success == true){
          loader.dismiss();
          this.disableButton = false;
          this.presentAlert('Punto Eliminado');  
          //this.Eliminar(idPunto);
          var condicionx = '';
          this.proceso_actualizar_filtro(condicionx);
      }else{
          loader.dismiss();
          this.disableButton = false;
          this.presentAlert('Error al eliminar el punto');  
      }
      },(err)=>{
        loader.dismiss();
        this.disableButton = false;
        this.presentAlert('Ocurrio un Error');          
    });
  });
  }

  async tryAgregarPunto(idPunto, idRuta) {

    console.log('idPunto: '        + idPunto);
    console.log('idRuta: '         + idRuta);
    
    this.disableButton = true;
    const loader = await this.loadingCtrl.create({
     // message: 'Espere porfavor',
    });
    loader.present();

    return new Promise(resolve =>{
      let body = {
        aksi:'proceso_registrar_punto',
        idPunto: idPunto,
        idRuta: idRuta
      }
      this.accesPrvds.postData(body, 'rutaApi.php').subscribe((res:any)=>{
        if(res.success == true){
            loader.dismiss();
            this.disableButton = false;
            this.presentAlert('Punto Agregado');  
            //this.Agregar(idPunto);
            var condicionx = '';
            this.proceso_actualizar_filtro(condicionx);
        }else{
            loader.dismiss();
            this.disableButton = false;
            this.presentAlert('El punto ya se encuentra agregado a su ruta');  
        }
        },(err)=>{
          loader.dismiss();
          this.disableButton = false;
          this.presentAlert('Tiempo Agotado');          
      });
    });
    
  }
  



Agregar(idPunto){
var posicion;
var item;
var lista = [];
  for (let i = 0; i < this.puntosNoAgregados.length; i++) {
    if(this.puntosNoAgregados[i].id.includes(idPunto)){  
      
      posicion = i;
      item = this.puntosNoAgregados[posicion];
      
      this.puntosNoAgregados.splice(posicion,1);
      this.puntosAgregados.push(item);
  
        this.map.removeLayer(this.markerPuntosNoAgregdos[posicion]);

        for(let j=0;j<this.markerPuntosAgregdos.length;j++) {
          this.map.removeLayer(this.markerPuntosAgregdos[j]);
          } 

          this.markerPuntosAgregdos = [];
        var puntos = this.puntosAgregados;

        for (let i = 0; i < puntos.length; i++) {
          let idPunto = puntos[i].id;
          let idRuta = puntos[i].idRuta;
          let dirImagen = 'https://rutaescondida.000webhostapp.com//Tesis/Vista/' + puntos[i].imagen;
          let LamMarker = new L.marker([parseFloat(puntos[i].latitud), parseFloat(puntos[i].longuitud)]
            , {
              icon: L.divIcon({
                html: '<img src="' + dirImagen + '" style="height: 80px;width: 80px;border-radius: 50%; border: solid;border-color: blue">',
                iconSize: [0, 0]
              })
            });
          this.markerPuntosAgregdos.push(LamMarker);
          this.map.addLayer(this.markerPuntosAgregdos[i]);      
      
          this.markerPuntosAgregdos[i].bindPopup(
            '<div class="tarjeta">' +
            '<div class="titulo">' +
            '<label>' + puntos[i].nombre + '</label>' +
            '</div>' +
            '<div class="card">' +
            '<br>' +
            '<div class="contenedorImagen"><img class="imgRedonda" src="' + dirImagen + '" /></div>' +
            '<div class="contenedor">' +
            '<div class="separator"></div>' +
            '<TABLE class="tabla" >' +
            '<TR><TH>Parroquia: </TH>' +
            '<TD>' + puntos[i].parroquia + '</TD></TR>' +
            '<TR><TH>Categoria:</TH>' +
            '<TD>' + puntos[i].categoria + '</TD></TR>' +
            '<TR><TH>Subcategoria:</TH>' +
            '<TD>' + puntos[i].subcategoria + '</TR>' +
            '<TR><TH>Costo Adultos:</TH>' +
            '<TD>$' + puntos[i].costoAdulto + '</TR>' +
            '<TR><TH>Costo Niños:</TH>' +
            '<TD>$' + puntos[i].costoNinio + '</TR>' +
            '<TR><TH>Tiempo:</TH>' +
            '<TD>' + puntos[i].tiempoEstimado + '</TR>' +
            '</TABLE>' +
            '<div class="boton" style = "text-align: center;">' +
            '<ion-button id="btnInfo" class="btnInfo color="light">Eliminar</ion-button>' +
            '</div>'
          ).on("popupopen", (a) => {
            var popUp = a.target.getPopup()
            popUp.getElement()
              .querySelector(".btnInfo")
              .addEventListener("click", e => {
              this.tryEliminarPunto(idPunto, idRuta);
              //this.Eliminar(idPunto); 
              });
          })
        
        }
      }         
}
}


Eliminar(idPunto){
  var posicion;
  var item;
  var lista = [];
    for (let i = 0; i < this.puntosAgregados.length; i++) {
      if(this.puntosAgregados[i].id.includes(idPunto)){  
        
        posicion = i;
        item = this.puntosAgregados[posicion];
        
        this.puntosAgregados.splice(posicion,1);
        this.puntosNoAgregados.push(item);
    
          this.map.removeLayer(this.markerPuntosAgregdos[posicion]);
  
          for(let j=0;j<this.markerPuntosNoAgregdos.length;j++) {
            this.map.removeLayer(this.markerPuntosNoAgregdos[j]);
            } 
  
            this.markerPuntosNoAgregdos = [];
            var puntos = this.puntosNoAgregados;

         //revisar q no agrega e lpunto eliminado
            for (let i = 0; i < puntos.length; i++) {
              let idPunto = puntos[i].id;
              let idRuta = puntos[i].idRuta;
              let dirImagen = 'https://rutaescondida.000webhostapp.com//Tesis/Vista/' + puntos[i].imagen;
              let LamMarker = new L.marker([parseFloat(puntos[i].latitud), parseFloat(puntos[i].longuitud)]
                , {
                  icon: L.divIcon({
                    html: '<img src="' + dirImagen + '" style="height: 80px;width: 80px;border-radius: 50%; border: solid;border-color: red">',
                    iconSize: [0, 0]
                  })
                });
              this.markerPuntosNoAgregdos.push(LamMarker);
              this.map.addLayer(this.markerPuntosNoAgregdos[i]);      
          
              this.markerPuntosNoAgregdos[i].bindPopup(
                '<div class="tarjeta">' +
                '<div class="titulo">' +
                '<label>' + puntos[i].nombre + '</label>' +
                '</div>' +
                '<div class="card">' +
                '<br>' +
                '<div class="contenedorImagen"><img class="imgRedonda" src="' + dirImagen + '" /></div>' +
                '<div class="contenedor">' +
                '<div class="separator"></div>' +
                '<TABLE class="tabla" >' +
                '<TR><TH>Parroquia: </TH>' +
                '<TD>' + puntos[i].parroquia + '</TD></TR>' +
                '<TR><TH>Categoria:</TH>' +
                '<TD>' + puntos[i].categoria + '</TD></TR>' +
                '<TR><TH>Subcategoria:</TH>' +
                '<TD>' + puntos[i].subcategoria + '</TR>' +
                '<TR><TH>Costo Adultos:</TH>' +
                '<TD>$' + puntos[i].costoAdulto + '</TR>' +
                '<TR><TH>Costo Niños:</TH>' +
                '<TD>$' + puntos[i].costoNinio + '</TR>' +
                '<TR><TH>Tiempo:</TH>' +
                '<TD>' + puntos[i].tiempoEstimado + '</TR>' +
                '</TABLE>' +
                '<div class="boton" style = "text-align: center;">' +
                '<ion-button id="btnInfo" class="btnInfo color="light">Agregar</ion-button>' +
                '</div>'
              ).on("popupopen", (a) => {
                var popUp = a.target.getPopup()
                popUp.getElement()
                  .querySelector(".btnInfo")
                  .addEventListener("click", e => {
                  this.tryAgregarPunto(idPunto, idRuta);    
                //this.Agregar(idPunto); 
                  });
              })
            
            }

          
        }         
  }
  }



  async generarRuta() {

    this.disableButton = true;
    const loader = await this.loadingCtrl.create({
      message: 'Espere porfavor',
    });
    loader.present();
    return new Promise(resolve =>{
      let body = {
        aksi:'proceso_generar_ruta',
        idRuta: this.id,          
        nombre: this.nombre,
        horaInicio: this.horaInicio,
        idUsuario: this.idUsuario,
        numeroAdultos: this.numeroAdultos,
        numeroNinios: this.numeroNinios             
      }

      this.accesPrvds.postData(body, 'rutaApi.php').subscribe((res:any)=>{ 
        if(res.success == true){
            loader.dismiss();
            this.disableButton = false;
            //this.presentAlert('se guarda'); 
            this.storage.set('storage_xxx',res.result);// crea el almacenamiento 
            this.navCtrl.navigateRoot(['/ruta']);
        }else{
            loader.dismiss();
            this.disableButton = false;
            this.presentAlert('Error');  
        }
        },(err)=>{
          loader.dismiss();
          this.disableButton = false;
          this.presentAlert('Tiempo Agotado');          
      });
    });
  }








  async proceso_mis_rutas(){

    this.disableButton = true;
    const loader = await this.loadingCtrl.create({
      message: 'Espere porfavor',
    });
    loader.present();
  
    return new Promise(resolve =>{
      let body = {
        aksi:'proceso_rutas',
        idUsuario : this.idUsuario
      }
      this.accesPrvds.postData(body, 'rutaApi.php').subscribe((res:any)=>{
        if(res.success == true){
            loader.dismiss();
            this.disableButton = false;
            //this.presentToast('Logeo Exitoso');
            this.storage.set('storage_xxx',res.result);// crea el almacenamiento la secion
            this.navCtrl.navigateForward('/mis-rutas');
        }else{
            loader.dismiss();
            this.disableButton = false;
            this.presentToast('Error al cargar la Informacion');
        }
        },(err)=>{
  
          loader.dismiss();
          this.disableButton = false;
          this.presentToast('Tiempo Agotado');          
      });
    });
  
  }



  async presentToast(a){
    const toast = await this.toastCtrl.create({
      message: a,
      duration: 1500,
      position: 'top'
    });
    toast.present();
  }



  async presentAlert(a) {
    const alert = await this.alertCtrl.create({
      header: a,
      backdropDismiss: false,
      buttons: [
        {
          text: 'Aceptar',
          handler: (blah) => {
          }
        }
      ]
    });

    await alert.present();
  }

}
