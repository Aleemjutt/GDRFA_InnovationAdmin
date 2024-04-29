import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { EstablishingDubaiForTheFutureModel } from 'src/app/_models/FutureFocused/futureFocused';
import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FutureFocusedService {
  baseUrl = environment.apiUrl;

  responseReuslt = new ResponseResult();
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  getList() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'futureFocused/futureFocused/list',
      //this.getHttpOptions()
      this.globalService.getHttpOptions()
    );
  }

  add(
    dubaiResidencyCentenaryModel: EstablishingDubaiForTheFutureModel | undefined
  ) {
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'futureFocused/futureFocused/add',
      dubaiResidencyCentenaryModel,
      this.globalService.getHttpOptions()
    );
  }

  update(
    dubaiResidencyCentenaryModel: EstablishingDubaiForTheFutureModel | undefined
  ) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'futureFocused/futureFocused/update',
      dubaiResidencyCentenaryModel,
      this.globalService.getHttpOptions()
    );
  }

  getDetails(id: number | undefined) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'futureFocused/futureFocused/getDetails?id=' + id,

      this.globalService.getHttpOptions()
    );
  }

  delete(id: number | undefined) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'futureFocused/futureFocused/delete' + id,

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
}
