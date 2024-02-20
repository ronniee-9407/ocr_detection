import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  login(login_data: any): Observable<any>{
    return this.http.post("http://192.168.68.129:5000/login",{"login_data": login_data, withCredentials: true});
  }

  add_camera(camDetails: any){
    return this.http.post("http://192.168.68.129:5000/add_cam",{"camDetails": camDetails, withCredentials: true});
  }
}
