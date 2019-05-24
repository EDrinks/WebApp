import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
})
export class StartComponent implements OnInit {
  constructor(private router: Router, public auth: AuthService) {
  }

  ngOnInit(): void {
    console.log('start component');
  }
}
