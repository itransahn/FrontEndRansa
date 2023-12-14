import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Acumulador } from 'src/app/interfaces/generales';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { AdministracionService } from 'src/app/services/administracion.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {

  public urlQA  : string = 'https://api-wms.qas.ransaaplicaciones.com/order'
  
  public dataExcel   : any[]=[];
  public dataMapeada : any[]= [];
  public dataapi     : order[]= [];
  public username    : string = '';
  public contrasena  : string = 'Ransa-360';
  public token       : string = '';
  public propietario : string = '';
  public propietarioQA : string = '';
  public usuarioAuth0 : string = '';
  public usuarioAuthQA : string = '';
  public UrlEnvio : string = '';
  public PwdPrd : string = '';
  public PwdQa  : string = '';

  public sedes = [
    {
      idSede : 1,
      Sede   : 'Sauce'
    },
    {
      idSede : 2,
      Sede   : 'Almahsa'
    }
  ]
  public PropietarioCargar : string;
  public usuarioAuth0Cargar : string;
  public pwdCargar : string;


 
 

    //Parametrizar Columnas 
    public PLANILLA : string = 'PLANILLA';
    public CODIGOS  : string = 'CODIGOS';
    public CAJAS    : string = 'CANTIDAD';
    public DESTINO  : string = 'DESTINO';
    public Lote     : string = 'LOTE';
    public UOM      : string = 'UDM';


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
   public Cargar : FormGroup;
   Group;
   public parametrosBusqueda = ['Planilla','Codigos'];
   public loading1 : Boolean = false;
   public loading2 : Boolean = false;

   public loading3 : boolean = false;
   public propietarios : any[] =[];

   public totalPedidos  : number = 0;
   public totalDestinos : number = 0;
   public totalbultos   : number = 0;

   public fecha = new Date()
   public semanaEnMilisegundos = 1000 * 60 * 60 * 24 * 2;
   public FechaS = this.fecha.getTime() + this.semanaEnMilisegundos;
   public fechaServicio = new Date(this.FechaS);

   @ViewChild('archivoInput') archivoInput: ElementRef<HTMLInputElement>;
   archivoSeleccionado : File | null = null;

  constructor(
    public sharedS  : SharedService,
    public servicio : AdministracionService,
    public toast    : ToastServiceLocal,
    public sweel    : SweetAlertService
  ) { }

  ngOnInit() {
    this.parametros();
    // this.sharedS.CleanDataExcel()
    this.Cargar = new FormGroup({
      propietario : new FormControl({ value : '', disabled : false }, [Validators.required]),
      sede        : new FormControl({ value : '', disabled : false }, [Validators.required])

    });
    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false}),
      // propietario : new FormControl({ value : '', disabled : false }, [Validators.required])
    });
    this.cargarPropietarios();
  }

  onFileChange(event: any): void {
    // Almacena el archivo seleccionado
    this.archivoSeleccionado = event.target.files[0];
  }
  resetFileInput(){
    // Resetea el valor del input tipo file
       // const input = this.archivoInput?.nativeElement;
       // input.value = '';
    this.archivoSeleccionado = null;
  }
  Limpieza( Bandera ?: number){

    if ( Bandera == 1){
      this.sweel.mensajeConConfirmacion("¿Seguro de Limpiar data?","Limpieza","question").then(
        res=>{
          if ( res ){
            this.sharedS.CleanDataExcel();
            this.dataMapeada = [];
            this.dataapi = [];
            this.resetFileInput();
  // (<HTMLInputElement>document.getElementById("fileInput")).value = ''
          }
        }
      )
    }else{
      this.sharedS.CleanDataExcel();
      this.dataMapeada = [];
      this.dataapi = [];
      this.resetFileInput()
      // (<HTMLInputElement>document.getElementById("fileInput")).value = ''
    } 
  }

  parametros(){
    this.PropietarioCargar = 'propietario';
    this.usuarioAuth0Cargar = 'usuarioAuth0';
    this.pwdCargar = 'pwdPRD';
  }

cargarPropietarios(){
    this.servicio.get('administracion/propietariosInt', []).subscribe(
      res=>{
        this.propietarios = res?.data.Table0;
      }
    )
}

  SetearData(evt){
  this.propietario = evt?.value;
  this.obtenerUsuario(evt?.value);
}

  cargarData(evt){
    this.loading1 = true; 
     this.sharedS.onChange(evt);
     this.sharedS.dataExcelo$.subscribe(
      res=>{
       if( res && res.length > 0 ){
         this.dataExcel = res;
       this.totalPedidos   =  this.BuscarTotales(this.dataExcel, this.PLANILLA);
       this.totalDestinos   =  this.BuscarTotales(this.dataExcel, this.DESTINO);
       this.totalbultos  =  Acumulador(this.dataExcel, this.CAJAS);
  
       this.EstructurarBody(this.dataExcel)
         this.loading1 = false
       }
      }
     )
    }

    obtenerWh( propietario : string){
      if( propietario.toUpperCase().includes('SPS')){
        return 'WHSE52'
      }else{
        return 'WHSE51'

      }
    }

