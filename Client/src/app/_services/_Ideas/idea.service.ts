import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { IdeasSubmitModel } from 'src/app/_models/Ideas/ideaSubmitModel';
import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class IdeaService {
  baseUrl = environment.apiUrl;
  ideasSubmitModel: IdeasSubmitModel | undefined = undefined;
  responseReuslt = new ResponseResult();
  //Agenda = new AgendaModel;
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  getIdeaList() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'idea/list',
      this.globalService.getHttpOptions()
    );
  }

  updateIdea(ideasSubmitModel: IdeasSubmitModel | null) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'idea/update/',
      ideasSubmitModel,
      this.globalService.getHttpOptions()
    );
  }

  getIdeaDetails(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'idea/details?id=' + id,
      this.globalService.getHttpOptions()
    );
  }
}
