import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { DataApi } from 'src/app/interfaces/dataApi';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';
import { FacturacionService } from '../../../facturacion.service';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs';
import { mensajes } from 'src/app/interfaces/generales';
import { ModalaprobadorcabComponent } from './modalaprobadorcab/modalaprobadorcab.component';

@Component({
  selector: 'app-aprobadorcab',
  templateUrl: './aprobadorcab.component.html',
  styleUrls: ['./aprobadorcab.component.scss']
})
export class AprobadorcabComponent implements OnInit {
 //Paginacion
 public page = 0;
 public pageEvent : PageEvent;
 public pageIndex : number = 0;
 public desde = 0;
 public hasta = 50;
 nextPageLabel     = 'Página Siguiente';
 previousPageLabel = 'Página Anterior';
 public pageSize = 50;
 public filter :string  = '';
 public filtro: FormGroup;
 public parametrosBusqueda = ['cod_empleado','nombre','area','cco','Sede'];
 public data : any[] = [];
 private sub : Subscription = new Subscription();
  constructor(
    public auth       : AuthService,
    private paginator : MatPaginatorIntl,  
    public dialog : MatDialog, 
    private service : FacturacionService, 
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
 
    this.sub = this.service.refresh$.subscribe(
      res=>{
         this.cargarData()
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
  
  
  cargarData(){
     let url = 'finanzas/aprobadorCab';
     let params = {};
     this.service.get(url,params).subscribe(
       (data : DataApi | any) =>{
         if( !data.hasError ){
           this.data = data?.data?.Table0;
         }    
       }
     )
   }

   Modal ( pantalla : string , data ?: any, bandera ?: any, Descripcion ?: string ){
    const dialogReg = this.dialog.open( ModalaprobadorcabComponent,{
      width :   'auto',
      height:   'auto',
      maxWidth: '75%',
      data: { 
        data : data  ,
        bandera : bandera,
        pantalla : pantalla,
        Descripcion : Descripcion
      },
      disableClose : true
    })
  }

}
