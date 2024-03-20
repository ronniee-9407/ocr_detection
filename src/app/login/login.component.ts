import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BackendService } from 'src/service/backend.service';
import { NotificationService } from 'src/service/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user_type = ['super_user', 'dashboard'];
  curr_user = this.user_type[0];
  view_password: boolean = false;

  constructor(
    private service: BackendService, 
    private sanitizer: DomSanitizer, 
    private router: Router, 
    private notifyService: NotificationService, 
  ){}

  ngOnInit(): void {
    
  }

  change_user(index: any){
    this.curr_user = this.user_type[index];
    let id = <HTMLInputElement> document.getElementById('userID');
    id.value = '';
    let pass = <HTMLInputElement> document.getElementById('password');
    pass.value = '';
    this.view_password = false;
  }

  login(){
    let id = <HTMLInputElement> document.getElementById('userID');
    let userId = id.value;
    let pass = <HTMLInputElement> document.getElementById('password');
    let password = pass.value;

    let login_data = {
      'userId': userId,
      'password': password,
      'userType': 'User'
    };
    if(userId === '' || password === ''){
      this.notifyService.showWarning('Please enter UserID and Password','Notification');
      return;
    }
    // let login_flag = this.service.login(login_data);
    // if(login_flag){
    //   sessionStorage.setItem('isUserLoggedIn', 'true');
    //   this.router.navigate(['/dashboard']);
    // }else{
    //   this.notifyService.showError('Invalid Login Credentials','Error !')
    // }
    console.log('sending login data', login_data);
    this.service.login(login_data).subscribe((data: any)=>{
      console.log('login data',data);
      if(data['status']){
        let access_token = data['access_token'];
        sessionStorage.setItem('access_token', access_token);
        sessionStorage.setItem('isUserLoggedIn', 'true');
        sessionStorage.setItem('userType', this.curr_user);
        this.router.navigate([this.curr_user])
      }
      else{
        this.notifyService.showError('Invalid Login Credentials','Error !');
        return;
      }
    },(error: any) => {
      this.notifyService.showError('Please check your Server', 'Server Connection Error');
    });
    sessionStorage.setItem('isUserLoggedIn', 'true');
    sessionStorage.setItem('userType', this.curr_user);
    this.router.navigate([this.curr_user])
  }

  show_password(){
    let pass = <HTMLInputElement> document.getElementById('password');
    let password = pass.value;
    this.view_password = true;
    pass.type = 'text';
  }

  close_password(){
    let pass = <HTMLInputElement> document.getElementById('password');
    let password = pass.value;
    this.view_password = false;
    pass.type = 'password';
  }
}
