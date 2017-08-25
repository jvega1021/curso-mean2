import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import { GLOBAL } from './global';
import { Artist } from '../models/artist';

@Injectable()

export class ArtistService {

  public url: string;  //Aquí se guarda la url de la api rest.

  constructor(private _http: Http){
    this.url = GLOBAL.url; //Dentro de la propiedad url se guarda lo que esta en global
  }

  /** Traer todos los artistas por paginación */
  getArtists(token, page){

    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    let options = new RequestOptions({ headers: headers }); //Opciones de la petición, se utiliza para el método get.

    return (this._http.get(this.url+'/get-all-artists/'+page, options).map( res => res.json()));

  }


  /** Traer un artista por su respectivo id */
  getArtist(token, id: string){

    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    let options = new RequestOptions({ headers: headers }); //Opciones de la petición, se utiliza para el método get.

    return (this._http.get(this.url+'/get-artist/'+id, options).map( res => res.json()));

  }

  /** Agregar un artista a la base de datos */
  addArtist(token, artist: Artist){

    let params = JSON.stringify(artist);
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this._http.post(this.url+'/save-artist', params, { headers: headers}).map( res => res.json());

  }

  /** Editar un artista de la base de datos */
  editArtist(token, id: string, artist: Artist){

    let params = JSON.stringify(artist);
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this._http.put(this.url + '/put-artist/' + id, params, { headers: headers}).map( res => res.json());

  }

  /** Eliminar un artista de la base de datos */
  deleteArtist(token, id: string){

    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    let options = new RequestOptions({ headers: headers }); //Opciones de la petición, se utiliza para el método get.

    return (this._http.delete( this.url + '/delete-artist/' + id, options).map( res => res.json()));

  }
}
