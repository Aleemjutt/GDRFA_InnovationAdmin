import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { IdeaJurneyModel } from 'src/app/_models/Ideas/ideaJurney';
import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class IdeajurneyService {
  baseUrl = environment.apiUrl;
  ideasSubmitModel: IdeaJurneyModel | undefined = undefined;
  responseReuslt = new ResponseResult();

  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  getIdeaJurneyDetails() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'idea/ideaJurney/details',
      this.globalService.getHttpOptions()
    );
  }

  _add(ideasSubmitModel: IdeaJurneyModel) {
    {
      return this.httpClient.post<ResponseResult>(
        this.baseUrl + 'idea/ideaJurney/addUpdate',
        ideasSubmitModel,
        this.globalService.getHttpOptions()
      );
    }
  }
}
