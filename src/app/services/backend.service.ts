import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppConfigService } from './app-config.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from './model/Product';
import { Router } from '@angular/router';
import { Tab } from './model/Tab';
import { Order } from './model/Order';
import { Settlement } from './model/Settlement';
import { DataPoint } from './model/DataPoint';
import { Spending } from './Spending';

@Injectable()
export class BackendService {
  private baseUrl = '';

  constructor(config: AppConfigService, private http: HttpClient, private router: Router) {
    this.baseUrl = config.backendUrl;
  }

  getProducts(): Observable<Product[]> {
    return this.getReq<Product[]>(this.baseUrl + '/api/Products');
  }

  getProduct(productId: string): Observable<Product> {
    return this.getReq<Product>(this.baseUrl + `/api/Products/${productId}`);
  }

  createProduct(product: Product): Observable<any> {
    return this.postReq(this.baseUrl + '/api/Products', product);
  }

  updateProduct(product: Product): Observable<any> {
    return this.putReq(this.baseUrl + `/api/Products/${product.id}`, product);
  }

  deleteProduct(productId: string) {
    return this.deleteReq(this.baseUrl + `/api/Products/${productId}`);
  }

  getTabs(): Observable<Tab[]> {
    return this.getReq<Tab[]>(this.baseUrl + '/api/Tabs');
  }

  getTab(tabId: string): Observable<Tab> {
    return this.getReq(this.baseUrl + `/api/Tabs/${tabId}`);
  }

  createTab(tab: Tab) {
    return this.postReq(this.baseUrl + '/api/Tabs', tab);
  }

  updateTab(tab: Tab) {
    return this.putReq(this.baseUrl + `/api/Tabs/${tab.id}`, tab);
  }

  deleteTab(tabId: string) {
    return this.deleteReq(this.baseUrl + `/api/Tabs/${tabId}`);
  }

  getOrders(tabId: string): Observable<Order[]> {
    return this.getReq<Order[]>(this.baseUrl + `/api/Tabs/${tabId}/Orders`);
  }

  createOrder(tabId: string, productId: string, quantity: number) {
    return this.postReq(this.baseUrl + `/api/Tabs/${tabId}/Orders`, {
      tabId,
      productId,
      quantity
    });
  }

  deleteOrder(tabId: string, orderId: string) {
    return this.deleteReq(this.baseUrl + `/api/Tabs/${tabId}/Orders/${orderId}`);
  }

  settleTabs(tabIds: string[]) {
    return this.postReq(this.baseUrl + `/api/Settlements`, tabIds);
  }

  getActiveSettlement(): Observable<Settlement> {
    return this.getReq<Settlement>(this.baseUrl + '/api/Settlements/current');
  }

  getSettlement(settlementId: string): Observable<Settlement> {
    return this.getReq<Settlement>(this.baseUrl + `/api/Settlements/${settlementId}`);
  }

  getSettlements(offset: number): Observable<Settlement[]> {
    return this.getReq<Settlement[]>(this.baseUrl + `/api/Settlements?offset=${offset}`);
  }

  getSettlementFile(settlementId: string, mimeType: string): Observable<Response> {
    const options = {
      headers: {'Accept': mimeType},
      responseType: 'blob' as 'json'
    };

    return this.http.get<Response>(`${this.baseUrl}/api/Settlements/${settlementId}`, options)
      .pipe(catchError((error) => {
        return this.handleError(error);
      }));
  }

  getTopTen(productId: string, current: boolean): Observable<DataPoint[]> {
    return this.getReq(`${this.baseUrl}/api/Statistics/TopTen?productId=${productId}&current=${current}`);
  }

  getConsumptionBetween(productId: string, start: string, end: string) {
    return this.getReq(`${this.baseUrl}/api/Statistics/ConsumptionBetween?productId=${productId}`
      + `&start=${start}&end=${end}`);
  }

  getSpending(spendingId: string): Observable<Spending> {
    return this.getReq(`${this.baseUrl}/api/Spendings/${spendingId}`);
  }

  getSpendings(): Observable<Spending[]> {
    return this.getReq(`${this.baseUrl}/api/Spendings`);
  }

  createSpending(tabId: string, productId: string, quantity: number) {
    return this.postReq(`${this.baseUrl}/api/Spendings`, {
      tabId,
      productId,
      quantity
    });
  }

  orderOnSpending(spendingId: string, quantity: number) {
    return this.postReq(`${this.baseUrl}/api/Spendings/${spendingId}/Orders`, {
      quantity
    });
  }

  private getReq<TResult>(url: string) {
    return this.http.get<TResult>(url)
      .pipe(catchError((error) => {
        return this.handleError(error);
      }));
  }

  private postReq(url: string, payload: any) {
    return this.http.post(url, payload)
      .pipe(catchError((error) => {
        return this.handleError(error);
      }));
  }

  private putReq(url: string, payload: any) {
    return this.http.put(url, payload)
      .pipe(catchError((error) => {
        return this.handleError(error);
      }));
  }

  private deleteReq(url: string) {
    return this.http.delete(url)
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
