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
  constructor(
    private service: BackendService, 
    private sanitizer: DomSanitizer, 
    private router: Router, 
    private notifyService: NotificationService, 
  ){}

  ngOnInit(): void {
    
  }

  login(){
    let id = <HTMLInputElement> document.getElementById('userID');
    let userId = id.value;
    let pass = <HTMLInputElement> document.getElementById('password');
    let password = pass.value;

    let login_data = {
      'userId': userId,
      'password': password
    };
    if(userId === '' || password === ''){
      this.notifyService.showWarning('Please enter UserID and Password','Notification');
      return;
    }

    this.service.login(login_data).subscribe((data: any)=>{
      if(data['status']){
        sessionStorage.setItem('isUserLoggedIn', 'true');
        this.router.navigate(['/dashboard'])
      }
    },(error: any) => {
      this.notifyService.showError('Please check your Server', 'Server Connection Error');
    });
    // sessionStorage.setItem('isUserLoggedIn', 'true');
    this.router.navigate(['/dashboard'])
  }
}
