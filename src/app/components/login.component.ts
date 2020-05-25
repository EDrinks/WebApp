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
    this.auth.isAuthenticated$
      .subscribe((isLoggedIn: boolean) => {
        if (isLoggedIn) {
          this.router.navigate(['/']);
        }
      });
  }
}

