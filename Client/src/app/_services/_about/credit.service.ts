import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { CreditModel } from 'src/app/_models/About/creditModel';
import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CreditService {
  baseUrl = environment.apiUrl;
  credit: CreditModel | undefined = undefined;
  responseReuslt = new ResponseResult();
  //credit = new CreditModel;
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  addCredit(credit: CreditModel | undefined) {
    console.log(credit, 'member on service');
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'Credits/add/',
      credit,
      this.globalService.getHttpOptions()
    );
  }

  updateCredit(credit: CreditModel) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'Credits/update/',
      credit,
      this.globalService.getHttpOptions()
    );
  }

  getCreditDetails(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'Credits/details?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  deleteCredit(id: number) {
    return this.httpClient.delete<ResponseResult>(
      this.baseUrl + 'Credits/delete?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  getCreditList() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'Credits/list',
      this.globalService.getHttpOptions()
    );
  }

  getHttpOptions() {
    const userString = localStorage.getItem('logedInUser');
    if (!userString) return;
    const user = JSON.parse(userString);
    //console.log('barener token user', user);
    //console.log('barener token user out', user.value.access_token);
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.access_token,
        'Accept-Language': this.globalService.getCurrentLanguage(),
      }),
    };
  }

  getUserId() {
    const userString = localStorage.getItem('logedInUser');
    if (!userString) return;
    const user = JSON.parse(userString);
    return user.userId;
  }
}
