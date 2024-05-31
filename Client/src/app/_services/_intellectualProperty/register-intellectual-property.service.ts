import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class RegisterIntellectualPropertyService {
  baseUrl = environment.apiUrl;

  responseReuslt = new ResponseResult();

  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  _details(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'IntellectualProperty/registerProperty/details?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  _add(model: any) {
    {
      return this.httpClient.post<ResponseResult>(
        this.baseUrl + 'IntellectualProperty/registerProperty/add',
        model,
        this.globalService.getHttpOptions()
      );
    }
  }

  _update(model: any) {
    {
      return this.httpClient.put<ResponseResult>(
        this.baseUrl + 'IntellectualProperty/registerProperty/update',
        model,
        this.globalService.getHttpOptions()
      );
    }
  }

  _list() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'IntellectualProperty/registerProperty/listAsync',
      this.globalService.getHttpOptions()
    );
  }

  _delete(id: number) {
    {
      return this.httpClient.delete<ResponseResult>(
        this.baseUrl + 'IntellectualProperty/registerProperty/update?id=' + id,

        this.globalService.getHttpOptions()
      );
    }
  }
}
