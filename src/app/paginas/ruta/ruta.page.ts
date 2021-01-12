import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController } from '@ionic/angular';
import { AccessProviders } from '../../providers/access-providers';
import { Storage } from '@ionic/storage';


import Leaflet from 'leaflet';
import 'leaflet-routing-machine';

//mapa...\

/*
declare let L;
import '../../../../node_modules/leaflet-routing-machine/dist/leaflet-routing-machine.js';
*/
declare var L: any;

//_______________________//

@Component({
  selector: 'app-ruta',
  templateUrl: './ruta.page.html',
  styleUrls: ['./ruta.page.scss'],
})
export class RutaPage implements OnInit {


  mapa: any;


  disableButton;
  datastorage: any;
  longuitud: any;
  idRuta: string;
  idUsuario:string;
  nombreRuta: string;
  costo: any;
  prueba: string;
  inicioh: string;
  finh: string;
  data = [];
  data1 = [];

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
      console.log(this.datastorage);
      this.idRuta = this.datastorage[0].idRuta;
      this.costo = this.datastorage[0].costoTotal;
      this.idUsuario = this.datastorage[0].idUsuario;
      this.nombreRuta = this.datastorage[0].nombre;
      this.inicioh = this.datastorage[0].inicioTrayecto;
      this.longuitud = this.datastorage.length;
      this.finh = this.datastorage[this.longuitud - 1].finTrayecto;
      this.trazarRuta(this.datastorage);
      this.llenarTablaPuntos(this.datastorage);
      this.llenarTablaPuntosTiempo(this.datastorage);
      
    });

  }


  trazarRuta(datastorage){
 
    var marker = new Array();
// marcador del mapa
this.mapa = Leaflet.map('map').setView([0.0893651, -78.4055], 35.5);
Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '© Open Street Map',
zoom: 8,
maxZoom: 18,
minZoom: 4,
minResolution: 4891.96981025128,
maxResolution: 39135.75848201024,
doubleClickZoom: true
}).addTo(this.mapa);
  var waypoint  = [];
  var marker_icon = null;
    for (var i = 0; i < datastorage.length; i++) {
      let dirImagen = 'https://rutaescondida.000webhostapp.com//Tesis/Vista/' + datastorage[i].imagen;
      let LamMarker = new L.marker([parseFloat(datastorage[i].latitud), parseFloat(datastorage[i].longuitud)]
        , {
          icon: L.divIcon({
            html: '<img src="' + dirImagen + '" style="height: 50px;width: 50px;border-radius: 50%; border: solid;border-color: blue">',
            iconSize: [0, 0]
          })
        });
      marker.push(LamMarker);
      this.mapa.addLayer(marker[i]); 
      marker[i].bindPopup(
        '<div class="tarjeta">' +
        '<div class="titulo">' +
        '<label>' + datastorage[i].inicio + '</label>' +
        '</div>' +
        '<div class="card">' +
        '<br>' +
        '<div class="contenedorImagen"><img class="imgRedonda" src="' + dirImagen + '" /></div>' +
        '<div class="contenedor">' +
        '<div class="separator"></div>'
      )
      var wpt = L.Routing.waypoint(L.latLng(datastorage[i].latitud, datastorage[i].longuitud))      
      waypoint.push(wpt);
  }
  Leaflet.Routing.control({
    waypoints: waypoint ,
    routeWhileDragging: true
  }).addTo(this.mapa);
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
      console.log("ingresa al metodo");
      if(res.success == true){
        console.log("ingresa");
          loader.dismiss();
          this.disableButton = false;
          //this.presentToast('Logeo Exitoso');
          this.storage.set('storage_xxx',res.result);// crea el almacenamiento la secion
          this.navCtrl.navigateForward('/mis-rutas');
      }else{
        console.log("no ingresa");
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

  llenarTablaPuntosTiempo(datastorage) {

    var longuitud = datastorage.length;
    var inicio: string;
    var fin: string;
    var distancia: any;
    var distanciac: string;
    var recorrido: string;
    var horas: number;
    var minutos: number;
    var segundos: number;

    for (var i = 0; i < longuitud; i++) {

      distancia = datastorage[i].distancia;
      inicio = datastorage[i].inicio;
      fin = datastorage[i].fin;
      recorrido = datastorage[i].recorrido;
      horas = Math.floor(datastorage[i].tiempo / 3600);
      minutos = Math.floor((datastorage[i].tiempo - (horas * 3600)) / 60);
      segundos = Math.floor(datastorage[i].tiempo - (horas * 3600) - (minutos * 60));

      if (Math.round(distancia * 1000) < 1000) {
        distanciac = Math.round(distancia * 1000) + ' m';
      } else {
        distanciac = distancia.toFixed(3) + ' Km';
      }
      this.data1.push({
        "inicio": inicio,
        "fin": fin,
        "horas": horas,
        "minutos": minutos,
        "segundos": segundos,
        "recorrido": recorrido,
        "distancia": distanciac
      });
    }
    return this.data;
  }


  llenarTablaPuntos(datastorage) {

    var longuitud = datastorage.length;
    var punto: string;
    var puntof: string;
    var tiempo: any;
    var x: any;
    var horaInicio: string;
    var horafin: string;
    var horaFin: string;
    var tipoRecorido: string;
    var tiempoestimado: any;

    for (var i = 0; i < longuitud; i++) {

      punto = datastorage[i].inicio;
      puntof = datastorage[i].fin;
      tiempo = datastorage[i].tiempo;
      x = datastorage[i].horaInicio;
      horaInicio = datastorage[i].inicioTrayecto;
      horaFin = datastorage[i].finTrayecto;
      tipoRecorido = datastorage[i].recorrido;
      tiempoestimado = datastorage[i].tiempoEstimado;

      this.data.push({
        "punto": punto,
        "tiempo": tiempoestimado,
        "inicio": horaInicio,
        "fin": horaFin
      });
    }
    return this.data;
  }



}
