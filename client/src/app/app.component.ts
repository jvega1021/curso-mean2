import { Component, OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit {
  public title = 'MUSIFY'; //Titulo de la aplicación
  public user;  //Objeto de usuario que es el que ingresa inicialmente
  public user_register;
  public identity; //Para comprobar los datos del usuario logueado
  public token; //Donde se guarda el token recibido del API
  public errorMessage;
  public alertRegister;

  constructor(private _userService: UserService){
      this.user = new User('', '', '', '', '', 'ROLE_USER', '');
      this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
  }

  ngOnInit(){

      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();

    //   console.log(this.identity);
    //   console.log(this.token);
  }

  public onSubmitLogin(){
      //console.log(this.user); //Esto es lo que me esta llegando del formulario.

      //Conseguir los datos del usuario identificado.
      this._userService.signUp(this.user).subscribe( response => {

          let identity = response.user;
          this.identity = identity;

          if(!this.identity._id){
              alert('El usuario no esta correctamente identificado. ');
          }
          else{
              //Crear sesión en el localstorage

              localStorage.setItem('identity', JSON.stringify(identity));

              //Conseguir el token para enviarselo a cada peticion http
              this._userService.signUp(this.user, 'true').subscribe(
                 response => {

                  let token = response.token;
                  this.token = token;

                  if(this.token.length <= 0){
                      alert('El token no se ha generado.');
                  }
                  else{
                      //Crear elemento en el localstorage para tener el token disponible.

                      localStorage.setItem('token', token);
                      this.user = new User('', '', '', '', '', 'ROLE_USER', '');
                  }
              },
              error => {
                  this.errorMessage = <any>error;

                  if(this.errorMessage != null){

                      var body = JSON.parse(error._body); //se guarda el cuerpo del error y se pasa a un objeto json.
                      this.errorMessage = body.message; //Se guarda el atributo message del cuerpo del error
                      console.log(error);
                  }
              });

          }
      },
      error => {
          this.errorMessage = <any>error;

          if(this.errorMessage != null){

              var body = JSON.parse(error._body); //se guarda el cuerpo del error y se pasa a un objeto json.
              this.errorMessage = body.message; //Se guarda el atributo message del cuerpo del error
              console.log(error);
          }
      });
  }

  logOut(){
      localStorage.removeItem('identity');
      localStorage.removeItem('token');
      localStorage.clear();

      this.identity = null;
      this.token = null;
  }



  onSubmitRegister(){
      console.log(this.user_register);
      this._userService.register(this.user_register).subscribe(
          response => {

              let user = response.user;
              this.user_register = user;

              if(!user._id){
                  this.alertRegister = 'Error al registrarse';
              }
              else{
                  this.alertRegister = 'El registro se ha realizado correctamente, identificate con '+this.user_register.email;
                  this.user_register = new User('', '', '', '', '', 'ROLE_USER', '');
              }
          },
          error => {

              this.alertRegister = <any>error;

              if(this.errorMessage != null){
                  var body = JSON.parse(error._body);
                  //this.errorMessage = body.message; //Se guarda el atributo message del cuerpo del error
                  console.log(error);
              }

          });
  }
}
