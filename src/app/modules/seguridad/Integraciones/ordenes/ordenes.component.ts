import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Acumulador } from 'src/app/interfaces/generales';
import { SharedService } from 'src/app/modules/shared/shared.service';
import { AdministracionService } from 'src/app/services/administracion.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import { ToastServiceLocal } from 'src/app/services/toast.service';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss']
})
export class OrdenesComponent implements OnInit {


  public urlQA  : string = 'https://api-wms.qas.ransaaplicaciones.com/asn'
  // public urlPRD : string = 'https://monitortmswms.ransa.net/importar/archivo_ws_json.php'
  public dataExcel   : any[]=[];
  public dataMapeada : any[]= [];
  public dataapi     : ASN[]= [];
  public username    : string = '';
  public contrasena  : string = 'Ransa-360';
  public token       : string = '';
  public propietario : string = '';
  public UrlEnvio    : string = '';
    //Parametrizar Columnas 
    public PLANILLA : string = 'FACTURA';
    public CODIGOS  : string = 'CODIGOS';
    public CAJAS    : string = 'CAJAS';
    public DESTINO  : string = 'PROVEEDOR';
    public Lote     : string = 'Lote';

    public propietarioQA : string = '';
    public usuarioAuth0 : string = '';
    public usuarioAuthQA : string = '';
    public PwdPrd : string = '';
    public PwdQa  : string = '';

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
   public parametrosBusqueda = ['FACTURA','CODIGOS'];
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

  constructor(
    public sharedS  : SharedService,
    public servicio : AdministracionService,
    public toast    : ToastServiceLocal,
    public sweel    : SweetAlertService
  ) { }

ngOnInit() {
    this.sharedS.CleanDataExcel()
    this.Cargar = new FormGroup({
      propietario : new FormControl({ value : '', disabled : false }, [Validators.required])
    });
    this.filtro = new FormGroup({
      filtrar: new FormControl({ value:'',disabled: false}),
      // propietario : new FormControl({ value : '', disabled : false }, [Validators.required])
    });
    this.cargarPropietarios();
  }

cargarPropietarios(){
    this.servicio.get('administracion/propietariosInt', []).subscribe(
      res=>{
        this.propietarios = res?.data.Table0
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
       this.totalDestinos  =  this.BuscarTotales(this.dataExcel, this.DESTINO);
       this.totalbultos    =  Acumulador(this.dataExcel, this.CAJAS);
       this.EstructurarBody(this.dataExcel)
         this.loading1 = false
       }
      }
     )
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
      let body : ASNS[]=[];
      let comprobar  : boolean = false; 
      let comprobar2 : boolean = false; 
      
