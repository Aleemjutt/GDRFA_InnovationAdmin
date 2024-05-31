import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CreativeSupportService {
  baseUrl = environment.apiUrl;

  responseReuslt = new ResponseResult();
  //Agenda = new AgendaModel;
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  add(model: any) {
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'creativeSupport/add',
      model,
      this.globalService.getHttpOptions()
    );
  }

  update(model: any | null) {
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'creativeSupport/add',
      model,
      this.globalService.getHttpOptions()
    );
  }

  _getDetails() {
    console.log('i am at network side');
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'creativeSupport/details',
      this.globalService.getHttpOptions()
    );
  }
}
