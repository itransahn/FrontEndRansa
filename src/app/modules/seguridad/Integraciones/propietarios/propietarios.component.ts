import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { DataApi } from 'src/app/interfaces/dataApi';
import { AdministracionService } from 'src/app/services/administracion.service';
import { AuthService } from 'src/app/services/auth.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { ModalRolComponent } from '../../roles/modal-rol/modal-rol.component';
import { ModalPropietariosIComponent } from './modal-propietarios-i/modal-propietarios-i.component';

@Component({
  selector: 'app-propietarios',
  templateUrl: './propietarios.component.html',
  styleUrls: ['./propietarios.component.scss']
})
export class PropietariosComponent implements OnInit {
  //Paginacion
  public page  = 0;
  public pageEvent : PageEvent;
  public pageIndex : number = 0;
  public desde = 0;
  public hasta = 10;
  nextPageLabel     = 'Página Siguiente';
  previousPageLabel = 'Página Anterior';
  public pageSize   = 10;
  public parametrosBusqueda = ['propietario', 'SEDEF'];
  public filter :string  = '';
  public filtro : FormGroup;
  public data   : any[] = [];
  private sub   : Subscription = new Subscription();
  constructor(
    public auth       : AuthService,
    private paginator : MatPaginatorIntl, 
    public administracion: AdministracionService, 
    public dialog : MatDialog, 
    private sweel : SweetAlertService,
    private toast : ToastServiceLocal 
  ) { }

  ngOnInit(): void {
    this.paginator.itemsPerPageLabel = 'Items por hoja.';
    this.paginator.nextPageLabel     = 'Página Siguiente';
    this.paginator.previousPageLabel = 'Página Anterior';

    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    })

    this.cargarData();

    this.sub = this.administracion.refresh$.subscribe(
      res=>{
         this.cargarData()
      }
    )
  }
  
  ngOnDestroy()  {
    this.sub.unsubscribe()
}

cargarData(){
  let url = 'administracion/CpropietariosInt';
  let params = {};
  this.administracion.get(url,params).subscribe(
    (data : DataApi | any) =>{
      if( !data.hasError ){
        this.data = data?.data?.Table0;
      }    
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


  Modal ( accion : number, data ?: any ){
    const dialogReg = this.dialog.open( ModalPropietariosIComponent,{
      width :   'auto',
      height:   'auto',
      maxWidth: 'auto',
      data: { 
        bandera : accion,
        id      : data?.ID,
        propietario    : data?.propietario,
        usuarioAuth0   : data?.usuarioAuth0,
        propietarioQA  : data?.propietarioQA,
        usuarioAuth0QA : data?.usuarioAuth0QA,
        pwdQA : data?.pwdQA,
        pwPRD : data?.pwdPRD,
      },
      disableClose : true
    })
  }
}
