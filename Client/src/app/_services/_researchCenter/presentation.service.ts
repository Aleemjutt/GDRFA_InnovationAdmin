import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PresentationService {
  baseUrl = environment.apiUrl;
  responseReuslt = new ResponseResult();
  //Agenda = new IdeaPioneerModel;
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  _update(model: any) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'researchCenter/presentation/update',
      model,
      this.globalService.getHttpOptions()
    );
  }

  _details(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'researchCenter/presentation/details?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  _lists() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'researchCenter/presentation/listAsync',
      this.globalService.getHttpOptions()
    );
  }
}
