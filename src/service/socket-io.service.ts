import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketIOService {
  private socket: any;
  constructor() { }

  connect(): void {
    this.socket = io('http://192.168.68.124:5001');
    console.log('connect called');
  }

  sendMessage(message: string): void {
    this.socket.emit('new-message', message);
    console.log('sendMessage called');
  }

  getMessages(): Observable<{ user: string, message: string }> {
    console.log('getMessages called');
    return new Observable<{ user: string, message: string }>(observer => {
      const subscription = this.socket.on('new-message', (data: { user: string, message: string }) => {
        observer.next(data);
      });
  
      // Cleanup logic when unsubscribing
      console.log('getMessages called last');
      return () => {
        subscription.unsubscribe(); // Unsubscribe from the socket event listener
      };
    });
  }
}
