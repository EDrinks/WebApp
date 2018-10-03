import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  template: `<div class="container">
    <button type="button" class="btn btn-primary" (click)="auth.login()">{{'common.login' | translate}}</button>
  </div>`
})
export class LoginComponent {

  constructor(public auth: AuthService) {

  }
}

