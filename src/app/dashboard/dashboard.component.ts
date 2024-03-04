import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BackendService } from 'src/service/backend.service';
import { NotificationService } from 'src/service/notification.service';
import { webSocket } from 'rxjs/webSocket';
import Litepicker from 'litepicker';
import { SocketIOService } from 'src/service/socket-io.service';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  view_list = ['Dashboard', 'Settings', 'Report', 'Report_details'];
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

  

  constructor(
    private service: BackendService, 
    private sanitizer: DomSanitizer, 
    private router: Router, 
    private notifyService: NotificationService,
    private socketService: SocketIOService 
  ){}

  ngOnInit(): void {
    this.socket_feed();
  }

  socket_feed(){
    this.socket = io('http://192.168.68.111:5001');
    this.socket.on('connect', ()=>{
      console.log('Connected to server');
    });
    this.socket.on('server_message', (data: any)=>{
      console.log('server_message called.......', data);
    });
    this.socket.on('server_data', (data: any)=>{
      const jsonData = JSON.parse(data);
      // console.log('socket called.......', jsonData['cam_status_1']);
      this.cam_status_1 = jsonData['cam_status_1'];
      this.cam_status_2 = jsonData['cam_status_2'];
      let frame_1 = 'data:image/jpg;base64,' + jsonData['image_1'];
      this.cam_feed_1 = this.sanitizer.bypassSecurityTrustUrl(frame_1);
      let frame_2 = 'data:image/jpg;base64,' + jsonData['image_2'];
      this.cam_feed_2 = this.sanitizer.bypassSecurityTrustUrl(frame_2);
    });
  }


  // socketFeed(){
  //   let socket_url = "ws://192.168.68.111:5001/video_feed";
  //   let socket = webSocket(socket_url);
  //   let socket_feed = socket.subscribe((data: any)=>{
  //     // console.log('websocket data',data);
  //     this.cam_status_1 = data['cam_status_1'];
  //     this.cam_status_2 = data['cam_status_2'];
  //     let frame_1 = 'data:image/jpg;base64,' + data['image_1'];
  //     this.cam_feed_1 = this.sanitizer.bypassSecurityTrustUrl(frame_1);
  //     let frame_2 = 'data:image/jpg;base64,' + data['image_2'];
  //     this.cam_feed_2 = this.sanitizer.bypassSecurityTrustUrl(frame_2);
      
  //     this.live_table_data = data['live_table_data'];
  //   })
  // }


  process_feed(){
    let socket_url = "ws://127.0.0.1:5000/process_feed";
    let socket = webSocket(socket_url);
    let socket_feed = socket.subscribe((data: any)=>{
      console.log('process_feed data',data);
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
      
      // if(this.manual_mode)
      //   checkbox.checked = false;
      // else
      //   checkbox.checked = true;

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
      
      let input = <HTMLInputElement> document.getElementById('manual_slabId');
      input.value = '';
      console.log('manual mode', this.manual_mode);
      this.service.select_mode(mode_send).subscribe((data: any)=>{
        if(data['status'])
          this.notifyService.showInfo(data['message'],'Notification');
      },(error: any)=>{
        this.notifyService.showError('Please check your Server', 'Server Connection Error');
      });
    }
    
  }


  submitSlabId(){
    console.log('submitSlabId called.....');
    let slab = <HTMLInputElement> document.getElementById('manual_slabId');
    let slab_id = slab.value;
    if(slab_id == ''){
      this.notifyService.showWarning('⚠ All inputs are required','Notification');
    }
    this.service.manual_slabID(slab_id).subscribe((data :any)=>{
      console.log('manual_slabID',data);
  this.notifyService.showInfo('Slab ID '+data['slab_number'] + ' sent successfully','Notigication');
    },(error: any)=>{
      this.notifyService.showError('Please check your Server', 'Server Connection Error');
    });
  }

  changeView(index: any){
    // if(index == 2){
    //   this.service.get_report_page_dashboard_data().subscribe((data: any)=>{
    //     console.log('get_report_page_dashboard_data',data); 
    //   },(error: any)=>{
    //     this.notifyService.showError('Please check your Server', 'Server Connection Error');
    //   });
    // }
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

  // addPLC(){
  //   let host = <HTMLInputElement> document.getElementById('host');
  //   let host_value = host.value;
  //   let user = <HTMLInputElement> document.getElementById('userID');
  //   let user_id = user.value;
  //   let pass = <HTMLInputElement> document.getElementById('password');
  //   let password = pass.value;
  //   let plc = <HTMLInputElement> document.getElementById('plc');
  //   let port = plc.value;

  //   if(host_value == '' || user_id == '' || password == '' || port == ''){
  //     this.notifyService.showWarning('All input fields are required ⚠','Notification');
  //     return;
  //   }

  //   let plc_data = {
  //     'ip': host_value,
  //     'userId': user_id,
  //     'password': password,
  //     'port': port
  //   };
  //   this.service.add_PLC(plc_data).subscribe((data: any)=>{
  //     if(data['status']){
  //       this.notifyService.showSuccess('PLC added successfully','Notification');
  //       host.value = '';
  //       user.value = '';
  //       pass.value = '';
  //     }
  //     else{
  //       this.notifyService.showWarning('Wrong Credentials ⚠','Credentials not matched');
  //     }
  //   },
  //   (error: any)=>{
  //     this.notifyService.showError('Please check your Server', 'Server Connection Error');
  //   });
  // }

  searchDateTimeToggle(){
    // console.log('searchDateTimeToggle called.......');
    this.search_date_time_flag = true;
    setTimeout(() => this.initializingDatePicker(), 0);
  }

  initializingDatePicker() {
    const startDateElement = document.getElementById('start-date') as HTMLInputElement;
    const endDateElement = document.getElementById('end-date') as HTMLInputElement;
    if (startDateElement && endDateElement) {
      this.picker = new Litepicker({
        element: startDateElement,
        elementEnd: endDateElement,
        singleMode: false,
        allowRepick: true,
        dropdowns: { "minYear": 2022, "maxYear": null, "months": true, "years": true }
      });
    } 
    else{
      // console.log('Litepicker not initialised........');
    }
  }

  searchDateTime(){
    let tempStartDate = document.getElementById("start-date") as HTMLInputElement;
    let tempEndDate = document.getElementById("end-date") as HTMLInputElement;
    let tempStartTime = document.getElementById("start-time") as HTMLInputElement;
    let tempEndTime = document.getElementById("end-time") as HTMLInputElement;
    this.startDate = tempStartDate.value;
    this.endDate = tempEndDate.value;
    this.startTime = tempStartTime.value;
    this.endTime = tempEndTime.value;
    if (this.startDate == "" && this.endDate == "") {
      this.notifyService.showWarning("Select Date First !", "Notification");
      return;
    }
    let stDate = this.startDate +" "+ this.startTime;
    let edDate = this.endDate +" "+ this.endTime;
    this.service.searchDateTime(stDate, edDate).subscribe((data: any)=>{
      if(data['status']){
        this.report_page_table_data = data['report_data'];
        this.curr_view = this.view_list[3];
        this.curr_body = this.view_list[3];
      }
    },(error: any)=>{
      this.notifyService.showError('Please check your Server', 'Server Connection Error');
    });
    this.curr_view = this.view_list[3];
    this.curr_body = this.view_list[3];
  }

  backToReport(){
    this.curr_view = this.view_list[2];
    this.curr_body = this.view_list[2];
    setTimeout(() => this.initializingDatePicker(), 0);
  }

  createExcel(){

  }

  logout(){
    // sessionStorage.removeItem('isUserLoggedIn');
    // sessionStorage.removeItem('access_token');
    // sessionStorage.removeItem('userType');
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}


let report_page_table_data = [
  {
    'date_time': '27-02-2024 17:00',
    'Job_id': 12345,
    'actual_slab': 'AC56789LNB',
    'detected_slab': 'AC56789LNB',
    'mode': 'Auto'
  }
]