import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController,LoadingController, AlertController,NavController } from '@ionic/angular';
import { AccessProviders } from '../../providers/access-providers';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {


  usuario: string = "";
  clave: string = "";

  disableButton;

  constructor(

    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private accesPrvds: AccessProviders,
    private storage : Storage,
    public navCtrl : NavController

  ) { }

  ngOnInit() {
  }

  ionViewDidEnter(){
    this.disableButton = false;
   }

  abrirRegistrar(){
    this.router.navigate(['/registro']);
  }


  async tryLogin(){
    if(this.usuario == ""){
      this.presentToast('Ingrese el Nombre de Usuario');
    }   
    else if(this.clave == ""){
      this.presentToast('Ingrese su Contraseña');
    }    
    else{
      this.disableButton = true;
      const loader = await this.loadingCtrl.create({
        message: 'Espere porfavor',
      });
      loader.present();

      return new Promise(resolve =>{
        let body = {
          aksi:'proceso_login',
          usuario: this.usuario,
          clave: this.clave
        }
        this.accesPrvds.postData(body, 'usuarioApi.php').subscribe((res:any)=>{
          if(res.success == true){
              loader.dismiss();
              this.disableButton = false;
              this.presentToast('Logeo Exitoso');
              this.storage.set('storage_xxx',res.result);// crea el almacenamiento 
              this.navCtrl.navigateRoot(['/home']);
          }else{
              loader.dismiss();
              this.disableButton = false;
              this.presentToast('Usuario o Contraseña incorrectos');
          }
          },(err)=>{
            loader.dismiss();
            this.disableButton = false;
            this.presentToast('Tiempo Agotado');          
        });
      });
    }
  }


  async presentToast(a){
    const toast = await this.toastCtrl.create({
      message: a,
      duration: 1500
    });
    toast.present();
  }



}
