import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { TargetCompainModel } from 'src/app/_models/Ideas/ideaTargetModel';
import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class TargetCompainAnswerService {
  baseUrl = environment.apiUrl;
  targetCompainModel: TargetCompainModel | undefined = undefined;
  responseReuslt = new ResponseResult();
  //Agenda = new TargetCompainModel;
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  _getList(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'idea/TargetCompainAnswer/list?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  getTargetAnswerDetails(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'idea/TargetCompainAnswer/details?id=' + id,
      this.globalService.getHttpOptions()
    );
  }
}
