import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BackendService } from 'src/service/backend.service';
import { NotificationService } from 'src/service/notification.service';
import { webSocket } from 'rxjs/webSocket';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  view_list = ['Dashboard', 'Settings', 'Report'];
  curr_view = this.view_list[0];
  curr_body = this.view_list[0];
  live_table_data: any = [];
  report_table_data: any = [];

settings_view = ['Camera', 'Database', 'PLC'];
setting_icon_list = ['addCam.png', 'database.png', 'plc.png'];
curr_settings_view = this.settings_view[0];

  constructor(
    private service: BackendService, 
    private sanitizer: DomSanitizer, 
    private router: Router, 
    private notifyService: NotificationService, 
  ){}

  ngOnInit(): void {
    let dashBoard_data = {
      "curr_slab": "12345",
      "actual_slab": "12345",
      "status": true
    };
    let report_data = {
      "Date_time": "07-02-2024 13:10",
      "jobID": "A123",
      "curr_slab": "12345",
      "actual_slab": "12345",
      "status": true
    };
    this.live_table_data = this.createDummydata(dashBoard_data);
    this.report_table_data = this.createDummydata(report_data);
  }

  createDummydata(data: any){
    const arr = [];
    for(let i =0; i<5; i++){
      arr.push(data);
    }
    return arr;
  }

  changeView(index: any){
    this.curr_view = this.view_list[index];
    this.curr_body = this.view_list[index];
  }

  changeSettingView(index: any){
    this.curr_settings_view = this.settings_view[index];
  }

  addCam(camName: any){
    // console.log('camName',camName);
    let lastChar = camName.charAt(camName.length - 1);
    let cam_ip = <HTMLInputElement> document.getElementById('camIP');
    let cam_ip_value = cam_ip.value;
    let user = <HTMLInputElement> document.getElementById('userID');
    let user_id = user.value;
    let pass = <HTMLInputElement> document.getElementById('password');
    let password = pass.value;
    let port = <HTMLInputElement> document.getElementById('port');
    let port_value = port.value;

    if(cam_ip_value == '' || user_id == '' || password == '' || port_value == ''){
      this.notifyService.showWarning('Input fields cannot be empty !','Notification');
      return;
    }

    let cam_data = {
      'ip': cam_ip_value,
      'userId': user_id,
      'password': password,
      'port': port_value,
      'cam_name': camName
    }
    this.service.add_camera(cam_data).subscribe((data: any)=>{

    },
    (error: any)=>{
      this.notifyService.showError('Please check your Server', 'Server Connection Error');
    });
    // console.log('Camip is',user_id);
  }

  addDB(){
    // let lastChar = camName.charAt(camName.length - 1);
    let host = <HTMLInputElement> document.getElementById('host');
    let host_value = host.value;
    let user = <HTMLInputElement> document.getElementById('userID');
    let user_id = user.value;
    let pass = <HTMLInputElement> document.getElementById('password');
    let password = pass.value;
    let db = <HTMLInputElement> document.getElementById('db');
    let databse = db.value;
  }

  addPLC(){
    // let lastChar = camName.charAt(camName.length - 1);
    let host = <HTMLInputElement> document.getElementById('host');
    let host_value = host.value;
    let user = <HTMLInputElement> document.getElementById('userID');
    let user_id = user.value;
    let pass = <HTMLInputElement> document.getElementById('password');
    let password = pass.value;
    let plc = <HTMLInputElement> document.getElementById('plc');
    let plc_value = plc.value;
  }

  logout(){
    sessionStorage.removeItem('isUserLoggedIn');
    this.router.navigate(['/login']);
  }
}
