import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DataApi } from '../interfaces/dataApi';
import { modulosPadre } from '../interfaces/generales';
import { catchError, Subject, tap } from 'rxjs';
import { MensajesHttpService } from './mensajes-http.service';

@Injectable({
  providedIn: 'root'
})
export class AdministracionService {
  private _refresh$ = new Subject<void>();

  constructor( private http:HttpClient, private _mensajesHttp : MensajesHttpService ) { }

  get refresh$(){
    return this._refresh$;
  }


  get(url:string, params ?: any){
let request$ = this.http.get<DataApi>(environment.UrlApi + url, {params:params}).pipe(
  tap( (result: DataApi | any)=>{
    return result;
  } ),
  catchError( (error : HttpErrorResponse)=>{
      this._mensajesHttp.mostrarErrorHttp( error, String(error.error?.errors[0]['descripcion']),'');
      return [
        {
          data : error,
          errors : error,
          hasError : true
        }
      ]
  })
);
return request$

  }

  /* USUARIOS */ 

  usuarios( url:string, params?: any ){
    let request$ = this.http.get<DataApi>(environment.UrlApi + url , params = params).pipe(
      tap( ( result:DataApi | any )=>{
          return result
      } ),
      catchError( ( error: HttpErrorResponse) =>{
        this._mensajesHttp.mostrarErrorHttp(error, String(error.error?.errors[0]['descripcion']), '');
          return [
            {
              data     : error,
              errors   : error,
              hasError :  true 
            }
          ]
      })
    );
    return request$
  }

  usuarioEspecifico( url:string, params?: any ){
   let request$ = this.http.get<DataApi>(environment.UrlApi + url , params = params).pipe(
      tap( ( result:DataApi | any )=>{
          return result
      } ),
      catchError( ( error: HttpErrorResponse) =>{
        this._mensajesHttp.mostrarErrorHttp(error, String(error.error?.errors[0]['descripcion']), '');
          return [
            {
              data     : error,
              errors   : error,
              hasError :  true 
            }
          ]
      })
    );
    return request$
  }

  crearUsuario( url:string, params?: any ){
    let request$ = this.http.post<DataApi>(environment.UrlApi + url , params = params).pipe(
      tap( ( result:DataApi | any )=>{
        this.refresh$.next();
          return result
      } ),
      catchError( ( error: HttpErrorResponse) =>{
        this._mensajesHttp.mostrarErrorHttp(error, String(error.error?.errors[0]['descripcion']), '');
          return [
            {
              data     : error,
              errors   : error,
              hasError :  true 
            }
          ]
      })
    );
    return request$
  }

  actualizarUsuario( url:string, params?: any ){
    let request$ = this.http.put<DataApi>(environment.UrlApi + url , params = params).pipe(
      tap( ( result:DataApi | any )=>{
        this.refresh$.next();
          return result
      } ),
      catchError( ( error: HttpErrorResponse) =>{
        this._mensajesHttp.mostrarErrorHttp(error, String(error.error?.errors[0]['descripcion']), '');
          return [
            {
              data     : error,
              errors   : error,
              hasError :  true 
            }
          ]
      })
    );
    return request$
  }

  /* USUARIOS */

  /* ROLES */
  roles( url:string, params?: any ){
    let request$ = this.http.get<DataApi>(environment.UrlApi + url , params = params).pipe(
      tap( ( result:DataApi | any )=>{
          return result
      } ),
      catchError( ( error: HttpErrorResponse) =>{
        this._mensajesHttp.mostrarErrorHttp(error, String(error.error?.errors[0]['descripcion']), '');
          return [
            {
              data     : error,
              errors   : error,
              hasError :  true 
            }
          ]
      })
    );
    return request$
  }
  /* ROLES */

    /* MENUS ADMINISTRACION -- MODULOS */
  modulosPadre( url:string, params?: any ){
      let request$ = this.http.get(environment.UrlApi + url , params = params).pipe(
        tap( ( result:DataApi | any )=>{
            return result
        } ),
        catchError( ( error: HttpErrorResponse) =>{
          this._mensajesHttp.mostrarErrorHttp(error, String(error.error?.errors[0]['descripcion']), '');
            return [
              {
                data     : error,
                errors   : error,
                hasError :  true 
              }
            ]
        })
      );
      return request$
  }
    /* MENUS ADMINISTRACION -- MODULOS */

    /* MENUS ADMINISTRACION -- MENUS */
    menus( url:string, params?: any ){
      let request$ = this.http.get(environment.UrlApi + url , params = params).pipe(
        tap( ( result:DataApi | any )=>{
            return result
        } ),
        catchError( ( error: HttpErrorResponse) =>{
          this._mensajesHttp.mostrarErrorHttp(error, String(error.error?.errors[0]['descripcion']), '');
            return [
              {
                data     : error,
                errors   : error,
                hasError :  true 
              }
            ]
        })
      );
      return request$
  }

