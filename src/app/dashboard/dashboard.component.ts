import { Component, OnInit, booleanAttribute } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BackendService } from 'src/service/backend.service';
import { NotificationService } from 'src/service/notification.service';
import { webSocket } from 'rxjs/webSocket';
import Litepicker from 'litepicker';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  view_list = ['Dashboard', 'Settings'];
  curr_view = this.view_list[0];
  curr_body = this.view_list[0];
  dashBoard_data = {
    "curr_slab": "12345",
    "status": true,
    "mode": "Auto"
  };
  report_data = {
    "Date_time": "07-02-2024 13:10",
    "jobID": "A123",
    "curr_slab": "12345",
    "actual_slab": "12345",
    "status": true
  };
  live_table_data = Array(1).fill(this.dashBoard_data).flat();
  report_table_data_dashboard = Array(5).fill(this.report_data).flat();
  temp = {
    'date_time': '27-02-2024 17:00',
    'Job_id': 12345,
    'actual_slab': 'AC56789LNB',
    'detected_slab': 'AC56789LNB',
    'result': true,
    'mode': 'Auto'
  }
  report_page_table_data = Array(15).fill(this.temp).flat();

  cam_feed_1: any;
  cam_feed_2: any;
  cam_status_1: boolean = false;
  cam_status_2: boolean = false;
  search_date_time_flag: boolean = false;

  startDate: any;
  endDate: any;
  startTime = '00:00';
  endTime = '23:59';
  picker: Litepicker | undefined;

  settings_view = ['Camera', 'Database'];
  setting_icon_list = ['addCam.png', 'database.png'];
  curr_settings_view = this.settings_view[0];

  manual_mode: boolean = false;
  popup_flag: boolean = false;

  slab_waiting_flag: boolean = false;
  mode_select_flag: boolean = false;
  slab_id_flag: boolean = false;
  share_data_flag: boolean = false;
  receive_data_flag: boolean = false;
  data_stored_flag: boolean = false;
  error_occured_flag: boolean = false;
  messages: any = []
  message_text: any;
  socket: any;

  current_mode: any;

  constructor(
    private service: BackendService, 
    private sanitizer: DomSanitizer, 
    private router: Router, 
    private notifyService: NotificationService
  ){}

  ngOnInit(): void {
    // this.socket_feed();
    this.socketFeed();
    this.process_feed();
  }

  socket_feed(){
    this.socket = io('http://127.0.0.1:5008');
    this.socket.on('connect', ()=>{
      console.log('Connected to server');
    });
    this.socket.on('server_message', (data: any)=>{
      console.log('server_message called.......', data);
    });
    this.socket.on('server_data', (jsonData: any)=>{
      const data = JSON.parse(jsonData);
      console.log('socket called.......', data);
      this.cam_status_1 = data['cam_status_1'];
      this.cam_status_2 = data['cam_status_2'];
      let frame_1 = 'data:image/jpg;base64,' + data['image_1'];
      this.cam_feed_1 = this.sanitizer.bypassSecurityTrustUrl(frame_1);
      let frame_2 = 'data:image/jpg;base64,' + data['image_2'];
      this.cam_feed_2 = this.sanitizer.bypassSecurityTrustUrl(frame_2);
      this.slab_waiting_flag = data['slab_waiting_flag'];
      this.slab_id_flag = data['slab_id_flag'];
      this.share_data_flag = data['share_data_flag'];
      this.receive_data_flag = data['receive_data_flag'];
      this.data_stored_flag = data['data_stored_flag'];
      this.error_occured_flag = data['errorOccured'];
      this.mode_select_flag = data['mode_select_flag'];
      this.current_mode = data['curr_mode'];
      if(this.current_mode == 'Auto' && this.manual_mode || this.current_mode == 'Manual' && !this.manual_mode){
        this.change_mode(true);
      }
    });
  }

  
  socketFeed(){
    // console.log('Socket called............');
    let socket_url = "ws://127.0.0.1:5008/video_feed";
    let socket = webSocket(socket_url);
    let socket_feed = socket.subscribe((data: any)=>{
      console.log('websocket data',data);
      this.cam_status_1 = data['cam_status_1'];
      this.cam_status_2 = data['cam_status_2'];
      let frame_1 = 'data:image/jpg;base64,' + data['image_1'];
      this.cam_feed_1 = this.sanitizer.bypassSecurityTrustUrl(frame_1);
      let frame_2 = 'data:image/jpg;base64,' + data['image_2'];
      this.cam_feed_2 = this.sanitizer.bypassSecurityTrustUrl(frame_2);
      
      this.live_table_data = data['live_table_data'];
    })
  }

  process_feed(){
    let socket_url = "ws://127.0.0.1:5008/process_feed";
    let socket = webSocket(socket_url);
    let socket_feed = socket.subscribe((data: any)=>{
      // console.log('process_feed data',data);
      this.slab_waiting_flag = data['slab_waiting_flag'];
      this.mode_select_flag = data['mode_select_flag'];
      this.slab_id_flag = data['slab_id_flag'];
      this.share_data_flag = data['share_data_flag'];
      this.receive_data_flag = data['receive_data_flag'];
      this.data_stored_flag = data['data_stored_flag']
    })
  }

  change_mode(flag: boolean){
    this.popup_flag = false;
    const checkbox = document.getElementById("checkbox_toggle") as HTMLInputElement;
    if (!flag && !this.manual_mode) {    
      checkbox.checked = false;
      return;
    }
    else if(!flag && this.manual_mode){
      checkbox.checked = true;
      return;
    }
    let curr_selected_mode = '';
    if (flag) {
      if(this.manual_mode){
        this.manual_mode = false;
        curr_selected_mode = 'Auto';
        checkbox.checked = false;
      }
      else{
        this.manual_mode = true; 
        curr_selected_mode = 'Manual';
        checkbox.checked = true;
      }
  
      let mode_send = {
        'mode': curr_selected_mode
      }

      this.service.select_mode(mode_send).subscribe((data: any)=>{
        if(data['status']){

          this.notifyService.showInfo('Mode changes successfully','Notification');
        }
      },(error: any)=>{
        this.notifyService.showError('Please check your Server', 'Server Connection Error');
      });
    } 
  }

  submitSlabId(){
    // console.log('submitSlabId called.....');
    let slab = <HTMLInputElement> document.getElementById('manual_slabId');
    let slab_id = slab.value;
    if(slab_id == ''){
      this.notifyService.showWarning('⚠ All inputs are required','Notification');
    }
    this.service.manual_slabID(slab_id).subscribe((data :any)=>{
      // console.log('manual_slabID',data);
      this.notifyService.showInfo('Slab ID '+ slab_id + ' sent successfully','Notification');
      },(error: any)=>{
        this.notifyService.showError('Please check your Server', 'Server Connection Error');
      });
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

  addDB(){
    let host = <HTMLInputElement> document.getElementById('host');
    let host_value = host.value;
    let user = <HTMLInputElement> document.getElementById('userID');
    let user_id = user.value;
    let pass = <HTMLInputElement> document.getElementById('password');
    let password = pass.value;
    let db = <HTMLInputElement> document.getElementById('db');
    let port = db.value;

    if(host_value == '' || user_id == '' || password == '' || port == ''){
      this.notifyService.showWarning('All input fields are required ⚠','Notification');
      return;
    }

    let db_data = {
      'ip': host_value,
      'userId': user_id,
      'password': password,
      'port': port
    };
    this.service.add_DB(db_data).subscribe((data: any)=>{
      if(data['status']){
        this.notifyService.showSuccess('Database updated successfully','Notification');
        host_value = '';
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


  logout(){
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}