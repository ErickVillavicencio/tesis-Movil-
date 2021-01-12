import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController } from '@ionic/angular';
import { AccessProviders } from '../../providers/access-providers';
import { Storage } from '@ionic/storage';
import { CompileShallowModuleMetadata } from '@angular/compiler';

//mapa...\
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Map, tileLayer, marker, polyline } from 'leaflet';
import * as L from 'leaflet';
//_______________________//


@Component({
  selector: 'app-agregar-puntos',
  templateUrl: './agregar-puntos.page.html',
  styleUrls: ['./agregar-puntos.page.scss'],
})
export class AgregarPuntosPage implements OnInit {

  nombre: string ;
  fechaInicio: string ;
  horaInicio: string ;
  numeroAdultos: string ;
  numeroNinios: string ;
  idUsuario: string ;
  id: string ;
  disableButton;
  datastorage: any;


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
  //___-_//

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private accesPrvds: AccessProviders,
    private accesPrvds2: AccessProviders,
    private storage: Storage,
    public navCtrl: NavController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){

    this.disableButton = false;
    this.storage.get('storage_xxx').then((res) => {
     this.datastorage = res;       
     console.log(this.datastorage);  
      this.cargarmapa(this.datastorage);
      this.cargarPuntos(this.datastorage);      
     });

}


cargarmapa(datastorage){

     //creo y muestro el mapa
     this.map = L.map('map', {
      center: [0.0893651, -78.4055, 13.5],
      zoom: 13,
      renderer: L.canvas()
    });
    tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
    //____//

    var longuitud          = Object.keys(datastorage).length;
    
    if(longuitud<=4){
      longuitud= longuitud +1;
    }

    this.valores           = datastorage[longuitud-4].valores;   
    this.nombre          = this.valores[0].nombreRuta;
    this.idUsuario       = this.valores[0].idUsuario;
    this.horaInicio      = this.valores[0].horaInicio;
    this.numeroAdultos   = this.valores[0].numeroAdultos;
    this.numeroNinios    = this.valores[0].numeroNinios;
    this.id              = this.valores[0].idRuta;

    this.parroquias      = datastorage[longuitud-3].parroquias;
    this.categorias      = datastorage[longuitud-2].categoria;  
    this.listasubCategorias = datastorage[longuitud-1].subcategoria;
    
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
            aksi:'proceso_filtro_agregar',
            condicion: condicion,
            idRuta: this.id,        
            idUsuario: this.idUsuario,
            nombre : this.nombre
          }
          this.accesPrvds.postData(body, 'rutaApi.php').subscribe((res:any)=>{
            if(res.success == true){
                loader.dismiss();
                this.disableButton = false;
                this.storage.set('storage_xxx',res.result);// crea el almacenamiento 
              this.navCtrl.navigateRoot(['/crud']);
               // console.log(res.result );
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



    cargarPuntos(datastorage) {

      var marker = new Array();
      for (let i = 0; i < datastorage.length -4; i++) {
        let idPuntoL = datastorage[i].id;
        let idUser = this.idUsuario;
        let idRuta = this.id;
        let dirImagen = 'https://rutaescondida.000webhostapp.com//Tesis/Vista/' + datastorage[i].imagen;
        let LamMarker = new L.marker([parseFloat(datastorage[i].latitud), parseFloat(datastorage[i].longuitud)]
          , {
            icon: L.divIcon({
              html: '<img src="' + dirImagen + '" style="height: 80px;width: 80px;border-radius: 50%; border: solid;border-color: blue">',
              iconSize: [0, 0]
            })
          });
        marker.push(LamMarker);
        this.map.addLayer(marker[i]);

        //marker[i].bindPopup('<ion-button id="btnInfo" class="btnInfo   color="light">Agregar</ion-button>');
        marker[i].bindPopup(
          '<div class="tarjeta">' +
          '<div class="titulo">' +
          '<label>' + datastorage[i].nombre + '</label>' +
          '</div>' +
          '<div class="card">' +
          '<br>' +
          '<div class="contenedorImagen"><img class="imgRedonda" src="' + dirImagen + '" /></div>' +
          '<div class="contenedor">' +
          '<div class="separator"></div>' +
          '<TABLE class="tabla" >' +
          '<TR><TH>Parroquia: </TH>' +
          '<TD>' + datastorage[i].nombreParroquia + '</TD></TR>' +
          '<TR><TH>Categoria:</TH>' +
          '<TD>' + datastorage[i].categoriaNombre + '</TD></TR>' +
          '<TR><TH>Subcategoria:</TH>' +
          '<TD>' + datastorage[i].subcategoriaNombre + '</TR>' +
          '<TR><TH>Costo Adultos:</TH>' +
          '<TD>$' + datastorage[i].costoAdulto + '</TR>' +
          '<TR><TH>Costo Niños:</TH>' +
          '<TD>$' + datastorage[i].costoNinio + '</TR>' +
          '<TR><TH>Tiempo:</TH>' +
          '<TD>' + datastorage[i].tiempoEstimado + '</TR>' +
          '</TABLE>' +
          '<div class="boton" style = "text-align: center;">' +
          '<ion-button id="btnInfo" class="btnInfo color="light">Agregar</ion-button>' +
          '</div>'
        ).on("popupopen", (a) => {
          var popUp = a.target.getPopup()
          popUp.getElement()
            .querySelector(".btnInfo")
            .addEventListener("click", e => {
              this.tryAgregarPunto(idPuntoL, idRuta);
            });
        })
      }
    }

    async tryAgregarPunto(idPunto, idRuta) {

      this.disableButton = true;
      const loader = await this.loadingCtrl.create({
        message: 'Espere porfavor',
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
        console.log(' q pasa');
        this.accesPrvds.postData(body, 'rutaApi.php').subscribe((res:any)=>{ 
          if(res.success == true){
              loader.dismiss();
              this.disableButton = false;
              //this.presentAlert('se guarda'); 
              this.storage.set('storage_xxx',res.result);// crea el almacenamiento 
              //console.log(res.result);
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



    async presentToast(a) {
      const toast = await this.toastCtrl.create({
        message: a,
        duration: 2500
      });
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
