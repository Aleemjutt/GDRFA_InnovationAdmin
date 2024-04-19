import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { GlobalServiceService } from '../_global/-global-service.service';

@Injectable({
  providedIn: 'root',
})
export class OperationService {
  baseUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  getListOperationResultById(departmentId: number) {
    return this.httpClient.get<any>(
      this.baseUrl + 'Operations/GetRequestOperationsList/' + departmentId,
      this.globalService.getHttpOptions()
    );
  }

 

  addOperationResult(opeationResult: any) {
    return this.httpClient.post<any>(
      this.baseUrl + 'Operations/AddOperation',
      opeationResult,
      this.globalService.getHttpOptions()
    );
  }

  updateOperationResult(opeationResult: any) {
    return this.httpClient.put<any>(
      this.baseUrl + 'Operations/UpdateOperation',
      opeationResult,
      this.globalService.getHttpOptions()
    );
  }

  getUserId() {
    const userString = localStorage.getItem('user');
    if (!userString) return;
    const user = JSON.parse(userString);
    return user.userId;
  }

  deleteOperationResult(id: number) {
    return this.httpClient.delete<any>(
      this.baseUrl + 'Operations/DeleteOperation?id=' + id,
      this.globalService.getHttpOptions()
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
}
