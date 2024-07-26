import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalServiceService } from '../_global/-global-service.service';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DashBoardService {
  baseUrl = environment.apiUrl;
  constructor(
    private globalService: GlobalServiceService,
    private httpClient: HttpClient
  ) {}

  getDashboardCount() {
    return this.httpClient.get<any>(
      this.baseUrl + 'DashBoard/GetDashBoardCountAsync',
      this.getHttpOptions()
    );
  }

  getHttpOptions() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    //console.log('barener token user', user);
    //console.log('barener token user out', user.value.access_token);
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.value.access_token,
        'Accept-Language': this.globalService.getCurrentLanguage(),
      }),
    };
  }

  getDepartmentId() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    return user.userId;
  }
}
