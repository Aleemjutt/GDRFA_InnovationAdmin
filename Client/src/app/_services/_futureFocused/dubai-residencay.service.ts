import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { DubaiResidencyCentenaryModel } from 'src/app/_models/FutureFocused/dubaiResidancy';
import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class DubaiResidencayService {
  baseUrl = environment.apiUrl;

  responseReuslt = new ResponseResult();
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  getList() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'dubaiResidency/list',
      //this.getHttpOptions()
      this.globalService.getHttpOptions()
    );
  }

  add(dubaiResidencyCentenaryModel: DubaiResidencyCentenaryModel | undefined) {
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'dubaiResidency/add',
      dubaiResidencyCentenaryModel,
      this.globalService.getHttpOptions()
    );
  }

  update(
    dubaiResidencyCentenaryModel: DubaiResidencyCentenaryModel | undefined
  ) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'dubaiResidency/update',
      dubaiResidencyCentenaryModel,
      this.globalService.getHttpOptions()
    );
  }

  getDetails(id: number | undefined) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'dubaiResidency/getDetails' + id,

      this.globalService.getHttpOptions()
    );
  }

  delete(id: number | undefined) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'dubaiResidency/delete' + id,

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
