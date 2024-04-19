import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { TargetCompainModel } from 'src/app/_models/Ideas/ideaTargetModel';
import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class TargetCompainService {
  baseUrl = environment.apiUrl;
  targetCompainModel: TargetCompainModel | undefined = undefined;
  responseReuslt = new ResponseResult();
  //Agenda = new TargetCompainModel;
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  _add(ideaPionnerModel: TargetCompainModel | undefined) {
    console.log(ideaPionnerModel, 'TargetCompain on service');
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'idea/TargetCompain/add',
      ideaPionnerModel,
      this.globalService.getHttpOptions()
    );
  }

  _update(ideaPionnerModel: TargetCompainModel) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'idea/TargetCompain/update',
      ideaPionnerModel,
      this.globalService.getHttpOptions()
    );
  }

  _getDetails(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'idea/TargetCompain/details?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  _delete(id: number) {
    return this.httpClient.delete<ResponseResult>(
      this.baseUrl + 'idea/TargetCompain/delete?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  _getList() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'idea/TargetCompain/list',
      this.globalService.getHttpOptions()
    );
  }
}
