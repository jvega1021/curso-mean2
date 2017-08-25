import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ArtistService } from '../../services/artist.service';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Artist } from '../../models/artist';

@Component({
  selector: 'artist-add',
  templateUrl: './artist-add.component.html',
  styleUrls: ['./artist-add.component.css'],
  providers: [ArtistService, UserService]
})

export class ArtistAddComponent implements OnInit {

  public title: string;
  public artist;
  public identity;
  public token;
  public url: string;
  public alertMessage;

  constructor(private _route: ActivatedRoute, private _router: Router, private _artistService: ArtistService, private _userService: UserService) {

      this.title = 'Crear artista';
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.url = GLOBAL.url;
      this.artist = new Artist(null,null,null);
  }

  ngOnInit() {

  }

  onSubmit(){
    console.log(this.artist); //Datos ingresados a través del formulario.

    this._artistService.addArtist(this.token, this.artist).subscribe(
      response => {

        this.artist = response.artist;

        if(!response.artist){

          this.alertMessage = 'Error en el servidor.';
        }
        else{

          this.alertMessage = 'El artista se ha creado correctamente';
          this.artist = response.artist;
          this._router.navigate(['editar-artista/', response.artist._id]);
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
    }
  }
