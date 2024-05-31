import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';

import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IdeaPioneerModel } from 'src/app/_models/Ideas/ideaPionnerModel';
@Injectable({
  providedIn: 'root',
})
export class InnovationBreifService {
  baseUrl = environment.apiUrl;
  responseReuslt = new ResponseResult();
  //Agenda = new IdeaPioneerModel;
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  _add(model: any | undefined) {
    console.log(model, 'reseach and Studies');
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'knowledge/innovationInBrief/add',
      model,
      this.globalService.getHttpOptions()
    );
  }

  _update(model: any) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'knowledge/innovationInBrief/update',
      model,
      this.globalService.getHttpOptions()
    );
  }

  _details(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'knowledge/innovationInBrief/details?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  _delete(id: number) {
    return this.httpClient.delete<ResponseResult>(
      this.baseUrl + 'knowledge/innovationInBrief/delete?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  _list() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'knowledge/innovationInBrief/listAsync',
      this.globalService.getHttpOptions()
    );
  }
}
