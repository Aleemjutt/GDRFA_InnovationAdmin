import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class IntellectualPropertyIndexService {
  baseUrl = environment.apiUrl;

  responseReuslt = new ResponseResult();

  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  _details() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'IntellectualProperty/OverView/details',
      this.globalService.getHttpOptions()
    );
  }

  _add(model: any) {
    {
      return this.httpClient.post<ResponseResult>(
        this.baseUrl + 'IntellectualProperty/OverView/add',
        model,
        this.globalService.getHttpOptions()
      );
    }
  }

  _addType(model: any) {
    {
      return this.httpClient.post<ResponseResult>(
        this.baseUrl + 'IntellectualProperty/type/add',
        model,
        this.globalService.getHttpOptions()
      );
    }
  }

  _updateType(model: any) {
    {
      return this.httpClient.put<ResponseResult>(
        this.baseUrl + 'IntellectualProperty/type/update',
        model,
        this.globalService.getHttpOptions()
      );
    }
  }

  _listType() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'IntellectualProperty/type/listAsync',
      this.globalService.getHttpOptions()
    );
  }

  _detailsType(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'IntellectualProperty/type/details?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  _deleteType(id: number) {
    return this.httpClient.delete<ResponseResult>(
      this.baseUrl + 'IntellectualProperty/type/delete?id=' + id,
      this.globalService.getHttpOptions()
    );
  }
}
