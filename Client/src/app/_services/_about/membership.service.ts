import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { MembershipsModel } from 'src/app/_models/About/membership';

import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class MembershipService {
  baseUrl = environment.apiUrl;
  membership: MembershipsModel | undefined = undefined;
  responseReuslt = new ResponseResult();
  //membership = new MembershipsModel;
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  addMembership(membership: MembershipsModel | undefined) {
    console.log(membership, 'member on service');
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'membership/add/',
      membership,
      //this.getHttpOptions()
      this.globalService.getHttpOptions()
    );
  }

  updateMembership(membership: MembershipsModel) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'membership/update/',
      membership,
      this.globalService.getHttpOptions()
    );
  }

  getMembershipDetails(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'membership/details?id=' + id,
      // this.getHttpOptions()
      this.globalService.getHttpOptions()
    );
  }

  deleteMembership(id: number) {
    return this.httpClient.delete<ResponseResult>(
      this.baseUrl + 'membership/delete?id=' + id,
      //this.getHttpOptions()
      this.globalService.getHttpOptions()
    );
  }

  getMembershipList() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'membership/list',
      // this.getHttpOptions()
      this.globalService.getHttpOptions()
    );
  }

  // getHttpOptions() {
  //   const userString = localStorage.getItem('logedInUser');
  //   if (!userString) return;
  //   const user = JSON.parse(userString);
  //   //console.log('barener token user', user);
  //   //console.log('barener token user out', user.value.access_token);
  //   return {
  //     headers: new HttpHeaders({
  //       Authorization: 'Bearer ' + user.value.access_token,
  //       'Accept-Language': this.globalService.getCurrentLanguage(),
  //     }),
  //   };
  // }

  getUserId() {
    const userString = localStorage.getItem('logedInUser');
    if (!userString) return;
    const user = JSON.parse(userString);
    return user.userId;
  }
}
