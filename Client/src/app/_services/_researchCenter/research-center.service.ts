import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ResearchCenterService {
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
      this.baseUrl + 'researchCenter/add',
      model,
      this.globalService.getHttpOptions()
    );
  }

  _update(model: any) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'researchCenter/update',
      model,
      this.globalService.getHttpOptions()
    );
  }

  _details() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'researchCenter/details',
      this.globalService.getHttpOptions()
    );
  }
}