  PedidosMonitor( url , body ){
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer eyJraWQiOiJIcjVEbFF6dTZTV3A4U1Jkd2hMcTBVK3RtXC81UDV2eVdaWkI3cWpSQmpSRT0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI5NzM1MGZiZC05YWM3LTQ0N2ItYmQ3OS0yMGNlNjQ5YjUwOGQiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfSU9YUlNZdEVZIiwiY29nbml0bzp1c2VybmFtZSI6ImRpc3RyaWJ1aWRvcmEtaW50ZWdyYWNpb24td21zIiwiY3VzdG9tOmNsaWVudG5hbWUiOiJEaXN0cmlidWlkb3JhIEZpZXN0YSBTLiBEZSBSLkwuIiwiYXVkIjoiY2kybjNpdTNqaTNzbmRzazk3cDVoaWg3diIsImV2ZW50X2lkIjoiZDRmZjZiMzMtMjc3MC00YTFmLThlNTQtODQzOTYyMmM3ZDQ0IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2OTcwNTEzNjUsImV4cCI6MTY5NzA1NDk2NCwiaWF0IjoxNjk3MDUxMzY1LCJlbWFpbCI6ImRpc3RyaWJ1aWRvcmFAcmFuc2EubmV0In0.HhD77LZhMmqF8CkvknP-e7U_FTuM4617aYfi2aUCJ7uSfUZcmu7eldtoYnDhqlVky47Mgti2RT5Bo5fRS-rOiR6HxL3d9EtLGMF0cs4rRo4xGUT98-LDExSV5Grpq1Ms7_c-5q9tJUERyNlaxzD3o3MJNAWRiVCZsA0_cxRVWGGoprIN9FYY7mOUEr5vFC7FZXw-roEvshQzQwfEFMGF4ZCdPHBywxv-zoCu5BZeak36B8zkulpBuC4jz6L5twi7rTuIj4LJousEIhTMBOHFeLkhKftnKETMM7xD3aDB61HfPfeNHnQ2O0JiU1ZTOpOZVqA-scvZx7mEwEdK5cw7OQ`)
        // .set('Host','api-wms.qas.ransaaplicaciones.com')
    }
    return this.http.post( url, body, header )
  }

  createAuthorizationHeader(headers: Headers) {
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Bearer ${btoa('distribuidora-integracion-wms:Ransa-360')}`)
        // .set('Host','api-wms.qas.ransaaplicaciones.com')
    }
    headers.append('Authorization', 'Basic ' +
      btoa('distribuidora-integracion-wms:Ransa-360')); 
  }

  loginAuth0(credentials: any) {
    // const headers = new HttpHeaders({
    //   Authorization: 'Basic ZGlzdHJpYnVpZG9yYS1pbnRlZ3JhY2lvbi13bXM6UmFuc2EtMzYw',
    //   // Host: 'api-wms.qas.ransaaplicaciones.com',
    //   // 'Connection': 'keep-alive',
    // })
    var header = {
      headers: new HttpHeaders()
        .set('Authorization',  `Basic ${btoa('distribuidora-integracion-wms:Ransa-360')}`)
        .set('Host','api-wms.qas.ransaaplicaciones.com')
    }
    // let headers = new Headers();
    // this.createAuthorizationHeader(headers);
    let request$ =  this.http.post(`https://api-wms.qas.ransaaplicaciones.com/auth/token`, [], header).pipe(
      tap( ( result: any )=>{
        console.log(result)
          return result
      } ),
      catchError( ( error: HttpErrorResponse) =>{
        this._mensajesHttp.mostrarErrorHttp(error, String(error.error?.errors[0]['descripcion']), '');
          return [
            {
              data     : error,
              errors   : error,
              hasError :  true 
            }
          ]
      })
    );
    return request$
  }


    // Servicio de Inserción 
    post( url?:string, params?:any){
      let request$ = this.http.post<DataApi>(environment.UrlApi + url,params).pipe(
        tap( ( result:DataApi | any )=>{
          this.refresh$.next();
            return result
        } ),
        catchError( ( error: HttpErrorResponse) =>{
          this._mensajesHttp.mostrarErrorHttp(error, String(error.error?.errors[0]['descripcion']), '');
            return [
              {
                data     : error,
                errors   : error,
                hasError :  true 
              }
            ]
        })
      );
      return request$
    }
  // Servicio de Actualización
  put( url?:string, params?:any){
  
    let request$ = this.http.put<DataApi>(environment.UrlApi + url,params).pipe(
      tap( ( result:DataApi | any )=>{
        this.refresh$.next();
          return result
      } ),
      catchError( ( error: HttpErrorResponse) =>{
        this._mensajesHttp.mostrarErrorHttp(error, String(error.error?.errors[0]['descripcion']), '');
          return [
            {
              data     : error,
              errors   : error,
              hasError :  true 
            }
          ]
      })
    );
    return request$
  }
   

  /* MENUS ADMINISTRACION -- MENUS */


}
