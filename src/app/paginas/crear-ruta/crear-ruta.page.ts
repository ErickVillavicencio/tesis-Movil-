import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController } from '@ionic/angular';
import { AccessProviders } from '../../providers/access-providers';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-crear-ruta',
  templateUrl: './crear-ruta.page.html',
  styleUrls: ['./crear-ruta.page.scss'],
})
export class CrearRutaPage implements OnInit {


  nombre: string = "";
  fechaInicio: string = "";
  horaInicio: string = "";
  numeroAdultos: string = "";
  numeroNinios: string = "";
  idUsuario: string = "";
  disableButton;

  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private accesPrvds: AccessProviders,
    private storage: Storage,
    public navCtrl: NavController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.idUsuario = this.route.snapshot.paramMap.get('id');

  }

  ionViewDidEnter(){
    this.disableButton = false;
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

  async tryRegistrarRuta(){

    if(this.nombre == ""){
      this.presentToast('Ingrese el nombre de la ruta');
  }
  else   if(this.fechaInicio == ""){
    this.presentToast('Ingrese una fecha inicial');
  }
  else   if(this.horaInicio == ""){
    this.presentToast('Ingrese una hora inicial');
  }
  else   if(this.numeroAdultos == ""){
    this.presentToast('Ingrese el numero de Adultos');
  }
  else   if(this.numeroNinios == ""){
    this.presentToast('Ingrese el numero de Niños');
  }
  else{
    this.disableButton = true;
    const loader = await this.loadingCtrl.create({
      message: 'Espere porfavor',
    });
    loader.present();
    var fechaIniciox = this.fechaInicio.substr(0,10);
    var horaIniciox = fechaIniciox +" " + this.horaInicio +":00";
    return new Promise(resolve =>{
      let body = {
        aksi:'proceso_registrarRuta',
        nombre: this.nombre,        
        numeroAdultos: this.numeroAdultos,
        numeroNinios: this.numeroNinios,
        horaInicio: horaIniciox,
        idUsuario: this.idUsuario,
      }
      this.accesPrvds.postData(body, 'rutaApi.php').subscribe((res:any)=>{
        if(res.success == true){
          console.log('ingresa');
            loader.dismiss();
            this.disableButton = false;
            this.presentToast("Ruta registrada exitosamente");
            this.storage.set('storage_xxx',res.result);// crea el almacenamiento
            this.navCtrl.navigateRoot(['/agregar-puntos']);
        }else{
          console.log('no vale');
            loader.dismiss();
            this.disableButton = false;
            this.presentToast(res.msg);
        }
        },(err)=>{
          loader.dismiss();
          this.disableButton = false;
          this.presentAlert('Tiempo Agotado');          
      });
    });
  }



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
          text: 'Cerrar',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
            //accion
          }
        }, {
          text: 'Volver a intentar',
          handler: () => {
            this.tryRegistrarRuta();
          }
        }
      ]
    });
  }

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