// Buscar Totales
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
// Estructurar Json
EstructurarBody( array : any[]){
  let body : orders[]=[];
  let comprobar  : boolean = false; 
  let comprobar2 : boolean = false; 
  
  //recorrer data del Cliente
      for( let i = 0; i < array.length ; i++){ 
    if( body.length > 0){
      comprobar = false;  
    // Llenado de cabeceras de Pedidos
      for(let j = 0; j < body.length; j++){
            if(body[j].externorderkey == array[i]?.[this.PLANILLA]){
              comprobar = true;
              break;
            }
      }
      if ( !comprobar ){
        body.push({
          externorderkey : String(array[i]?.[this.PLANILLA]),
          whseid         : this.obtenerWh(this.propietario),
          orderdate      : new Date(),
          type           :'0',
          consigneekey   : String(array[i]?.[this.DESTINO]),
          scheduleddelvdate : new Date(),
          actualdelvdate :    new Date(),
          deliverydate   : new Date(),
          plannedshipdate : new Date(),
          planneddelvdate : new Date(),
          shiptogether   : 'N',
          priority       : '3',
          splitshipmentindicator : '0',
          storekey       : this.propietario,
          details    : [],
              })
      }
    }else{
      body.push({
        externorderkey : String(array[i]?.[this.PLANILLA]),
          whseid         : this.obtenerWh(this.propietario),
          orderdate      : new Date(),
          type           :'0',
          consigneekey   : String(array[i]?.[this.DESTINO]),
          scheduleddelvdate : new Date(),
          actualdelvdate :    new Date(),
          deliverydate   : new Date(),
          plannedshipdate : new Date(),
          planneddelvdate : new Date(),
          shiptogether   : 'N',
          priority       : '3',
          splitshipmentindicator : '0',
          storekey       : this.propietario,
        details    : [],
      })
    }
      }
    // Recorrer arreglo de pedidos con sus cabeceras mapeadas
      for (let k = 0; k < body.length; k++){
          this.loading1 = true
        //Recorrer nuevamente la data del cliente para llenado de detalle de pedidos (SKU)
      for(let p = 0; p < array.length; p++){
               if(array[p]?.[this.PLANILLA] == body[k]?.externorderkey ){
                  if( body[k].details.length > 0){
                    let posicion : number;
                    let cantidad : number;
                    comprobar2 = false;  
      //Recorro El arreglo interno de articulos por pedido, para agrupar o consolidar articulos              
      for (let m = 0; m < body[k].details.length; m++) {
                      if ( body[k].details[m]['sku'] == array[p]?.[this.CODIGOS]  && body[k].details[m]['lottable06'] == array[p]?.[this.Lote] ){
                        comprobar2 = true;
                        posicion  = m
                        cantidad  = Number(array[p]?.[this.CAJAS] )
                        // break
                      } }
                      if(comprobar2){
                        body[k].details[posicion]['openqty'] +=  cantidad
                        body[k].details[posicion]['fulfillqty'] +=  cantidad
                      }else{
                        body[k].details.push({
                          externlinenumber  : String(body[k].details.length + 1),
                          sku               : String(array[p]?.[this.CODIGOS]),
                          openqty     : Number(array[p]?.[this.CAJAS]),
                          fulfillqty  : Number(array[p]?.[this.CAJAS]),
                          // uom         : 'CJ',
                          uom         :   String(array[p]?.[this.UOM]),
                          externlineno  : String(body[k].details.length + 1),
                          whseid      : this.obtenerWh(this.propietario),
                          lottable06  : String(array[p]?.[this.Lote])
                      })
                      }
  
                  }else{
                    body[k].details.push({
                      externlinenumber  : String(body[k].details.length + 1),
                      sku         : String(array[p]?.[this.CODIGOS]),
                      openqty     : Number(array[p]?.[this.CAJAS]),
                      fulfillqty  : Number(array[p]?.[this.CAJAS]),
                      // uom         : 'CJ',
                      uom         :   String(array[p]?.[this.UOM]),
                      externlineno  : String(body[k].details.length + 1),
                      whseid  : this.obtenerWh(this.propietario),
                      lottable06  : String(array[p]?.[this.Lote])
                  })
                  }
            }
        }
    }
    // Mostrar Pantalla de carga
    this.loading1 = false;
    

    this.dataapi.push({
   date        : new Date(),
   society : '251',
   clientcode : '1770142',
   orders : body
    })
   //Cargar data mapeada para mostrar 
  this.dataMapeada = body;
  }

   enviarPedidos(){
        this.sweel.mensajeConConfirmacion('¿Seguro de enviar Pedidos?', 'Carga de Pedidos','warning').then(
          res =>{
                if ( res ){
                if(this.dataMapeada.length > 0){
                  // this.servicio.PedidosMonitor(this.urlQA, JSON.stringify(this.dataapi)).subscribe(
                  //   (res: any) =>{
                  //     this.toast.mensajeInfo(String(res?.Transmision),"Respuesta");
                  //   }
                  // )
                  this.cargarPedidos( JSON.stringify(this.dataapi[0])  )
                }  
                // this.toast.mensajeSuccess("Data Cargada con éxito","Carga de datos");
                this.loading2 = false;
              }
            }
            )
      }

    ObtenerToken( propietario : string ){
      let contra  : string;
      let usuario : string;
      let urlApi     : string;

      // if ( this.Cargar.value.ambiente == 1){
      //     contra  = this.PwdQa
      //     usuario = this.usuarioAuthQA
      //     urlApi  = 'https://api-wms.qas.ransaaplicaciones.com/auth/token';
      //     this.UrlEnvio = 'https://api-wms.qas.ransaaplicaciones.com/order'
      // }else{ 

      // }
      contra  = this.PwdPrd;
      usuario = this.usuarioAuth0;
      urlApi  =  'https://api-wms.ransaaplicaciones.com/auth/token';
      this.UrlEnvio = 'https://api-wms.ransaaplicaciones.com/order'

      let url = '/administracion/auth0';
      let params = {
        usuario : usuario, 
        contra  : contra,
        url     : urlApi
      }

    this.servicio.post(url,params).subscribe(
      res=>{
        if( res?.data ){
          this.token = res?.data?.access_token;
        }else{
          this.toast.mensajeError('Nombre y/o contraseña invalido',"Error")
        }
      }
    )
    }


    cargarPedidos( data  ){
     if(this.dataExcel.length > 0){
      let url = '/administracion/authLoadOrder';
      let params = {
        data  : JSON.stringify(data),
        token : this.token,
        url   : this.UrlEnvio
      }


    this.servicio.post(url,params).subscribe(
      res=>{
        if( !res?.hasError ){
          this.toast.mensajeSuccess("Pedidos Enviados","Envío de pedidos")
            this.Limpieza(2)
        }else{
          this.toast.mensajeError(String(res?.errors),"Error")
        }
      }
    )
     }else{
      this.toast.mensajeWarning("Favor Cargar los pedidos ","Cargar Pedidos")
     }
    }

    obtenerUsuario( propietario ){
      let url = '/administracion/auth0Pro';
      let params = {
        propietario : propietario
      }
    this.servicio.get(url, params).subscribe(
      res =>{
        if( res ){
          this.username = res?.data?.Table0[0]?.usuarioAuth0;
          this.propietarioQA = res?.data?.Table0[0]?.propietarioQA;
          this.usuarioAuth0  = res?.data?.Table0[0]?.usuarioAuth0;
          this.usuarioAuthQA = res?.data?.Table0[0]?.usuarioAuth0QA;
          this.PwdPrd        = res?.data?.Table0[0]?.pwdPRD;
          this.PwdQa         = res?.data?.Table0[0]?.pwdQA;
          this.ObtenerToken( this.username );
        }
      }
    )
    }

    checkOnClick(tipo : any){

    }
    }

