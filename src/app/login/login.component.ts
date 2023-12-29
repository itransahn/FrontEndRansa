import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../services/auth.service';
import { SweetAlertService } from '../services/sweet-alert.service';
import { ToastServiceLocal } from '../services/toast.service';

@Component({
  selector:     'app-login',
  templateUrl:  './login.component.html',
  styleUrls: [  './login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public subscribcion : Subscription = new Subscription();
  public modules : any[]= [];
  public hide: boolean = true;
  public flat: boolean = true;
  constructor(public sweet : SweetAlertService, 
    public login: AuthService, private toast : ToastServiceLocal ,
     private auth :AuthService) {
    this.loginForm = new FormGroup({});
    this.login.leave()
   }

  ngOnInit(): void {
    this.logibuildForm()
  }

  private logibuildForm(){
      this.loginForm = new FormGroup({
        usuario    : new FormControl('', [Validators.required,]),
        contrasena : new FormControl('', [Validators.required,])
      })
  }

  Login(){
    let url = 'auth/login';
    let params = {
      usuario :   this.loginForm.value.usuario,
      password :  this.loginForm.value.contrasena
    }
    this.login.login( url, params ).subscribe(
    data=>{ 
      if ( !data.result.hasError ){
        // this.sweet.mensajeControlado("Bienvenido "+ params.usuario, 500),
        this.toast.mensajeBienvenida(params.usuario, "Bienvenido")
        localStorage.setItem("dataUsuario", JSON.stringify( data.result.data.dataUsuario))
        localStorage.setItem("modulos", JSON.stringify( data.result.data.modulosPermitidos))
        this.login.cargarCatalogo()


        this.login.redirecTo('/modulos');
        this.login.extraerData();


        // if( data.result.data.dataUsuario?.['id_rol'] === 29){
        //   this.login.redirecTo('#/ransa/ssoma/paseSalida')
        //   }else{
        //     this.login.redirecTo('/modulos')
        //     this.login.extraerData()
        //   }

      }else{
        this.toast.mensajeError(String(data?.result.errors),"Error")
        // this.sweet.mensajeError(String(data?.result.errors))
      }
    }
    )
  }

  onKeypressEvent(event: any){

    if(event.keyCode===13){
        this.Login()
  
    }
   
  }
}
