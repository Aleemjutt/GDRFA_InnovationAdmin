import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { PartnerModel } from 'src/app/_models/About/partnerModel';
import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PartnersService {
  baseUrl = environment.apiUrl;
  Partner: PartnerModel | undefined = undefined;
  responseReuslt = new ResponseResult();
  //Partner = new PartnerModel;
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  addPartner(Partner: PartnerModel | undefined) {
    console.log(Partner, 'member on service');
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'Partner/add/',
      Partner,
      this.globalService.getHttpOptions()
    );
  }

  updatePartner(Partner: PartnerModel) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'Partner/update/',
      Partner,
      this.globalService.getHttpOptions()
    );
  }

  getPartnerDetails(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'Partner/details?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  deletePartner(id: number) {
    return this.httpClient.delete<ResponseResult>(
      this.baseUrl + 'Partner/delete?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  getPartnerList() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'Partner/list',
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
