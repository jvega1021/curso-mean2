import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Artist } from '../../models/artist';


@Component({
  selector: 'artist-add',
  templateUrl: './artist-add.component.html',
  styleUrls: ['./artist-add.component.css']
})
export class ArtistAddComponent implements OnInit {

  public title: string;
  public artist: Artist;
  public identity;
  public token;
  public url: string;

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService) {
      this.title = 'Crear nuevo artista';
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.url = GLOBAL.url;
      this.artist = new Artist('','','');
  }

  ngOnInit() {
      //console.log('artist-add-component cargado ...!'+ this.artist);
  }

  onSubmit(){
    
  }

}
