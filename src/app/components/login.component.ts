import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <div class="container">
      <button type="button" class="btn btn-primary" (click)="login()">{{'common.login' | translate}}</button>
    </div>`
})
export class LoginComponent implements OnInit {
  private returnUrl = '';

  constructor(public auth: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/']);
    } else {
      this.activatedRoute.queryParams
        .subscribe((param) => {
          this.returnUrl = param['returnUrl'] ? param['returnUrl'] : '';
        });
    }
  }

  login() {
    this.auth.login(this.returnUrl);
  }
}

