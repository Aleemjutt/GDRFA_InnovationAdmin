import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { InnovationConsultingRequestModel } from 'src/app/_models/ConsultingRequest/consultingRequestModel';
import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ConsultingRequestService {
  baseUrl = environment.apiUrl;
  innovationConsultingRequestModel:
    | InnovationConsultingRequestModel
    | undefined = undefined;
  responseReuslt = new ResponseResult();
  //Agenda = new AgendaModel;
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  getConsultingRequestList() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'innovationConsulting/list',
      this.globalService.getHttpOptions()
    );
  }

  updateConsultingRequest(
    innovationConsultingRequestModel: InnovationConsultingRequestModel | null
  ) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'innovationConsulting/update/',
      innovationConsultingRequestModel,
      this.globalService.getHttpOptions()
    );
  }

  getConsultingRequestDetails(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'innovationConsulting/details?id=' + id,
      this.globalService.getHttpOptions()
    );
  }
}
