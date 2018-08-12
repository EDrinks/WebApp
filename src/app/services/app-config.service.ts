import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class AppConfigService {
  backendUrl = '';
  auth: any = {};

  constructor(private http: HttpClient) {

  }

  load(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.http.get(document.baseURI + `assets/${environment.configFile}`)
        .subscribe((config) => {
          this.backendUrl = config['backendUrl'];
          this.auth = config['auth'];
          resolve();
        }, () => {
          reject();
        });
    });
  }
}
