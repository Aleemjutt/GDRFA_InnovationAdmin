import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class applicationStateCheckInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    //this.busyService.busy();
    //console.log("we are checking the session time don't wrroy.");
    // console.log('expireation time', this.getItemWithExpiration());
    if (this.getItemWithExpiration() == null) {
      this.router.navigateByUrl('/login');
    }
    return next.handle(request).pipe(
      //delay(1000),
      finalize(() => {
        //this.busyService.idle();
      })
    );
  }

  getItemWithExpiration() {
    const itemString = localStorage.getItem('user');

    if (!itemString) {
      return null;
    }

    const item = JSON.parse(itemString);
    const currentTime = new Date().getTime();

    // console.log('current time', currentTime);
    //console.log('current expir', item.expiration);
    // Check if the item is expired

    //console.log(item.expiration, 'Expiration Time here before');
    //console.log(currentTime, 'Current Time');
    if (item.expiration && currentTime > item.expiration) {
      //console.log(item.expiration, 'Token has exipre');
      // Remove the expired item
      // console.log('user removed');
      localStorage.removeItem('user');
      return null;
    }

    return item.value;
  }
}
