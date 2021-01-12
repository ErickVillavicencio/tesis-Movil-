import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController, LoadingController, AlertController, NavController } from '@ionic/angular';
import { AccessProviders } from '../../providers/access-providers';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-mis-rutas',
  templateUrl: './mis-rutas.page.html',
  styleUrls: ['./mis-rutas.page.scss'],
})
export class MisRutasPage implements OnInit {
  
  datastorage: any;
  idUsuario: string = "";
  disableButton;
  rutas =[];
  constructor(

    private router: Router,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private accesPrvds: AccessProviders,
    private storage: Storage,
    public navCtrl: NavController,
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {   
  }


  ionViewDidEnter() {
    this.disableButton = false;
    this.storage.get('storage_xxx').then((res) => {
      this.datastorage = res;
      this.idUsuario = this.datastorage[0].idUsuario;
      this.llenarTablaRutas(this.datastorage);
    });
  }



  llenarTablaRutas(datastorage){

    var longuitud = datastorage.length ;


    var id : number;
    var nombre : string;
    var horaInicio : string;
    var horaFin : string;
    var costoTotal : number;
    var numeroAdultos : number;
    var numeroNinios : number;

    for(var i = 0 ; i <longuitud; i++ ){  

      id = datastorage[i].id;
      nombre = datastorage[i].nombre;
      horaInicio = datastorage[i].horaInicio;
      horaFin = datastorage[i].horaFin;
      costoTotal = datastorage[i].costoTotal; 
      numeroAdultos = datastorage[i].numeroAdultos; 
      numeroNinios = datastorage[i].numeroNinios; 
     
     this.rutas.push(  {
       "id": id,
       "nombre": nombre,
       "horaInicio": horaInicio,
       "horaFin": horaFin,
       "costoTotal": costoTotal,
       "numeroAdultos": numeroAdultos,
       "numeroNinios": numeroNinios
     }); 
     
     }
     return this.rutas;

  }



async proceso_ver(id,nombre,horaInicio,numeroAdultos,numeroNinios){

this.disableButton = true;
const loader = await this.loadingCtrl.create({
  message: 'Espere porfavor',
});
loader.present();
return new Promise(resolve =>{
  let body = {
    aksi:'proceso_ver_ruta',
    idRuta:id,          
    nombre: nombre,
    horaInicio: horaInicio,
    idUsuario: this.idUsuario,
    numeroAdultos: numeroAdultos,
    numeroNinios: numeroNinios          
  }
  this.accesPrvds.postData(body, 'rutaApi.php').subscribe((res:any)=>{ 
    if(res.success == true){
        loader.dismiss();
        this.disableButton = false;
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
      this.presentAlert('La ruta no fue completada o contiene un error');    
  });
});
}

async refresh(id) {

  for(var i = 0 ; i <this.rutas.length; i++ ){

    if(this.rutas[i].id == id){
      this.rutas.splice(i,1);
    }

  }

}


async proceso_eliminar(id){
  
  this.disableButton = true;
  const loader = await this.loadingCtrl.create({
    message: 'Espere porfavor',
  });
  loader.present();

  return new Promise(resolve =>{
    let body = {
      aksi:'eliminar',
      idUsuario : this.idUsuario,
      idruta : id
    }
    this.accesPrvds.postData(body, 'rutaApi.php').subscribe((res:any)=>{
      if(res.success == true){
          loader.dismiss();
          this.disableButton = false;
          this.presentToast('Eliminado correctamente');
          this.refresh(id);
      }else{
          loader.dismiss();
          this.disableButton = false;
          this.presentToast('Error al eliminar');
      }
      },(err)=>{

        loader.dismiss();
        this.disableButton = false;
        this.presentToast('Tiempo Agotado');          
    });
  });
}



async proceso_actualizar(id,nombre,horaInicio,numeroAdultos,numeroNinios){

this.disableButton = true;
const loader = await this.loadingCtrl.create({
  message: 'Espere porfavor',
});
loader.present();
return new Promise(resolve =>{
  let body = {
    aksi:'proceso_editarRuta',
    idRuta: id,        
    idUsuario: this.idUsuario,
    nombre : nombre,
    horaInicio: horaInicio,
    numeroAdultos: numeroAdultos,
    numeroNinios: numeroNinios    
  }
  this.accesPrvds.postData(body, 'rutaApi.php').subscribe((res:any)=>{
    if(res.success == true){
        loader.dismiss();
        this.disableButton = false;
        this.storage.set('storage_xxx',res.result);// crea el almacenamiento 
        this.navCtrl.navigateRoot(['/editar']);

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
        if(res.success == true){
            loader.dismiss();
            this.disableButton = false;
            this.storage.set('storage_xxx',res.result);// crea el almacenamiento la secion
            this.navCtrl.navigateRoot(['/home']);
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
