/**
 * Gonzalo Chacón
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchResultsComponent, AlbumComponent, ArtistComponent } from './components';
import { PlaylistComponent } from './playlist.component';

const routes: Routes = [
  {
    path: '',
    component: PlaylistComponent,
    children: [
      {
        path: 'album/:albumId',
        component: AlbumComponent
      },
      {
        path: 'artist/:artistId',
        component: ArtistComponent
      },
      {
        path: 'search/:search',
        component: SearchResultsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlaylistRoutingModule { }
