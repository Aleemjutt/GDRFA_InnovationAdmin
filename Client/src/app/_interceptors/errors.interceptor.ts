import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { NavigationExtras, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { state } from '@angular/animations';

@Injectable()
export class ErrorsInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toster: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error) {
          switch (error.status) {
            case 400:
              if (error.error.errors) {
                const modelStateErros = [];
                for (const key in error.error.errors) {
                  if (error.error.erros[key]) {
                    modelStateErros.push(error.error.errors[key]);
                  }
                }
                throw modelStateErros;
              } else {
                this.toster.error(error.error.error.status);
              }
              break;
            case 401:
              this.toster.error('Unauthorized', error.status.toString());
              break;
            case 404:
              //this.router.navigateByUrl('/notfound');
              this.toster.error('something went wrong');
              break;
            case 500:
              const navitationExtrs: NavigationExtras = {
              
                state: { error: error.error },
              };
              this.toster.error('Something went wrong');
              console.log(error);
              break;
            default:
              this.toster.error('Somththing unexpected went wrong');
              console.log(error);

              break;
          }
        }
        throw error;
      })
    );
  }
}
