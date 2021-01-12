import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController } from '@ionic/angular';
import { AccessProviders } from '../../providers/access-providers';
import { Storage } from '@ionic/storage';


//mapa...\
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Map, tileLayer, marker, polyline } from 'leaflet';
import * as L from 'leaflet';
//_______________________//

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  global: any;
  datastorage: any;
  usuario: string;
  id: string;
  puntos: any;
  disableButton;
  //map//
  map: L.map;
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

  ionViewDidEnter() {
    this.disableButton = false;
    this.storage.get('storage_xxx').then((res) => {
      this.datastorage = res;
      this.usuario = this.datastorage[0].usuario;
      this.id = this.datastorage[0].id;
      this.crearMapa();
      this.cargarPuntos(this.datastorage);
    });
   
  }

  crearMapa() {
 //creo y muestro el mapa
 this.map = L.map('map', {
  center: [0.0893651, -78.4055, 14.5],
  zoom: 13,
  renderer: L.canvas()
})
tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

  }

  crearRutaPag() {
    this.navCtrl.navigateForward('/crear-ruta/' + this.id);
  }



  async misRutasPag() { 

    this.disableButton = true;
    const loader = await this.loadingCtrl.create({
      message: 'Espere porfavor',
    });
    loader.present();

    return new Promise(resolve =>{
      let body = {
        aksi:'proceso_rutas',
        idUsuario : this.id
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


  cargarPuntos(datastorage) {
    var marker = new Array();
    for (let i = 0; i < datastorage.length; i++) {
      let idPuntoL = datastorage[i].idPunto;
      let idUser = datastorage[i].id;
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
        '<ion-button id="btnInfo" class="btnInfo color="light">Ver</ion-button>' +
        '</div>'
      ).on("popupopen", (a) => {
        var popUp = a.target.getPopup()
        popUp.getElement()
          .querySelector(".btnInfo")
          .addEventListener("click", e => {
            this.tryInformacionPunto(idPuntoL, idUser);
          });
      })
    }
  }

  async tryInformacionPunto(idPunto, idUser) {
    var idP = idPunto;
    var idUser = idUser;
    this.disableButton = true;
    const loader = await this.loadingCtrl.create({
      message: 'Espere porfavor',
    });
    loader.present();

    return new Promise(resolve => {
      let body = {
        aksi: 'proceso_informacionPunto',
        idPunto: idP,
        idUsuario: idUser
      }

      this.accesPrvds.postData(body, 'puntoTuristicoApi.php').subscribe((res: any) => {
        if (res.success == true) {
          loader.dismiss();
          this.disableButton = false;
          this.presentToast('Busqueda Exitoso');
          this.storage.set('storage_xxx', res.result);// crea el almacenamiento la secion
          this.navCtrl.navigateRoot(['/informacion-punto']);
        } else {
          loader.dismiss();
          this.disableButton = false;
          this.presentToast('Error al mostrar la informacion del punto');
        }
      }, (err) => {
        loader.dismiss();
        this.disableButton = false;
        this.presentToast('Tiempo Agotado');
      });
    });
  }



  async presentToast(a) {
    const toast = await this.toastCtrl.create({
      message: a,
      duration: 1500
    });
  }

  //---------------------//

  async proceso_salir() {
    this.storage.clear();
    this.navCtrl.navigateRoot(['/intro']);
    const toast = await this.toastCtrl.create({
      message: 'Cesion cerrada correctamente',
      duration: 1500
    });
    toast.present();
  }















}
