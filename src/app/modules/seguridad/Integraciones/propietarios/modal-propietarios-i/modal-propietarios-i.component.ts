import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { mensajes } from 'src/app/interfaces/generales';
import { AdministracionService } from 'src/app/services/administracion.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

@Component({
  selector: 'app-modal-propietarios-i',
  templateUrl: './modal-propietarios-i.component.html',
  styleUrls: ['./modal-propietarios-i.component.scss']
})
export class ModalPropietariosIComponent implements OnInit {
  public  dataForm   : FormGroup;

  public  visible   : boolean = false; 
  public  enable    : boolean = false;
  public  botton     : boolean = false;

  public  catalogo  : any;
  public  titulo    : string;
  public  subtitulo : string;

  constructor(
    private dialogRef:MatDialogRef<ModalPropietariosIComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    public auth:AuthService,
    public toast:ToastServiceLocal, 
    public Service : AdministracionService
  ) { }

  ngOnInit(): void {
    this.catalogo = this.auth.returnCatalogo()
    this.validacion();
  }

  validacion(){
    if ( this.data['bandera'] == 1 ){
      this.enable     = true;
      this.visible    = true;
      this.botton     = false
      this.titulo     = `Propietario` 
      this.subtitulo  = String(this.data['propietario']); 
      this.cargarFormGet(),
      this.SetForm()
    }

    if ( this.data['bandera'] == 2 ){
      this.enable     = false;
      this.botton     = true
      this.titulo     = `Nuevo Propietario`;
      this.subtitulo  = ''; 
      this.cargarFormPost()
    }

    if ( this.data['bandera'] == 3 ){
      this.enable     = false;
      this.visible    = true;
      this.botton     = true
      this.titulo     = `Actualizacion de Propietario` 
      this.subtitulo  = String(this.data?.['propietario']); 
      this.cargarFormPut()
      this.SetForm()
    }
  }

  cargarFormGet(){
    this.dataForm = new FormGroup({
      propietario  : new FormControl({ value: '', disabled : this.enable }, [] ),
      usuarioAuth0 : new FormControl({ value: '', disabled : this.enable }, [] ),
      propietarioQA : new FormControl({ value: '', disabled : this.enable }, [] ),
      usuarioAuth0QA : new FormControl({ value: '', disabled : this.enable }, [] ),
      pwdQA : new FormControl({ value: '', disabled : this.enable }, [] ),
      pwPRD : new FormControl({ value: '', disabled : this.enable }, [] ),

    })

}

cargarFormPost(){
  this.dataForm = new FormGroup({
    propietario    : new FormControl({ value: '', disabled : this.enable }, [Validators.required] ),
    usuarioAuth0   : new FormControl({ value: '', disabled : this.enable }, [] ),
    propietarioQA  : new FormControl({ value: '', disabled : this.enable }, [] ),
    usuarioAuth0QA : new FormControl({ value: '', disabled : this.enable }, [] ),
    pwdQA : new FormControl({ value: '', disabled : this.enable }, [] ),
    pwPRD : new FormControl({ value: '', disabled : this.enable }, [] ),
  })
}

cargarFormPut(){
this.dataForm = new FormGroup({
  propietario    : new FormControl( { value: '', disabled : this.enable }, [Validators.required] ),
  usuarioAuth0   : new FormControl({ value: '', disabled : this.enable }, [] ),
  propietarioQA  : new FormControl({ value: '', disabled : this.enable }, [] ),
  usuarioAuth0QA : new FormControl({ value: '', disabled : this.enable }, [] ),
  pwdQA : new FormControl({ value: '', disabled : this.enable }, [] ),
  pwPRD : new FormControl({ value: '', disabled : this.enable }, [] ),
})
}

SetForm(){
this.dataForm.setValue({
  propietario    : this.data['propietario'],
  usuarioAuth0   : this.data['usuarioAuth0'],
  propietarioQA  : this.data['propietarioQA'],
  usuarioAuth0QA : this.data['usuarioAuth0QA'],
  pwdQA : this.data['pwdQA'],
  pwPRD : this.data['pwPRD'],
})
}

insertarMenu(){
  let url    = 'administracion/CpropietariosInt';
  let params = {
    tipo           : 1,
    id             : 0,
    propietario    : this.dataForm.value.propietario,
    usuarioAuth0   : this.dataForm.value.usuarioAuth0,
    propietarioQA  : this.dataForm.value.propietarioQA,
    usuarioAuth0QA : this.dataForm.value.usuarioAuth0QA,
    pwdPRD         : this.dataForm.value.pwdQA,
    pwdQA          : this.dataForm.value.pwPRD, 
  } 
  this.Service.post(url,params).subscribe(
    res=>{
      if(!res.hasError){
          if ( res?.data.Table0[0]['codigo'] == -1 ){
              this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
          }else{
            this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
            this.dialogRef.close()
          }
      }else{
        this.toast.mensajeError(String(res?.errors),"Error")
      }
    }
  )
}

actualizarMenu(){
let url    = 'administracion/CpropietariosInt';
let params = {
  tipo           : 2,
  id             : this.data['id'],
  propietario    : this.dataForm.value.propietario,
  usuarioAuth0   : this.dataForm.value.usuarioAuth0,
  propietarioQA  : this.dataForm.value.propietarioQA,
  usuarioAuth0QA : this.dataForm.value.usuarioAuth0QA,
  pwdPRD         : this.dataForm.value.pwdQA,
  pwdQA          : this.dataForm.value.pwPRD, 
} 
this.Service.post( url,params ).subscribe(
  res=>{
    if(!res.hasError){
        if ( res?.data.Table0[0]['codigo'] == -1 ){
            this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
        }else{
          this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']), mensajes.success)
          this.dialogRef.close()
        }
    }else{
      this.toast.mensajeError(String(res?.errors),"Error")
    }
  }
)
}

submit(){

  if( this.data['bandera'] == 2 ){
    this.insertarMenu()
  }

  if( this.data['bandera'] == 3 ){
    this.actualizarMenu()
  }
}

close(){
this.dialogRef.close()
}
}
