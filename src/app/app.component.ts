import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DATE_FORMAT, LANGUAGE } from './constants';
import { UserSettingsService } from './services/user-settings.service';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  year = (new Date()).getFullYear();

  constructor(private translate: TranslateService, private userSettings: UserSettingsService,
              public auth: AuthService, private router: Router) {
    translate.setDefaultLang('en');
    translate.use('en');

    const language = localStorage.getItem(LANGUAGE);
    if (language) {
      translate.use(language);
    }

    const dateFormat = localStorage.getItem(DATE_FORMAT);
    if (dateFormat) {
      this.userSettings.dateFormat = dateFormat;
    }
  }

  ngOnInit() {
    this.auth.isAuthenticated$
      .subscribe((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          this.router.navigate(['/login']);
        }
      });
  }

  logout() {
    this.auth.logout();
    location.reload();
  }
}
