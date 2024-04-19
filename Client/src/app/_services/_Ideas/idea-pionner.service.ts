import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';

import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IdeaPioneerModel } from 'src/app/_models/Ideas/ideaPionnerModel';
@Injectable({
  providedIn: 'root',
})
export class IdeaPionnerService {
  baseUrl = environment.apiUrl;
  ideaPionnerModel: IdeaPioneerModel | undefined = undefined;
  responseReuslt = new ResponseResult();
  //Agenda = new IdeaPioneerModel;
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  addPionner(ideaPionnerModel: IdeaPioneerModel | undefined) {
    console.log(ideaPionnerModel, 'Pionner on service');
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'idea/IdeaPionner/add',
      ideaPionnerModel,
      this.globalService.getHttpOptions()
    );
  }

  updatePionner(ideaPionnerModel: IdeaPioneerModel) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'idea/IdeaPionner/update',
      ideaPionnerModel,
      this.globalService.getHttpOptions()
    );
  }

  getPionnerDetails(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'idea/IdeaPionner/details?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  deletePionner(id: number) {
    return this.httpClient.delete<ResponseResult>(
      this.baseUrl + 'idea/IdeaPionner/delete?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  getPionnerList() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'idea/IdeaPionner/list',
      this.globalService.getHttpOptions()
    );
  }

  addPionnerPoints(ideaPionnerPointsListModel: any[]) {
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'idea/IdeaPionners/addPoints/',
      ideaPionnerPointsListModel,
      this.globalService.getHttpOptions()
    );
  }

  getPionnerPointsList() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'idea/IdeaPionner/pointsList',
      this.globalService.getHttpOptions()
    );
  }
}
