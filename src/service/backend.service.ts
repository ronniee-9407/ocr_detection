import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  login(login_data: any){
    let user_id = login_data['userId'];
    let password = login_data['password'];
    if(user_id === 'admin' && password === 'admin'){
      return true;
    }
    else{
      return false;
    }
  }

  add_camera(camDetails: any){
    return this.http.post("http://192.168.68.129:5000/add_cam",{"camDetails": camDetails, withCredentials: true});
  }
}
