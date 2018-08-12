import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DATE_FORMAT, LANGUAGE } from './constants';
import { UserSettingsService } from './services/user-settings.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  year = (new Date()).getFullYear();

  constructor(private translate: TranslateService, private userSettings: UserSettingsService) {
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
}
