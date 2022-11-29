import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { finanzasRoutingModule } from './finanzas-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { FacturacionComponent } from './facturacion/facturacion.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { ModalComponent } from './facturacion/modal/modal.component';
import { IntemedioComponent } from './facturacion/intemedio/intemedio.component';
import { CaiComponent } from './facturacion/cai/cai.component';
import { ModalCaiComponent } from './facturacion/cai/modal-cai/modal-cai.component';
import { FacturaAHComponent } from './facturacion/factura-ah/factura-ah.component';
import { FacturasClienteComponent } from './facturacion/facturas-cliente/facturas-cliente.component';
import { NdComponent } from './notas/nd/nd.component';
import { NcComponent } from './notas/nc/nc.component';
import { IntermediarioNComponent } from './notas/intermediario-n/intermediario-n.component';
import { ModalNComponent } from './notas/intermediarioN/modal-n/modal-n.component';



@NgModule({
  declarations: [
    FacturacionComponent,
    ParametrosComponent,
    ModalComponent,
    IntemedioComponent,
    CaiComponent,
    ModalCaiComponent,
    FacturaAHComponent,
    FacturasClienteComponent,
    NdComponent,
    NcComponent,
    IntermediarioNComponent,
    ModalNComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    finanzasRoutingModule,
    FormsModule,
    SharedModule
  ]
})
export class FinanzasModule { }
