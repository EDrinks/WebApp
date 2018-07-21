import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from './model/Product';
import { Router } from '@angular/router';

@Injectable()
export class BackendService {
  private baseUrl = '';

  constructor(config: AppConfigService, private http: HttpClient, private router: Router) {
    this.baseUrl = config.backendUrl;
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl + '/api/Products')
      .pipe(catchError((error) => {
        return this.handleError(error);
      }));
  }

  createProduct(product: Product): Observable<any> {
    return this.http.post(this.baseUrl + '/api/Products', product)
      .pipe(catchError((error) => {
        return this.handleError(error);
      }));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      if (error.status === 400) {
        return throwError(error.error);
      } else if (error.status === 404) {
        this.router.navigate(['not-found-error'], {skipLocationChange: true});
      } else if (error.status in [0, 500]) {
        this.router.navigate(['server-error'], {skipLocationChange: true});
      }
    }

    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
