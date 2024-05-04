import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { WorkFlowStatus } from 'src/app/_models/Common/workflowStatus';
import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class EstablishedChallengedAnswerService {
  baseUrl = environment.apiUrl;
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  getEstablishedAnsweredList(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'FutureFocused/EstablishedAsnswerd/list?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  getEstablishedAnsweredDetails(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'FutureFocused/EstablishedAsnswerd/details?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  updateWorkflowStatus(workFlowStatus: WorkFlowStatus, id: number) {
    return this.httpClient.get<ResponseResult>(
      // this.baseUrl +
      //   'FutureFocused/EstablishedAsnswerd/updateWorkFlowStatus?workflowStatus=' +
      //   workFlowStatus +
      //   '&&id=' +
      //   id,

      this.baseUrl +
        'FutureFocused/EstablishedAsnswerd/updateWorkFlowStatus?workflowStatus=' +
        workFlowStatus +
        '&&id=' +
        id,

      // this.baseUrl +
      //   'FutureFocused/EstablishedAsnswerd/updateWorkFlowStatus?id=' +
      //   0,

      this.globalService.getHttpOptions()
    );
  }
}
