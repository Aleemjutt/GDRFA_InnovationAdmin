import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { AwardMainModel } from 'src/app/_models/About/awardMainModel';
import { AwardDetailModel } from 'src/app/_models/About/awardModel';
import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AwardService {
  baseUrl = environment.apiUrl;
  Award: AwardDetailModel | undefined = undefined;
  responseReuslt = new ResponseResult();
  //Award = new AwardDetailModel;
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  addAward(Award: AwardDetailModel | undefined) {
    console.log(Award, 'Award on service');
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'awards/add/',
      Award,
      this.globalService.getHttpOptions()
    );
  }

  updateAward(Award: AwardDetailModel) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'awards/update/',
      Award,
      this.globalService.getHttpOptions()
    );
  }

  getAwardDetails(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'awards/details?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  deleteAward(id: number) {
    return this.httpClient.delete<ResponseResult>(
      this.baseUrl + 'awards/delete?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  getAwardList() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'awards/list',
      this.globalService.getHttpOptions()
    );
  }

  _add_update_awardMainDescription(mainModel: AwardMainModel | undefined) {
    console.log(mainModel, 'Award Main on service');
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'awards/awardMain/Add/',
      mainModel,
      this.globalService.getHttpOptions()
    );
  }

  getAwardMainDetails() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'awards/awardMain/details',
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
