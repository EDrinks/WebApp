import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LANGUAGE } from '../constants';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html'
})
export class UserSettingsComponent implements OnInit {
  language = '';

  constructor(private translate: TranslateService) {
  }

  ngOnInit() {
    this.language = localStorage.getItem(LANGUAGE);
    if (!this.language) {
      this.language = 'en';
    }
  }

  saveSettings() {
    this.translate.use(this.language);
    localStorage.setItem(LANGUAGE, this.language);
  }
}
