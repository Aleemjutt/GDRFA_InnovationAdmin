import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RequestModel } from '../_models/requestModel';
import { GlobalServiceService } from '../_global/-global-service.service';

@Injectable({
  providedIn: 'root',
})
export class RequestServicesService {
  baseUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  getRequests() {
    return this.httpClient.get<any>(
      this.baseUrl + 'Request/GetRequestsList',
      this.globalService.getHttpOptions()
    );
  }

  addRequests(requestModel: any) {
    return this.httpClient.post<any>(
      this.baseUrl + 'Request/addRequest',
      requestModel,
      this.globalService.getHttpOptions()
    );
  }
  getRequestsById(id: number) {
    return this.httpClient.get<any>(
      this.baseUrl + 'Request/GetRequestById/' + id,
      this.globalService.getHttpOptions()
    );
  }

  updateRequests(requestModel: any) {
    return this.httpClient.put<any>(
      this.baseUrl + 'Request/updateRequest',
      requestModel,
      this.globalService.getHttpOptions()
    );
  }

  deleteRequests(id: number) {
    return this.httpClient.delete<any>(
      this.baseUrl + 'Request/DeleteRequest/' + id,
      this.globalService.getHttpOptions()
    );
  }

  // getHttpOptions() {
  //   const userString = localStorage.getItem('user');
  //   if (!userString) return;
  //   const user = JSON.parse(userString);
  //   return {
  //     headers: new HttpHeaders({
  //       Authorization: 'Bearer ' + user.value.access_token,
  //       'Accept-Language': this.globalService.getCurrentLanguage(),
  //     }),
  //   };
  // }

  getUserId() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    return user.userId;
  }
}
