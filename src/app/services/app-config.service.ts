import { Injectable } from '@angular/core';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class AppConfigService {
  backendUrl = '';
  auth: any = {};
  private http: HttpClient;

  constructor(private handler: HttpBackend) {
    this.http = new HttpClient(handler);
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
