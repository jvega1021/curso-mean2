import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Componentes
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { ArtistsListComponent } from './components/artists-list/artists-list.component';
import { HomeComponent } from './components/home/home.component';
import { ArtistAddComponent } from './components/artist-add/artist-add.component';

const appRoutes: Routes = [

    {path: '', component: HomeComponent},
    {path: 'mis-datos', component: UserEditComponent},
    {path: '*', component: HomeComponent},
    {path: 'artistas/:page', component: ArtistsListComponent},
    {path: 'crear-artista', component: ArtistAddComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
