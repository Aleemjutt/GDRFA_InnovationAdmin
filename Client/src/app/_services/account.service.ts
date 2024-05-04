import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { map } from 'rxjs/internal/operators/map';
import { Observable, Subject, catchError, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginResponse } from '../_models/loginResponse';
import { ResponseResult } from '../_models/responseResult';
import { ToastrService } from 'ngx-toastr';
import { StorageItem } from '../_models/localStorageItem';
import { GlobalServiceService } from '../_global/-global-service.service';
import { SmartAPIViewModel } from '../_models/smartPermissionModel';
import { Route, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  // baseUrl = 'https://localhost:5051/api/';
  //apiUrl = 'https://mtest.dnrd.ae:8443/GDRFAAPI/key';
  baseUrl = environment.apiUrl; ///configJson.configurl.apiServer.url; //
  responseReuslt = new ResponseResult();
  loginResponse = new LoginResponse();
  storageItem = new StorageItem();
  smartPermossionList: SmartAPIViewModel[] = [];
  smartPermssionUser: any;
  private smartPermissionUserSubject = new Subject<any>();
  private currentUserSource = new BehaviorSubject<LoginResponse | null>(null);
  currentUser$ = this.currentUserSource.asObservable();
  constructor(
    private http: HttpClient,
    private tosterService: ToastrService,
    private globalService: GlobalServiceService,
    private rounter: Router
  ) {}

  login(model: any) {
    const httpHeaders = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    };
    // const userName: string = model.userName;
    // const password: string = model.password;

    // const clientId: string = 'your_client_id';
    // const clientSecret: string = 'your_client_secret';

    // const stringContent: string = `username=${userName}&password=${password}&device_type=iOS&grant_type=password&client_id=${clientId}&client_secret=${clientSecret}&device_id=IGNORE`;

    // const httpContent: FormData = new FormData();
    // httpContent.append('Content-Type', 'application/x-www-form-urlencoded');
    // httpContent.append('Content-Length', stringContent.length.toString());
    // httpContent.append('Content', stringContent);

    return this.http
      .post<ResponseResult>(
        this.baseUrl + 'account/Externallogin',
        model,
        httpHeaders
      )
      .pipe(
        map((response: ResponseResult) => {
          //const user = response.data;
          this.loginResponse = response.data;
          if (this.loginResponse) {
            //localStorage.setItem('user', JSON.stringify(user));
            this.setItemWithExpiration(
              'user',
              60, //this.loginResponse.expires_in
              model
            );
            this.currentUserSource.next(this.loginResponse);
          } else {
            this.tosterService.error(response.message);
          }
        }),

        catchError((error) => {
          console.error('HTTP request failed:', error);
          // Handle the error as needed
          return of(null); // You can return an observable with a default value or rethrow the error
        })
      );
  }

  // register(model: any) {
  //   return this.http.post<User>(this.baseUrl + 'account/register', model).pipe(
  //     map((user) => {
  //       if (user) {
  //         localStorage.setItem('user', JSON.stringify(user));
  //         this.currentUserSource.next(user);
  //       }
  //     })
  //   );
  // }

  employeeInfo() {
    return this.http.get<any>(
      this.baseUrl +
        'account/EmployeeInfo?empId=' +
        this.globalService.getUserId(),
      this.getHttpOptions()
    );
  }
  getSmartPermission() {
    return this.http.get<any>(
      this.baseUrl + 'account/GetSmartPermissions',
      //this.globalService.getUserId(),
      this.getHttpOptions()
    );
  }

  setCurrentUser(user: LoginResponse) {
    this.currentUserSource.next(user);
  }
  setItemWithExpiration(
    key: string,
    expirationInMinutes: number,
    model: any
  ): void {
    const expirationMS = expirationInMinutes * 60 * 1000; // Convert minutes to milliseconds
    const expirationTime = new Date().getTime() + expirationMS;
    const item = (this.storageItem = {
      value: this.loginResponse,
      expiration: expirationTime,
    });

    localStorage.setItem('userCredentials', JSON.stringify(model));
    console.log('localStorage', item);
    localStorage.setItem(key, JSON.stringify(item));
  }

  // setItemWithExpiration(key: string, expirationInMinutes: number): void {
  //   const expirationMS = expirationInMinutes * 60 * 1000; // Convert minutes to milliseconds
  //   const expirationTime = new Date().getTime() + expirationMS;
  //   const item = (this.storageItem = {
  //     value: this.loginResponse,
  //     expiration: expirationTime,
  //   });
  //   localStorage.setItem(key, JSON.stringify(item));
  // }

  logout() {
    console.log('Remove Users');
    localStorage.removeItem('user');
    //localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  getHttpOptions() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.value.access_token,
        'Accept-Language': this.globalService.getCurrentLanguage(),
      }),
    };
  }

  // getSmartPermissionUser(userId: string | undefined) {
  //   this.getSmartPermission().subscribe({
  //     next: (response) => {
  //       if (response) {
  //         if (response.result != null && response.result.length > 0) {
  //           this.smartPermssionUser = response.result.slice(0, 1)[0];
  //           console.log(this.smartPermssionUser);
  //         }
  //       }
  //     },
  //   });

  //   return this.smartPermssionUser;
  // }

  getSmartPermissionUser(): Observable<any> {
    this.getSmartPermission().subscribe({
      next: (response) => {
        if (response && response.result != null && response.result.length > 0) {
          this.smartPermissionUserSubject.next(response.result.slice(0, 1)[0]);
        }
      },
      error: (error) => {
        console.error('Error fetching smart permissions:', error);
        this.smartPermissionUserSubject.error(error);
      },
    });

    return this.smartPermissionUserSubject.asObservable();
  }
}