interface order {
date       : Date,
society    : string,
clientcode : string,
  orders : {
   externorderkey  : string,
   whseid          : string,
   orderdate       : Date,
   type            : string,
   scheduleddelvdate : Date,
   actualdelvdate    : Date,
   consigneekey    : string,
   deliverydate    : Date,
   plannedshipdate : Date,
   planneddelvdate : Date,
   shiptogether    : string,
   priority        : string,
   splitshipmentindicator   : string,
   storekey : string,
   details : {
    externlinenumber  :  string,
    sku :         string,
    openqty :     number ,
    fulfillqty :  number ,
    uom :         string ,
    externlineno: string,
    whseid :      string,
    lottable06 : string
  }[]
}[]
}

interface orders{
  externorderkey  : string,
  whseid          : string,
  orderdate       : Date,
  type            : string,
  scheduleddelvdate : Date,
  actualdelvdate    : Date,
  consigneekey    : string,
  deliverydate    : Date,
  plannedshipdate : Date,
  planneddelvdate : Date,
  shiptogether    : string,
  priority        : string,
  splitshipmentindicator   : string,
  storekey : string,
  details : {
    externlinenumber  :  string,
    sku :         string,
    openqty :     number ,
    fulfillqty :  number ,
    uom :         string ,
    externlineno: string,
    whseid :      string,
    lottable06 : string
  }[]
  }


  
  
  
  
  
  
