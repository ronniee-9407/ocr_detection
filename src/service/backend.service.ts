import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private http: HttpClient) { }

  // login_data(login_data: any){
  //   let user_id = login_data['userId'];
  //   let password = login_data['password'];
  //   if(user_id === 'admin' && password === 'admin'){
  //     return true;
  //   }
  //   else{
  //     return false;
  //   }
  // }

  login(login_data: any): Observable<any>{
    return this.http.post("http://127.0.0.1:5008/login",{"login_data": login_data, withCredentials: true});
  }

  add_camera(camDetails: any): Observable<any>{
    return this.http.post("http://127.0.0.1:5008/add_cam",{"camDetails": camDetails, withCredentials: true});
  }

  add_DB(dbDetails: any): Observable<any>{
    return this.http.post("http://127.0.0.1:5008/add_db",{"dbDetails": dbDetails, withCredentials: true});
  }

  get_report_page_dashboard_data(): Observable<any>{
    return this.http.get("http://127.0.0.1:5008/report_dashboard_data");
  }

  add_user(user_data: any): Observable<any>{
    return this.http.post("http://127.0.0.1:5008/users",{"user_data": user_data, withCredentials: true});
  }

  edit_user(user_data: any): Observable<any>{
    return this.http.post("http://127.0.0.1:5008/edit_user",{"user_data": user_data, withCredentials: true});
  }

  select_mode(curr_mode: any): Observable<any>{
    return this.http.post("http://127.0.0.1:5008/change_mode",{"curr_mode": curr_mode, withCredentials: true});
  }

  manual_slabID(slab_id: any): Observable<any>{
    return this.http.post("http://127.0.0.1:5008/manual_slab_entry",{"slab_id": slab_id, withCredentials: true});
  }

  // searchDateTime(start_date: any, end_date: any): Observable<any>{
  //   return this.http.post("http://127.0.0.1:5008/search_date_time",{"start_date": start_date, "end_date": end_date, withCredentials: true});
  // }

}
