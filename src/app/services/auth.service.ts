import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as auth0 from 'auth0-js';
import { AppConfigService } from './app-config.service';
import { of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Injectable()
export class AuthService {
  auth0: any = null;
  refreshSubscription: any;

  constructor(public router: Router, private appConfig: AppConfigService) {
    this.auth0 = new auth0.WebAuth(this.appConfig.auth);
  }

  public login(returnUrl?: string): void {
    if (returnUrl) {
      const nonce = this.genNonce();
      window.sessionStorage.setItem(nonce, returnUrl);

      this.auth0.authorize({
        state: nonce
      });
    } else {
      this.auth0.authorize();
    }
  }

  public handleAuthentication() {
    console.log('call handleAuthentication');
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this.setSession(authResult);

        const returnUrl = window.sessionStorage.getItem(authResult.state);
        window.sessionStorage.removeItem(authResult.state);
        console.log('returnUrl', returnUrl);
        if (returnUrl) {
          this.router.navigate(['/products']);
        } else {
          this.router.navigate(['/overview']);
        }
      }
    });
  }

  private setSession(authResult): void {
    // Set the time that the Access Token will expire at
    const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);

    this.scheduleRenewal();
  }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');

    this.unscheduleRenewal();
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // Access Token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at') || '{}');
    return new Date().getTime() < expiresAt;
  }

  public renewToken() {
    this.auth0.checkSession({}, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        this.setSession(result);
      }
    });
  }


  public scheduleRenewal() {
    if (!this.isAuthenticated()) {
      return;
    }
    this.unscheduleRenewal();

    const expiresAt = JSON.parse(window.localStorage.getItem('expires_at'));

    const expiresIn$ = of(expiresAt).pipe(
      mergeMap(
        expAt => {
          const now = Date.now();
          // Use timer to track delay until expiration
          // to run the refresh at the proper time
          return timer(Math.max(1, expAt - now));
        }
      )
    );

    // Once the delay time from above is
    // reached, get a new JWT and schedule
    // additional refreshes
    this.refreshSubscription = expiresIn$.subscribe(
      () => {
        this.renewToken();
        this.scheduleRenewal();
      }
    );
  }

  public unscheduleRenewal() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  // https://stackoverflow.com/a/42406778
  private genNonce() {
    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._~';
    const result = [];
    window.crypto.getRandomValues(new Uint8Array(32)).forEach(c =>
      result.push(charset[c % charset.length]));
    return result.join('');
  }
}
