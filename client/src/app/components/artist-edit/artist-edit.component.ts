import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

/** Services*/
import { ArtistService } from '../../services/artist.service';
import { UserService } from '../../services/user.service';
import { UploadService } from '../../services/upload.service';
import { GLOBAL } from '../../services/global';

/** Models */
import { Artist } from '../../models/artist';

@Component({
  selector: 'artist-edit',

  templateUrl: '../artist-add/artist-add.component.html', /* Aquí llamo al template de artist add ya que es el mismo formulario, solo le inidico que is_edit es true para que me muestre la parte de la imagen*/

  styleUrls: ['./artist-edit.component.css'],
  providers: [ArtistService, UserService, UploadService]
})
export class ArtistEditComponent implements OnInit {

  public title: string;
  public artist;
  public identity;
  public token;
  public url: string;
  public alertMessage;
  public is_edit;
  public filesToUpload: Array<File>;

  constructor(private _route: ActivatedRoute, private _router: Router, private _artistService: ArtistService, private _userService: UserService, private _uploadService: UploadService) {

    this.title = 'Editar artista';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artist = new Artist(null,null,null);
    this.is_edit = true;
  }

  ngOnInit() {
    console.log('artist-edit-component cargado ...!');

    /** LLamar método de api para sacar artista de la base de datos */

    this.getArtist();
  }

  getArtist(){

    /** Genera un array con todos los parametro de la url */
    this._route.params.forEach(( params: Params ) => {

      let id = params['id'];

      this._artistService.getArtist(this.token, id).subscribe(
        response => {
          this.artist = response.artist;

          if(!response.artist){

            this._router.navigate(['/']);
            console.log('entro al if');

          }
          else{
            this.artist = response.artist;
          }
        },

        error => {

          this.alertMessage = <any>error;

          if(this.alertMessage != null){

              var body = JSON.parse(error._body); //se guarda el cuerpo del error y se pasa a un objeto json.
              //this.alertMessage = body.message; //Se guarda el atributo message del cuerpo del error
              console.log(error);
          }

        }

      );
    });
  }

  onSubmit(){

    this._route.params.forEach(( params: Params ) => {

      let id = params['id'];
      console.log(this.artist); //Datos ingresados a través del formulario.

      this._artistService.editArtist(this.token, id, this.artist).subscribe(
        response => {

          this.artist = response.artist;

          if(!response.artist){

            this.alertMessage = 'Error en el servidor.';
          }
          else{

            this.alertMessage = '¡El artista se ha actualizado correctamente!';

            /** Subir la imagen de artista */
            this._uploadService.makeFileRequest(this.url + '/upload-image-artist/' + id, [], this.filesToUpload, this.token, 'image').then(

                (result) => {
                  this._router.navigate(['/artistas/', 1]);
                },

                (error) => {
                  console.log(error);
                }

            );
            //this.artist = response.artist;
            //this._router.navigate(['/editar-artista'], response.artist._id);
          }

        },

        error => {
            this.alertMessage = <any>error;

            if(this.alertMessage != null){

                var body = JSON.parse(error._body); //se guarda el cuerpo del error y se pasa a un objeto json.
                this.alertMessage = body.message; //Se guarda el atributo message del cuerpo del error
                console.log(error);
            }
        });
    });

  }

  fileChangeEvent(fileInput: any){

      /** fileInput.target.files = recoge los archivos seleccionados en el input y los asigna a la variable filesToUpload */

      this.filesToUpload = <Array<File>>fileInput.target.files;

      console.log(this.filesToUpload);
  }

}
