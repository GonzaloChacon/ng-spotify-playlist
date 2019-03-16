/**
 * Gonzalo Chacón
 */

import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomModulePreloading, AuthService } from '@app/core/services';
import { LoginComponent, NotFoundComponent } from '@app/core/components';

export const routes: Routes = [
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'playlist',
    canActivate: [AuthService],
    loadChildren: './playlistModule/playlist.module#PlaylistModule',
    data: { preload: true }
  },
  {
    path: '**',
    redirectTo: '/playlist'
  }
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes, { preloadingStrategy: CustomModulePreloading, useHash: false });
