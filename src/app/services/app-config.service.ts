import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class AppConfigService {
  backendUrl = '';

  constructor(private http: HttpClient) {

  }

  load(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(document.baseURI + `assets/${environment.configFile}`)
        .subscribe((config) => {
          this.backendUrl = config['backendUrl'];
          resolve();
        }, (error) => {
          reject();
        });
    });
  }
}
