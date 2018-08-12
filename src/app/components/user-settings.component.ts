import { Component, OnInit } from '@angular/core';
import { DATE_FORMAT, LANGUAGE } from '../constants';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html'
})
export class UserSettingsComponent implements OnInit {
  language = {key: '', dateFormat: ''};
  languages = [
    {
      key: 'en',
      label: 'English',
      dateFormat: 'short'
    },
    {
      key: 'de',
      label: 'Deutsch',
      dateFormat: 'd.M.yy H:mm'
    }
  ];

  ngOnInit() {
    let storedLanguage = localStorage.getItem(LANGUAGE);
    if (!storedLanguage) {
      storedLanguage = 'en';
    }

    this.language = this.languages.find((e) => {
      return e.key === storedLanguage;
    });

    if (!this.language) {
      this.language = this.languages[0];
    }
  }

  saveSettings() {
    localStorage.setItem(LANGUAGE, this.language.key);
    localStorage.setItem(DATE_FORMAT, this.language.dateFormat);

    location.reload();
  }
}
