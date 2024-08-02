import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class JoinProgramService {
  baseUrl = environment.apiUrl;

  responseReuslt = new ResponseResult();
  //Agenda = new AgendaModel;
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  _getParticipateTestList() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'creativeSupport/getParticipateTestList',
      this.globalService.getHttpOptions()
    );
  }

  add(model: any | null) {
    console.log('test', model);
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'creativeSupport/joinProgram/addParticipateTest',
      model,
      this.globalService.getHttpOptions()
    );
  }

  update(model: any | null) {
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'creativeSupport/updateParticipateTest',
      model,
      this.globalService.getHttpOptions()
    );
  }

  _getDetail(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'creativeSupport/getParticipateTestDetail?id=' + id,
      this.globalService.getHttpOptions()
    );
  }
}
