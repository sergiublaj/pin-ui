import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Store } from '@ngxs/store';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private store: Store,
              private cookieService: CookieService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/auth/login')) {
      // intercept login request
      return next.handle(req).pipe(tap(event => {
        if (event instanceof HttpResponse) {
          // add jwt cookie
          const jwtToken = event.headers.get('jwtToken') as string;
          this.cookieService.set('jwtToken', jwtToken);
        }
        return event;
      }));
    }

    // intercept other requests
    let jwtToken = '';
    if (this.cookieService.check('jwtToken')) {
      jwtToken = this.cookieService.get('jwtToken');
    }
    const headers = new HttpHeaders({
      'jwtToken': jwtToken,
    });
    const modifiedReq = req.clone({ headers });
    return next.handle(modifiedReq);
  }
}
