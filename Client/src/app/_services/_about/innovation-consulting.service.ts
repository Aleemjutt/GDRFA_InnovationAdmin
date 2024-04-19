import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { InnovationConsultingModel } from 'src/app/_models/About/innovatoinConsulting';
import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { InnovationConsultingRequestModel } from 'src/app/_models/ConsultingRequest/consultingRequestModel';
@Injectable({
  providedIn: 'root',
})
export class InnovationConsultingService {
  baseUrl = environment.apiUrl;

  innovationConsultingRequestModel: InnovationConsultingModel | null = null;
  responseReuslt = new ResponseResult();
  //innovationConsultingModel = new InnovationConsultingModel;
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  addinnovationConsultingModel(
    innovationConsultingModel: InnovationConsultingModel | null
  ) {
    console.log(innovationConsultingModel, 'member on service');
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'innovationConsulting/innovationConsulting/add/',
      innovationConsultingModel,
      this.globalService.getHttpOptions()
    );
  }

  updateinnovationConsultingModel(
    innovationConsultingModel: InnovationConsultingModel | null
  ) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'innovationConsulting/innovationConsulting/update/',
      innovationConsultingModel,
      this.globalService.getHttpOptions()
    );
  }

  getinnovationConsultingModelDetails() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'innovationConsulting/innovationConsulting/details',
      this.globalService.getHttpOptions()
    );
  }






  addinnovationConsulting(
    innovationConsultingModel: InnovationConsultingModel | null
  ) {
    console.log(innovationConsultingModel, 'member on service');
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'innovationConsulting/addInnovationConsulting/',
      innovationConsultingModel,
      this.globalService.getHttpOptions()
    );
  }

  updateinnovationConsulting(
    innovationConsultingModel: InnovationConsultingModel | null
  ) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'innovationConsulting/updateInnovationConsulting/',
      innovationConsultingModel,
      this.globalService.getHttpOptions()
    );
  }

  getinnovationConsultingDetails() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'innovationConsulting/detailInnovationConsulting',
      this.globalService.getHttpOptions()
    );
  }


  // deleteinnovationConsultingModel(id: number) {
  //   return this.httpClient.delete<ResponseResult>(
  //     this.baseUrl + 'innovationConsulting/delete?id=' + id,
  //     this.globalService.getHttpOptions()
  //   );
  // }

  // getinnovationConsultingModelList() {
  //   return this.httpClient.get<ResponseResult>(
  //     this.baseUrl + 'innovationConsultingModels/list',
  //     this.globalService.getHttpOptions()
  //   );
  // }

  getUserId() {
    const userString = localStorage.getItem('logedInUser');
    if (!userString) return;
    const user = JSON.parse(userString);
    return user.userId;
  }
}
