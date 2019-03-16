/**
 * Gonzalo Chacón
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlaylistComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: PlaylistComponent,
  //   children: [
  //     {
  //       path: 'account',
  //       component: AccountComponent
  //     },
  //     {
  //       path: 'company',
  //       component: CompanyComponent
  //     },
  //     {
  //       path: 'team',
  //       component: TeamComponent
  //     },
  //     {
  //       path: 'warehouses',
  //       component: WarehousesComponent
  //     }
  //   ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaylistRoutingModule { }
