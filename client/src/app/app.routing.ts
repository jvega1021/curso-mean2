import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/** Componentes */
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { ArtistsListComponent } from './components/artists-list/artists-list.component';
import { HomeComponent } from './components/home/home.component';
import { ArtistAddComponent } from './components/artist-add/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail/artist-detail.component';

const appRoutes: Routes = [
    /** Rutas base que llevan a la home*/
    {path: '', component: HomeComponent},
    {path: '*', component: HomeComponent},

    /** Ruta de usuario o mis datos */
    {path: 'mis-datos', component: UserEditComponent},

    /** Rutas de artista */
    {path: 'artistas/:page', component: ArtistsListComponent},
    {path: 'crear-artista', component: ArtistAddComponent},
    {path: 'editar-artista/:id', component: ArtistEditComponent},
    {path: 'artista/:id', component: ArtistDetailComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
