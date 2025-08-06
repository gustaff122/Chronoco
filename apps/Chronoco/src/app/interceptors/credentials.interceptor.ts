import { HttpEvent, HttpRequest } from '@angular/common/module.d-yNBsZ8gb';
import { Observable } from 'rxjs';
import { HttpHandlerFn } from '@angular/common/http';

export function credentialsInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const newReq = req.clone({
    withCredentials: true,
  });

  return next(newReq);
}