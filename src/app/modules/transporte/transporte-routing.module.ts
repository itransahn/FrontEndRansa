import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from "../seguridad/dashboard/dashboard.component";
import { CamionesComponent } from './camiones/camiones.component';
import { ClientesTComponent } from './clientes-t/clientes-t.component';
import { MotoristasComponent } from './motoristas/motoristas.component';
import { ProveedoresTComponent } from './proveedores-t/proveedores-t.component';
import { RolClienteComponent } from './rol-cliente/rol-cliente.component';
import { RolProveedorComponent } from './rol-proveedor/rol-proveedor.component';
import { TransClienteComponent } from './trans-cliente/trans-cliente.component';
import { TransProveedorComponent } from './trans-proveedor/trans-proveedor.component';
import { TransportesComponent } from './transportes/transportes.component';



const routes: Routes = [
    {
      path : '',
      component : DashboardComponent
    },
    {
        path : 'transportes',
        component : TransportesComponent
    },
    {
        path : 'camiones',
        component : CamionesComponent
    },    
    {
        path : 'motoristas',
        component : MotoristasComponent
    },  
    {
        path : 'clientes',
        component : ClientesTComponent
    },  
    {
        path : 'proveedores',
        component : ProveedoresTComponent
    }, 
    {
        path : 'transCliente',
        component : TransClienteComponent
    },  
    {
        path : 'transProveedor',
        component : TransProveedorComponent
    },  
    {
        path : 'rolCliente',
        component : RolClienteComponent
    },  
    {
        path : 'rolProveedor',
        component : RolProveedorComponent
    }, 
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class transporteRoutingModule { }