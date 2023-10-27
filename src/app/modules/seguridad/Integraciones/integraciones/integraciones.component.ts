import { Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { concat } from 'rxjs';
import { Acumulador } from 'src/app/interfaces/generales';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { AdministracionService } from 'src/app/services/administracion.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

@Component({
  selector: 'app-integraciones',
  templateUrl: './integraciones.component.html',
  styleUrls: ['./integraciones.component.scss']
})
export class IntegracionesComponent implements OnInit {

  public urlQA  : string = 'https://monitortmswms-qa.ransa.net/importar/archivo_ws_json.php'
  public urlPRD : string = 'https://monitortmswms.ransa.net/importar/archivo_ws_json.php'
  public dataExcel   : any[]=[];
  public dataMapeada : pedidos[]= [];

  //Parametrizar Columnas 
  public Planilla : string = 'Planilla';
  public Destino  : string = 'Destino/Cliente';
  public valor    : string = ' Valor Facturado ';
  public sku      : string = 'Codigo/Productos';
  public cantidad : string = 'Unidades';


   //Paginacion
   public page = 0;
   public pageEvent : PageEvent;
   public pageIndex : number = 0;
   public desde = 0;
   public hasta = 100;
   nextPageLabel     = 'Página Siguiente';
   previousPageLabel = 'Página Anterior';
   public pageSize = 100;
   public filter :string  = '';
   public filtro: FormGroup;
   Group;
   public parametrosBusqueda = ['Empresa','Documento'];
   public loading1 : Boolean = false;
   public loading2 : Boolean = false;

   public loading3 : boolean = false;

   public proveedoresF :  proveedores[]=[];
   public proveedoresFR : proveedores[]=[];

   public totalPedidos   : number = 0;
   public totalTiendas : number = 0;
   public totalUnidades  : number = 0;

  constructor( 
    public sharedS  : SharedService,
    public servicio : AdministracionService,
    public toast    : ToastServiceLocal,
    public sweel    : SweetAlertService
    ) { }

  ngOnInit( ) {
    this.sharedS.CleanDataExcel()
    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false})
    });
  }

  setearPedido( pedido: string){
    let re = /-/g;
    return pedido?.replace(re,'');
  }

  cargarData(evt){
  this.loading1 = true; 
   this.sharedS.onChange(evt);
   this.sharedS.dataExcelo$.subscribe(
    res=>{
     if( res && res.length > 0 ){
       this.dataExcel = res;
     this.totalPedidos   =  this.BuscarTotales(this.dataExcel, 'Planilla');
     this.totalTiendas   =  this.BuscarTotales(this.dataExcel, 'Destino/Cliente');
     this.totalUnidades  =  Acumulador(this.dataExcel, 'Unidades');

     this.EstructurarBody(this.dataExcel)
     
       this.loading1 = false
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

enviarPedidos(){
  this.sweel.mensajeConConfirmacion('¿Seguro de enviar Pedidos?', 'Carga de Pedidos','warning').then(
    res =>{
          if ( res ){
          if(this.dataMapeada.length > 0){
            this.servicio.PedidosMonitor(this.urlQA, JSON.stringify(this.dataMapeada)).subscribe(
              (res: any) =>{
                this.toast.mensajeInfo(String(res?.Transmision),"Respuesta");
              }
            )
          }  
          // this.toast.mensajeSuccess("Data Cargada con éxito","Carga de datos");
          this.loading2 = false;
        }
      }
      )
}

Limpieza(){
  this.sweel.mensajeConConfirmacion("¿Seguro de Limpiar data?","Limpieza","question").then(
    res=>{
      if ( res ){
        this.proveedoresF = []
        this.sharedS.CleanDataExcel();
        this.dataMapeada = [];
        this.dataExcel   = [];
      }
    }
  )

}

/* CREAR FORMATO DE FECHA dd/mm/yyyy */ 



EstructurarBody( array : any[]){
  let body : pedidos[]=[];
let comprobar : boolean = false; 
let comprobar2 : boolean = false; 

//recorrer data del Cliente
    for( let i = 0; i < array.length ; i++){ 
  if( body.length > 0){
    comprobar = false;  
  // Llenado de cabeceras de Pedidos
    for(let j = 0; j < body.length; j++){
          if(body[j].codigoPedido == this.setearPedido(array[i]?.['Planilla'])){
            comprobar = true;
            break;
          }
    }
    if ( !comprobar ){
      body.push({
        codigoCliente        :'EDT_SPS',
        pais                 :'Honduras',
        tipoOperacion        :'1',
        codigoPedido         :this.setearPedido(array[i]?.['Planilla']) ,
        tipoPedido           :'00',
        numeroPedidoCliente  :this.setearPedido(array[i]?.['Planilla']),
        tipoCentroDestino    :'01',
        codigoCentroDestino  :array[i]?.['Destino/Cliente'],
        tipoCentroServicio   :'01',
        codigoCentroServicio :'WHSE52',
        fechaGeneracion      :this.retornarFormatoFecha(0),
        horaGeneracion       :(new Date().getHours().toString() + new Date().getMinutes().toString() + new Date().getMinutes().toString()),
        fechaServicio        :this.retornarFormatoFecha(1),
        comentario           :'',
        ValorDeclarado       :array[i]?.[this.valor],
        MetodoDePago           : 'Contado',
        listaLineasPedido    : [],
            })
    }
  }else{
    body.push({
codigoCliente        :'EDT_SPS',
pais                 :'Honduras',
tipoOperacion        :'1',
codigoPedido         :this.setearPedido(array[i]?.['Planilla']) ,
tipoPedido           :'00',
numeroPedidoCliente  :this.setearPedido(array[i]?.['Planilla']),
tipoCentroDestino    :'01',
codigoCentroDestino  :array[i]?.['Destino/Cliente'],
tipoCentroServicio   :'01',
codigoCentroServicio :'WHSE52',
fechaGeneracion      : this.retornarFormatoFecha(0),
horaGeneracion       :( this.retonar0Fecha(new Date().getHours().toString()) + new Date().getMinutes().toString() + new Date().getMinutes().toString()),
fechaServicio        :this.retornarFormatoFecha(1),
comentario           :'',
ValorDeclarado       : array[i]?.[this.valor],
MetodoDePago           : 'Contado',
listaLineasPedido    : [],
    })
  }
    }
  // Recorrer arreglo de pedidos con sus cabeceras mapeadas
    for (let k = 0; k < body.length; k++){
        this.loading1 = true
      //Recorrer nuevamente la data del cliente para llenado de detalle de pedidos (SKU)
    for(let p = 0; p < array.length; p++){
             if(this.setearPedido(array[p]?.['Planilla']) == body[k]?.codigoPedido ){
                if( body[k].listaLineasPedido.length > 0){
                  let posicion : number;
                  let cantidad : number;
                  comprobar2 = false;  
    //Recorro El arreglo interno de articulos por pedido, para agrupar o consolidar articulos              
    for (let m = 0; m < body[k].listaLineasPedido.length; m++) {
                    if ( body[k].listaLineasPedido[m]['codigoArticuloBulto'] == array[p]?.['Codigo/Productos']  ){
                      comprobar2 = true;
                      posicion  = m
                      cantidad  = array[p]?.['Unidades'] 
                      // break
                    } }
                    if(comprobar2){
                      body[k].listaLineasPedido[posicion]['cantidad'] +=  cantidad
                    }else{
                      body[k].listaLineasPedido.push({
                        numeroLinea  : String(body[k].listaLineasPedido.length + 1),
                        codigoArticuloBulto  : array[p]?.['Codigo/Productos'],
                        cantidad  : array[p]?.['Unidades'],
                        estadoCalidad  : '01',
                        descripcionArticulo  : 'Producto 1',
                        capturaPeso  : '',
                        pesoPromedioCaja  : '',
                    })
                    }

                }else{
                  body[k].listaLineasPedido.push({
                    numeroLinea  : String(body[k].listaLineasPedido.length + 1),
                    codigoArticuloBulto  : array[p]?.['Codigo/Productos'],
                    cantidad  : array[p]?.['Unidades'],
                    estadoCalidad  : '01',
                    descripcionArticulo  : 'Producto 1',
                    capturaPeso  : '',
                    pesoPromedioCaja  : '',
                })
                }
          }
      }
  }
  // Mostrar Pantalla de carga
  this.loading1 = false;
  // console.log(JSON.stringify(body))

 //Cargar data mapeada para mostrar 
this.dataMapeada = body;
  console.log(JSON.stringify(this.dataMapeada))
  console.log(JSON.stringify(body))

}

BuscarTotales(array : any[], buscar : string){
  var cont : Number = 0;
  let comprobar : boolean = false;
  let array2 : any[]=[]
  for(let i = 0; i < array.length; i++){
      if ( array2.length >0){
          comprobar = false;  
          for(let j = 0; j < array2.length; j++){
                if(array2[j] == array[i]?.[buscar]){
                  comprobar = true;
                  break;
                }
          }
          if ( !comprobar ){
          array2.push(array[i]?.[buscar])
          }
      }else{
          array2.push(array[i]?.[buscar])
      }
  }
return (array2.length)
}

retornarFormatoFecha( flat : number ){
  let fecha  = new Date();
  let semanaEnMilisegundos = 1000 * 60 * 60 * 24 * 2;
  let FechaS = fecha.getTime() + semanaEnMilisegundos;
  let fechaServicio = new Date(FechaS);
  let fechaResultado : string;
  if ( flat == 0){
    //Fecha Generacion
    return String(fecha.getFullYear().toString()+ this.retonar0Fecha(String(fecha.getMonth()+1))+ this.retonar0Fecha(fecha.getDate().toString()) )
  }else{
    //Fecha Servicio
    return String(fechaServicio.getFullYear().toString()+ this.retonar0Fecha(String(fechaServicio.getMonth()+1))+ this.retonar0Fecha(fechaServicio.getDate().toString()) )
  }
}

retonar0Fecha( valor : string ){
    if ( Number(valor) < 10 ){
      return '0' + String(valor)
    }else{
      return String(valor)
    }
}
}

interface proveedores{
  proveedor ?: string
}[]


interface pedidos{
codigoCliente  : string,
pais           : string,
tipoOperacion  : string,
codigoPedido   : string,
tipoPedido     : string,
numeroPedidoCliente  : string,
tipoCentroDestino    : string,
codigoCentroDestino  : string,
tipoCentroServicio   : string,
codigoCentroServicio : string,
fechaGeneracion : string,
horaGeneracion  : string,
fechaServicio   : string,
comentario      : string,
ValorDeclarado  : number,
MetodoDePago      : string,
listaLineasPedido : {
  numeroLinea         : string,
  codigoArticuloBulto : string,
  cantidad            : number ,
  estadoCalidad       : string,
  descripcionArticulo : string,
  capturaPeso         : string,
  pesoPromedioCaja    : string
}[]
}

interface duplicados{
  pedido: string
}[]