      //recorrer data del Cliente
          for( let i = 0; i < array.length ; i++){ 
        if( body.length > 0){
          comprobar = false;  
        // Llenado de cabeceras de Pedidos
          for(let j = 0; j < body.length; j++){
                if(body[j].externreceiptkey == array[i]?.[this.PLANILLA]){
                  comprobar = true;
                  break;
                }
          }
          if ( !comprobar ){
            body.push({
expectedreceiptdate  : new Date(),
externreceiptkey     : String(array[i]?.[this.PLANILLA]),
suppliercode         : String(array[i]?.[this.DESTINO]),
type                 : '1',
scheduledshipdate    : new Date(),
details    : [],
whseid               : this.obtenerWh(this.propietario),
storerkey            : this.propietario,
                  })
          }
        }else{
          body.push({
            expectedreceiptdate  : new Date(),
            externreceiptkey     : String(array[i]?.[this.PLANILLA]),
            suppliercode         : String(array[i]?.[this.DESTINO]),
            type                 : '1',
            scheduledshipdate    : new Date(),
            details    : [],
            whseid               : this.obtenerWh(this.propietario),
            storerkey            : this.propietario,
          })
        }
          }
        // Recorrer arreglo de pedidos con sus cabeceras mapeadas
          for (let k = 0; k < body.length; k++){
              this.loading1 = true
            //Recorrer nuevamente la data del cliente para llenado de detalle de pedidos (SKU)
          for(let p = 0; p < array.length; p++){
                   if(array[p]?.[this.PLANILLA] == body[k]?.externreceiptkey ){
                      if( body[k].details.length > 0){
                        let posicion : number;
                        let cantidad : number;
                        comprobar2 = false;  
          //Recorro El arreglo interno de articulos por pedido, para agrupar o consolidar articulos              
          for (let m = 0; m < body[k].details.length; m++) {
                          if ( body[k].details[m]['sku'] == array[p]?.[this.CODIGOS]  ){
                            comprobar2 = true;
                            posicion  = m
                            cantidad  = array[p]?.[this.CAJAS] 
                            // break
                          } }
                          if(comprobar2){
                            body[k].details[posicion]['qtyexpected'] +=  cantidad
                          }else{
                            body[k].details.push({
                              qtyexpected    : Number(array[p]?.[this.CAJAS]),
                              sku            : String(array[p]?.[this.CODIGOS]),
                              uom            : 'CJ',
                              externlineno   : String(body[k].details.length + 1),
                              // externpokey    : String(array[p]?.[this.PLANILLA]),
                              // pokey          : String(array[p]?.[this.PLANILLA]),
                              // externpolineno : String(body[k].details.length + 1),
                              LOTTABLE06     : String(array[p]?.[this.Lote])
                          })
                          }
      
                      }else{
                        body[k].details.push({
                          qtyexpected    : Number(array[p]?.[this.CAJAS]),
                          sku            : String(array[p]?.[this.CODIGOS]),
                          uom            : 'CJ',
                          externlineno   : String(body[k].details.length + 1),
                          // externpokey    : String(array[p]?.[this.PLANILLA]),
                          // pokey          : String(array[p]?.[this.PLANILLA]),
                          //  pokey          : '',
                          // externpolineno : String(body[k].details.length + 1),
                          LOTTABLE06     : String(array[p]?.[this.Lote])
                      })
                      }
                }
            }
        }
        // Mostrar Pantalla de carga
        this.loading1 = false;
        this.dataapi.push({
       date        : new Date(),
       society     : '251',
       clientcode  : 1770142,
       asn         : body
        })
       //Cargar data mapeada para mostrar 
      this.dataMapeada = body;
      }

  enviarData(){
        this.sweel.mensajeConConfirmacion('¿Seguro de enviar ASN?', 'Carga de ASN','warning').then(
          res =>{
                if ( res ){
                if(this.dataMapeada.length > 0){
                  this.cargarASN( JSON.stringify(this.dataapi[0])  )
                }  
                this.loading2 = false;
              }
            }
            )
      }

  Limpieza( Bandera ?: number){

    if ( Bandera == 1){
      this.sweel.mensajeConConfirmacion("¿Seguro de Limpiar data?","Limpieza","question").then(
        res=>{
          if ( res ){
            this.sharedS.CleanDataExcel();
            this.dataMapeada = [];
            this.dataapi = [];
          }
        }
      )
    }else{
      this.sharedS.CleanDataExcel();
      this.dataMapeada = [];
      this.dataapi = [];
    }

    


      
      }
// PODRIA MANEJARSE EN SERVICIO
  ObtenerToken( propietario ){
    let contra  : string;
    let usuario : string;
    let urlApi     : string;

    contra  = this.PwdPrd;
    usuario = this.usuarioAuth0;
    urlApi  =  'https://api-wms.ransaaplicaciones.com/auth/token';
    this.UrlEnvio = 'https://api-wms.ransaaplicaciones.com/asn'
      let url = '/administracion/auth0';
      let params = {
        usuario : propietario, 
        contra  : contra,
        url     : urlApi

      }

    this.servicio.post(url,params).subscribe(
      res=>{
        if( res?.data ){
          this.token = res?.data?.access_token
        }else{
          this.toast.mensajeError('Nombre y/o contraseña invalido',"Error")
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

  cargarASN( data  ){
     if(this.dataExcel.length > 0){
      let url = '/administracion/authLoadAsn';
      let params = {
        data  : JSON.stringify(data),
        token : this.token,
        url   : this.UrlEnvio
      }

    this.servicio.post(url,params).subscribe(
      res=>{
        if( !res?.hasError ){
          this.toast.mensajeSuccess("ASN'S Enviadas","Envío de ASN")
            // console.log( res );
            this.Limpieza(2);
        }else{
          // console.log( res );
          this.toast.mensajeError(String(res?.errors[0]?.message),"Error")
        }
      }
    )
     }else{
      this.toast.mensajeWarning("Favor Cargar las ASN ","Cargar ASN'S")
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
}

  interface ASN {
  date       : Date,
  society    : string,
  clientcode : number,
   asn : {
      expectedreceiptdate : Date,
      externreceiptkey    : string,
      suppliercode        : string,
      type       : string,
    scheduledshipdate : Date,
      details : {
        qtyexpected  : Number,
        sku          : string,
        uom          : string,
        externlineno : string,
        // pokey : string,
        // externpolineno : string,
        LOTTABLE06   : string
      }[],
      whseid     : string,
      storerkey  : string,
  }[]
  }
  
  interface ASNS{
    expectedreceiptdate : Date,
    externreceiptkey    : string,
    suppliercode        : string,
    type       : string,
    scheduledshipdate : Date,
    details : {
      qtyexpected  : number,
      sku          : string,
      uom          : string,
      externlineno : string,
      // externpolineno : string,
      LOTTABLE06   : string
    }[],
    whseid     : string,
    storerkey  : string
    }
