import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LANGUAGE } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  year = (new Date()).getFullYear();

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');

    const language = localStorage.getItem(LANGUAGE);
    if (language) {
      translate.use(language);
    }
  }
}
