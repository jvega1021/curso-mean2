import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { GLOBAL } from '../../services/global';

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
    public filesToUpload: Array<File>;  //Ficheros a subir que es un array de archivos, de objetos de tipo file
    public url: string;

  constructor(private _userService : UserService) {

      this.title = 'Actualizar mis datos';
      this.identity = this._userService.getIdentity(); //localStorage
      this.token = this._userService.getToken(); //localStorage

      this.user = this.identity; //El objeto user va a estar relleno con los datos del localStorage

      this.url = GLOBAL.url;
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


                  //Si no hay nada en filesToUpload no sube ningun fichero.
                  if(!this.filesToUpload){
                      //Redireccion
                  }
                  else{

                      var url = this.url + '/upload-image-user/' + this.user._id;

                      this.makeFileRequest(url, [], this.filesToUpload).then(
                          (result: any) => {
                              this.user.image = result.image;
                              localStorage.setItem('identity', JSON.stringify(this.user));

                              //Construyendo la url para consultar
                              let image_path = this.url + '/get-image-user/'+ this.user.image;

                              //Actualizando la imagen
                              document.getElementById("image-logged").setAttribute('src', image_path);
                          }
                      ).catch(e =>{
                          console.log('Catch: '+e);
                      });
                  }

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

  // Se lanza en el evento change del input de seleccion del archivo
  fileChangeEvent(fileInput: any){

      //fileInput.target.files = recoge los archivos seleccionados en el input y los asigna a la variable filesToUpload

      this.filesToUpload = <Array<File>>fileInput.target.files;
      console.log(this.filesToUpload);
  }

  //Petición ajax para subir ficheros convencionales
  makeFileRequest(url: string, params: Array<string>, files: Array<File>){

      var token = this._userService.getToken()
      //var token = this.token; //Recogiendo el token que esta en el localStorage que se almacena en el constructor

      return new Promise((resolve, reject) => {
          var formData: any = new FormData(); //Para simular el comportamiento de un formulario normal.
          var xhr = new XMLHttpRequest(); // La petición ajax de javascript

          for(var i = 0; i < files.length; i++){
              console.log(files[i].name);
              formData.append('image', files[i], files[i].name);
          }

          xhr.onreadystatechange = function(){
              if(xhr.readyState == 4){
                  if(xhr.status == 200){
                     resolve(JSON.parse(xhr.response));
                  }
                  else{
                      reject(xhr.response);
                  }
              }
          }

          //Lanzando la petición
          xhr.open('POST', url, true);

          //Le pasamos la cabecera de Authorization que es el token que estamos recogiendo de la localStorage
          xhr.setRequestHeader('Authorization', token);

          //Lanzamos el formData
          xhr.send(formData);
      });
  }

}
