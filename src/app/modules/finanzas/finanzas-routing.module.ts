import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CaiComponent } from './facturacion/cai/cai.component';
import { FacturaAHComponent } from './facturacion/factura-ah/factura-ah.component';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { FacturasClienteComponent } from './facturacion/facturas-cliente/facturas-cliente.component';
import { IntemedioComponent } from './facturacion/intemedio/intemedio.component';
import { IntermediarioNComponent } from './notas/intermediario-n/intermediario-n.component';
import { NcComponent } from './notas/nc/nc.component';
import { NdComponent } from './notas/nd/nd.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { CargarDocumentoComponent } from './retenciones/cargar-documento/cargar-documento.component';
import { ProveedoresFComponent } from './retenciones/proveedores-f/proveedores-f.component';
import { RetencionComponent } from './retenciones/retencion/retencion.component';


const routes: Routes = [
 {
  path      : 'facturacion/:cliente/:documento/:tipo',
  component : FacturacionComponent
 },
 {
  path      : 'facturacionAh/:cliente/:documento/:tipo',
  component : FacturaAHComponent
 },
 {
  path      : 'facturacion/:sede',
  component : IntemedioComponent
 },
 {
  path      : 'parametros',
  component : ParametrosComponent
 },
 {
  path      : 'cai',
  component : CaiComponent
 },
 {
  path      : 'facturas',
  component : FacturasClienteComponent
 },
 {
  path      : 'notaDebito/:tipo',
  component : IntermediarioNComponent
 },
 {
  path      : 'notaCredito/:tipo',
  component : IntermediarioNComponent
 },
 {
  path      : 'notaDebito/:empresa/:cliente/:documento',
  component : NdComponent
 },
 {
  path      : 'notaCredito/:empresa/:cliente/:documento',
  component : NcComponent
 },

 {
  path      : 'Cretenciones',
  component : CargarDocumentoComponent
 },

 {
  path      : 'proveedores',
  component : ProveedoresFComponent
 },

 {
  path      : 'retencion',
  component : RetencionComponent
 }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class finanzasRoutingModule { }
