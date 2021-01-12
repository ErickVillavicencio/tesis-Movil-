import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController } from '@ionic/angular';
import { AccessProviders } from '../../providers/access-providers';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-informacion-punto',
  templateUrl: './informacion-punto.page.html',
  styleUrls: ['./informacion-punto.page.scss'],
})
export class InformacionPuntoPage implements OnInit {

  datastorage: any;

  id: string;
  nombre: string;
  descripcion: string;
  latitud: string;
  longuitud: string;
  costoAdulto: string;
  costoNinio: string;
  tiempoEstimado: string;
  facebook: string;
  twitter: string;
  instagram: string;
  nombreParroquia: string;
  categoriaNombre: string;
  subcategoriaNombre: string;
  imagen1: string;
  imagen2: string;
  imagen3: string;
  idUsuario: string;
  disableButton;
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
      console.log(res);
      this.datastorage = res;
      this.id = this.datastorage[0].id;
      this.nombre = this.datastorage[0].nombre;
      this.descripcion = this.datastorage[0].descripcion;
      this.latitud = this.datastorage[0].latitud;
      this.longuitud = this.datastorage[0].longuitud;
      this.costoAdulto = this.datastorage[0].costoAdulto;
      this.costoNinio = this.datastorage[0].costoNinio;
      this.tiempoEstimado = this.datastorage[0].tiempoEstimado;
      this.facebook = this.datastorage[0].facebook;
      this.twitter = this.datastorage[0].twitter;
      this.instagram = this.datastorage[0].instagram;
      this.nombreParroquia = this.datastorage[0].nombreParroquia;
      this.categoriaNombre = this.datastorage[0].categoriaNombre;
      this.subcategoriaNombre = this.datastorage[0].subcategoriaNombre;
      this.imagen1 ='https://rutaescondida.000webhostapp.com//Tesis/Vista/' +  this.datastorage[0].imagen;
      this.imagen2 ='https://rutaescondida.000webhostapp.com//Tesis/Vista/' + this.datastorage[1].imagen;
      this.imagen3 ='https://rutaescondida.000webhostapp.com//Tesis/Vista/' +this.datastorage[2].imagen;
      this.idUsuario = this.datastorage[0].idUsuario;
    });
  }


  async proceso_inicio(){
      this.disableButton = true;
      const loader = await this.loadingCtrl.create({
        message: 'Espere porfavor',
      });
      loader.present();

      return new Promise(resolve =>{
        let body = {
          aksi:'proceso_puntosHome',
          idUsuario : this.idUsuario
        }
        this.accesPrvds.postData(body, 'puntoTuristicoApi.php').subscribe((res:any)=>{
          console.log("ingresa al metodo");
          if(res.success == true){
            console.log("ingresa");
              loader.dismiss();
              this.disableButton = false;
              //this.presentToast('Logeo Exitoso');
              this.storage.set('storage_xxx',res.result);// crea el almacenamiento la secion
              this.navCtrl.navigateRoot(['/home']);
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
      duration: 1500
    });
    toast.present();
  }







}
