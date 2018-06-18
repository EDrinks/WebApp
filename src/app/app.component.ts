import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LANGUAGE } from './constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');

    const language = localStorage.getItem(LANGUAGE);
    if (language) {
      translate.use(language);
    }
  }
}
