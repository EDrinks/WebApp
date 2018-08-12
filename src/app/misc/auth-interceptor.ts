import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const access_token = localStorage.getItem('access_token');
    if (access_token) {
      const request = req.clone({
        setHeaders: {
          Authorization: `Bearer ${access_token}`
        }
      });

      return next.handle(request);
    }

    return next.handle(req);
  }

}
