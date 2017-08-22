import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'user-edit',
  templateUrl: './user-edit.component.html',
  providers: [UserService],
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

    public title: string;
    public user: User ;
    public identity;
    public token;
    public alertMessage;

  constructor(private _userService : UserService) {

      this.title = 'Actualizar mis datos';


      //localStorage
      this.identity = this._userService.getIdentity();
      this.token = this._userService.getToken();
      this.user = this.identity;
  }

  ngOnInit() {
  }

  onSubmit(){

      //console.log(this.user);
      this._userService.updateUser(this.user).subscribe(
          response => {

              this.user = response.user;

              if(!response.user){
                  this.alertMessage = 'El usuario no se ha actualizado.';
              }
              else{
                  //this.user = response.user;
                  localStorage.setItem('identity', JSON.stringify(this.user));
                  document.getElementById("identity_name").innerHTML = response.user.name;

                  this.alertMessage = 'Datos actualizados correctamente.';
              }

          },
          error =>{
              this.alertMessage = <any>error;

              if(this.alertMessage != null){

                  var body = JSON.parse(error._body); //se guarda el cuerpo del error y se pasa a un objeto json.
                  this.alertMessage = body.message; //Se guarda el atributo message del cuerpo del error
                  console.log(error);
          }
      });
  }

}
