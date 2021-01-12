import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController,LoadingController, AlertController } from '@ionic/angular';
import { AccessProviders } from '../../providers/access-providers';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {


  nombres: string = "";
  apellidos: string = "";
  usuario: string = "";
  clave: string = "";
  claveconf: string = "";
  correo: string = "";

  disableButton;


  constructor(
    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private accesPrvds: AccessProviders

  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
   this.disableButton = false;
  }

 async tryRegistrar(){
    if(this.nombres == ""){
        this.presentToast('Ingrese sus Nombres');
    }
    else   if(this.apellidos == ""){
      this.presentToast('Ingrese sus Apellidos');
    }
    else   if(this.usuario == ""){
      this.presentToast('Ingrese el Nombre de Usuario');
    }
    else   if(this.clave == ""){
      this.presentToast('Ingrese su Contraseña');
    }
    else   if(this.claveconf != this.clave){
      this.presentToast('Las Contraseñas no coinciden');
    }
    else   if(this.correo == ""){
      
      this.presentToast('Ingrese su Correo');
    }
    else{
      this.disableButton = true;
      const loader = await this.loadingCtrl.create({
        message: 'Espere porfavor',
      });
      loader.present();

      return new Promise(resolve =>{
        let body = {
          aksi:'proceso_registrar',
          nombres: this.nombres,
          apellidos: this.apellidos,
          usuario: this.usuario,
          clave: this.clave,
          correo: this.correo
        }
        this.accesPrvds.postData(body, 'usuarioApi.php').subscribe((res:any)=>{
          if(res.success == true){
              loader.dismiss();
              this.disableButton = false;
              this.presentToast(res.msg);
              this.router.navigate(['/login']);
          }else{
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
            this.tryRegistrar();
          }
        }
      ]
    });

    await alert.present();
  }

}
