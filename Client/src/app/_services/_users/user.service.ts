import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { ResponseResult } from 'src/app/_models/responseResult';
import { UserModel } from 'src/app/_models/user';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  getList() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'account/list',
      this.globalService.getHttpOptions()
    );
  }

  addUser(userModel: UserModel | null) {
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'account/addUser',
      userModel,

      this.globalService.getHttpOptions()
    );
  }

  getUserDetails(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'account/details?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  deleteUser(id: number) {
    return this.httpClient.delete<ResponseResult>(
      this.baseUrl + 'account/deleteUser?id=' + id,
      this.globalService.getHttpOptions()
    );
  }
}
