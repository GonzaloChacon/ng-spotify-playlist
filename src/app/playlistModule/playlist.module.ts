/**
 * Gonzalo Chacón
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PlaylistRoutingModule } from './playlistRouting.module';
import { AlbumComponent, SearchResultsComponent, ArtistComponent, PlaylistTracksComponent } from './components';
import { PlaylistComponent } from './playlist.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PlaylistRoutingModule
  ],
  declarations: [
    PlaylistComponent,
    SearchResultsComponent,
    ArtistComponent,
    AlbumComponent,
    PlaylistTracksComponent
  ],
  providers: []
})
export class PlaylistModule { }
