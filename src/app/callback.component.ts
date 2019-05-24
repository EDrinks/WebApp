import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-callback',
  template: `
    <app-loading></app-loading>`
})
export class CallbackComponent implements OnInit {

  constructor(private router: Router, private auth: AuthService) {
    //this.auth.handleAuthentication();
  }

  ngOnInit() {
  }
}
