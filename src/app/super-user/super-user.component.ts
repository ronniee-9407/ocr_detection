import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/service/backend.service';
import { NotificationService } from 'src/service/notification.service';
import Litepicker from 'litepicker';

@Component({
  selector: 'app-super-user',
  templateUrl: './super-user.component.html',
  styleUrls: ['./super-user.component.scss']
})
export class SuperUserComponent implements OnInit {

  view_list = ['Dashboard', 'Settings'];
  curr_view = this.view_list[0];
  curr_body = this.view_list[0];

  settings_view = ['Camera', 'User'];
  setting_icon_list = ['addCam.png', 'add-group.png'];
  curr_settings_view = this.settings_view[0];
  report_data = {
    "Date_time": "07-02-2024 13:10",
    "jobID": "A123",
    "curr_slab": "12345",
    "actual_slab": "12345",
    "status": true
  };
  report_table_data_dashboard = Array(5).fill(this.report_data).flat();
  temp = {
    'date_time': '27-02-2024 17:00',
    'Job_id': 12345,
    'actual_slab': 'AC56789LNB',
    'detected_slab': 'AC56789LNB',
    'result': true,
    'mode': 'Auto'
  }
  report_page_table_data = Array(50).fill(this.temp).flat();

  startDate: any;
  endDate: any;
  startTime = '00:00';
  endTime = '23:59';
  picker: Litepicker | undefined;

  constructor(
    private service: BackendService,  
    private router: Router, 
    private notifyService: NotificationService,
  ){}

  ngOnInit(): void {
        
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
    let cam_ip = <HTMLInputElement> document.getElementById('camIP'+lastChar);
    let cam_ip_value = cam_ip.value;
    let user = <HTMLInputElement> document.getElementById('userID' + lastChar);
    let user_id = user.value;
    let pass = <HTMLInputElement> document.getElementById('password' + lastChar);
    let password = pass.value;
    let port = <HTMLInputElement> document.getElementById('port' + lastChar);
    let port_value = port.value;

    if(cam_ip_value == '' || user_id == '' || password == '' || port_value == ''){
      this.notifyService.showWarning('All input fields are required ⚠','Notification');
      return;
    }

    let cam_data = {
      'ip': cam_ip_value,
      'userId': user_id,
      'password': password,
      'port': port_value,
      'cam_name': camName
    };
    this.service.add_camera(cam_data).subscribe((data: any)=>{
      console.log('add_camera',data);
      if(data['status']){
        this.notifyService.showSuccess('Camera added successfully','Notification');
        cam_ip_value = '';
        user_id = '';
        password = '';
      }
      else{
        this.notifyService.showWarning('Wrong Credentials ⚠','Credentials not matched');
      }
    },
    (error: any)=>{
      this.notifyService.showError('Please check your Server', 'Server Connection Error');
    });
  }

  addUser(){
    let name = <HTMLInputElement> document.getElementById('new_username');
    let userName = name.value;
    let userId = <HTMLInputElement> document.getElementById('new_user_id');
    let user_id = userId.value;
    let pass = <HTMLInputElement> document.getElementById('new_password');
    let password = pass.value;
    let cnf_pass = <HTMLInputElement> document.getElementById('cnf_new_password');
    let cnf_password = cnf_pass.value;

    if(userName == '' || user_id == '' || password == '' || cnf_password == ''){
      this.notifyService.showWarning('All input fields are required ⚠','Notification');
      return;
    }

    if(password != cnf_password){
      this.notifyService.showWarning('Password and Confirm Password not matched ⚠','Notification');
      return;
    }

    let user_data = {
      'name': userName,
      'userId': user_id,
      'password': password,
      'user_type': 'User'
    };
    this.service.add_user(user_data).subscribe((data: any)=>{
      console.log('add_user',data);
      if(data['status']){
        this.notifyService.showSuccess(data['message'],'Notification');
        name.value = '';
        userId.value = '';
        pass.value = '';
        cnf_pass.value = '';
      }
      else{
        this.notifyService.showWarning('Wrong Credentials','User not added');
      }
    },
    (error: any)=>{
      this.notifyService.showError('Please check your Server', 'Server Connection Error');
    });
  }

  editUser(){
    let user = <HTMLInputElement> document.getElementById('edit_user');
    let userId = user.value;
    let old_pass = <HTMLInputElement> document.getElementById('old_password');
    let old_password = old_pass.value;
    let new_pass = <HTMLInputElement> document.getElementById('new_edit_password');
    let new_password = new_pass.value;
    let cnf_pass = <HTMLInputElement> document.getElementById('cnf_edit_password');
    let cnf_password = cnf_pass.value;

    if(userId == '' || old_password == '' ||  new_password == '' || cnf_password == ''){
      this.notifyService.showWarning('All input fields are required ⚠','Notification');
      return;
    }
    if(new_password !== cnf_password){
      this.notifyService.showWarning('Confirm Password not matched ⚠','Notification');
      return;
    }

    let user_data = {
      'userId' : userId,
      'old_password' : old_password,
      'new_password' : new_password
    }

    this.service.edit_user(user_data).subscribe((data: any)=>{
      if(data['status']){
        this.notifyService.showSuccess(data['message'],'Notification');
        user.value = '',
        old_pass.value = '';
        new_pass.value = '';
        cnf_pass.value = '';
      }
      else{
        this.notifyService.showError(data['error'],'Notification');
      }
    },(error: any)=>{
      this.notifyService.showError('Please check your Server', 'Server Connection Error');
    });
  }

  logout(){
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }

}
