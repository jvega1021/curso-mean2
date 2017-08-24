import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';
import { GLOBAL } from '../../services/global';
import { Artist } from '../../models/artist';

@Component({
  selector: 'artists-list',
  templateUrl: './artists-list.component.html',
  providers: [UserService],
  styleUrls: ['./artists-list.component.css']
})

export class ArtistsListComponent implements OnInit {

  public title: string;
  public artists: Artist[];
  public identity;
  public token;
  public url: string;

  constructor(private _route: ActivatedRoute, private _router: Router, private _userService: UserService) {
      this.title = 'Artistas';
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.url = GLOBAL.url;
  }

  ngOnInit() {
      console.log('artist-list-component cargado ...!');
  }

}
