import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <div class="container">
      <button type="button" class="btn btn-primary" (click)="auth.login()">{{'common.login' | translate}}</button>
    </div>`
})
export class LoginComponent implements OnInit {

  constructor(public auth: AuthService, private router: Router) {
  }

  ngOnInit() {
    console.log('test auth');
    if (this.auth.isAuthenticated()) {
      console.log('redirect to root');
      this.router.navigate(['/']);
    }
  }
}

