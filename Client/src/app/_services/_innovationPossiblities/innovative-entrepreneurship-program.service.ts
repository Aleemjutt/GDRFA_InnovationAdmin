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
      this.baseUrl + 'idea/list',
      this.globalService.getHttpOptions()
    );
  }
}
