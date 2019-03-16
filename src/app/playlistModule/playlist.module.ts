/**
 * Gonzalo Chacón
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { PlaylistRoutingModule } from './playlistRouting.module';
import { PlaylistComponent, AlbumsComponent } from './components';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PlaylistRoutingModule
  ],
  declarations: [
    PlaylistComponent,
    AlbumsComponent
  ],
  providers: []
})
export class PlaylistModule { }
