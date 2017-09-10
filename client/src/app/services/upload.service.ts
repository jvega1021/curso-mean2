import {Injectable} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';
import { GLOBAL } from './global';

@Injectable()

export class UploadService {

  public url: string;

  constructor(private _http: Http){

    this.url = GLOBAL.url;

  }

  //Petición ajax para subir ficheros convencionales
  makeFileRequest(url: string, params: Array<string>, files: Array<File>, token: string, name: string){

      //var token = this.token; //Recogiendo el token que esta en el localStorage que se almacena en el constructor

      return new Promise((resolve, reject) => {
          var formData: any = new FormData(); //Para simular el comportamiento de un formulario normal.
          var xhr = new XMLHttpRequest(); // La petición ajax de javascript

          for(var i = 0; i < files.length; i++){
              console.log(files[i].name);
              formData.append(name, files[i], files[i].name);
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
