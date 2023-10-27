import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { DataApi } from 'src/app/interfaces/dataApi';
import { mensajes, roles } from 'src/app/interfaces/generales';
import { AdministracionService } from 'src/app/services/administracion.service';
import { ModalRolComponent } from './modal-rol/modal-rol.component';
import { RolesService } from './roles.service';
import { Subscription } from 'rxjs'
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit, OnDestroy {
  //Paginacion
  public page = 0;
  public pageEvent : PageEvent;
  public pageIndex : number = 0;
  public desde = 0;
  public hasta = 10;
  nextPageLabel     = 'Página Siguiente';
  previousPageLabel = 'Página Anterior';
  public pageSize = 10;
  public parametrosBusqueda = ['rol', 'Estado'];
  public filter :string  = '';
  public filtro: FormGroup;
  public roles : roles[] = [];
  private sub : Subscription = new Subscription();
  constructor( 
    public auth       : AuthService,
    private paginator : MatPaginatorIntl, 
    public administracion: AdministracionService, 
    public dialog : MatDialog, 
    private rolService : RolesService, 
    private sweel : SweetAlertService,
    private toast : ToastServiceLocal 
     ) { }

  ngOnInit() {
    
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel     = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';

    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })

    this.cargarRoles();

    this.sub = this.rolService.refresh$.subscribe(
      res=>{
         this.cargarRoles()
      }
    )
  
  }

  ngOnDestroy()  {
      this.sub.unsubscribe()
  }
  cargarRoles(){
    let url = 'seguridad/roles';
    let params = {};
    
    this.administracion.usuarios(url,params).subscribe(
      (data : DataApi | any) =>{
        if( !data.hasError ){
          this.roles = data?.data?.Table0;
        }    
      }

    )
  }

  eliminarRol(  rol?:string ,idRol?:number){
    this.sweel.mensajeConConfirmacion(`¿Seguro de Eliminar el rol ${ rol }?`, `Eliminación de Rol`,"question").then(
      res=>{
          if ( res ){
                let url    = '/seguridad/eliminarRol';
                let params = {
                  idRol : idRol
                } 
                this.rolService.delete(url, params).subscribe(
                  res=>{
                    if ( res?.data.Table0[0]['codigo'] == -1 ){
                      this.toast.mensajeWarning(String(res?.data.Table0[0]['Mensaje']), mensajes.warning)
                  }else{
                    this.toast.mensajeSuccess(String(res?.data.Table0[0]['Mensaje']),   mensajes.success)
                    this.cargarRoles()
                  }
                  }
                )
          }else{ }
      }
    )
  }

  //Paginación de la tabla
  next(event: PageEvent) {

          if (event.pageIndex === this.pageIndex + 1) {
            this.desde = this.desde + this.pageSize;
            this.hasta = this.hasta + this.pageSize;
          }
          else if (event.pageIndex === this.pageIndex - 1) {
            this.desde = this.desde - this.pageSize;
            this.hasta = this.hasta - this.pageSize;
          }
          this.pageIndex = event.pageIndex;
        }


      ModalRol ( accion : number, dataRol ?: any ){
        const dialogReg = this.dialog.open( ModalRolComponent,{
          width :   'auto',
          height:   'auto',
          maxWidth: 'auto',
          data: { 
            bandera : accion,
            idRol   : dataRol?.ID,
            rol     : dataRol?.rol,
            estado  : dataRol?.idEstado
          },
          disableClose : true
        })
      }


}
