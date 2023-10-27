import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AreasRansaComponent } from './mantenimientos/areas-ransa/areas-ransa.component';
import { CcoComponent } from './mantenimientos/cco/cco.component';
import { PuestosComponent } from './mantenimientos/puestos/puestos.component';
import { SedesComponent } from './mantenimientos/sedes/sedes.component';
import { TipoSangreComponent } from './mantenimientos/tipo-sangre/tipo-sangre.component';
import { MenusComponent } from './menus/menus.component';
import { PermisosMenusComponent } from './menus/permisos-menus/permisos-menus.component';
import { ModulosAdminComponent } from './modulos-admin/modulos-admin.component';
import { PermisosModuloComponent } from './modulos-admin/permisos-modulo/permisos-modulo.component';
import { RolesComponent } from './roles/roles.component';
import { UsuarioFormComponent } from './usuarios/usuario-form/usuario-form.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { InforComponent } from './infor/infor.component';
import { IntegracionesComponent } from './Integraciones/integraciones/integraciones.component';
import { PedidosComponent } from './Integraciones/pedidos/pedidos.component';
import { OrdenesComponent } from './Integraciones/ordenes/ordenes.component';
import { PropietariosComponent } from './Integraciones/propietarios/propietarios.component';

const routes: Routes = [
  {
    path : '',
    component : DashboardComponent
  },
  {
    path : 'usuarios',
    component : UsuariosComponent
  },
  {
    path : 'usuario/:id',
    component : UsuarioFormComponent
  },
  {
   path : 'roles',
   component : RolesComponent
  },
  {
    path : 'modulos',
    component : ModulosAdminComponent
  },
  {
    path : 'modulo/:id/:modulo',
    component : PermisosModuloComponent
  },
  {
    path : 'menu/:id',
    component : PermisosMenusComponent
  },
  {
    path : 'menus',
    component : MenusComponent
   },
   {
    path : 'cco',
    component : CcoComponent
   },
   {
    path : 'areas',
    component : AreasRansaComponent
   },
   {
    path : 'sede',
    component : SedesComponent
   },
   {
    path : 'sangre',
    component : TipoSangreComponent
   },
   {
    path : 'puestos',
    component : PuestosComponent
   },
   {
    path : 'infor',
    component : InforComponent
   },
   {
    path : 'pedidos',
    component : IntegracionesComponent
   },
   {
    path : 'pedidosInfor',
    component : PedidosComponent
   },
   {
    path : 'ordenesInfor',
    component : OrdenesComponent
   },
   {
    path : 'propietarioInfor',
    component : PropietariosComponent
   },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class seguridadRoutingModule { }
