import { Observable } from 'rxjs';
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';

export function credentialsInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const newReq = req.clone({
    withCredentials: true,
  });

  return next(newReq);
}