import { Component } from '@angular/core';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public title = 'MUSIFY'; //Titulo de la aplicación
  public user;  //Objeto de usuario que es el que ingresa inicialmente
  public identity; //Para comprobar los datos del usuario logueado
  public token;


  constructor(){
      this.user = new User('', '', '', '', '', 'ROLE_USER', '');
  }
}
