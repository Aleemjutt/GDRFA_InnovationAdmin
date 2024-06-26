import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class InnovativeEntrepreneurshipProgramService {
  baseUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  getList() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'innovationPossiblities/list',
      this.globalService.getHttpOptions()
    );
  }
  details(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'innovationPossiblities/details?id=' + id,
      this.globalService.getHttpOptions()
    );
  }
  update(model: any) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'innovationPossiblities/update',
      model,
      this.globalService.getHttpOptions()
    );
  }
}
