import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { ArchivesModel } from 'src/app/_models/About/archivesModel';
import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ArchivesService {
  baseUrl = environment.apiUrl;
  credit: ArchivesModel | undefined = undefined;
  responseReuslt = new ResponseResult();
  //credit = new ArchivesModel;
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  addArchives(credit: ArchivesModel | undefined) {
    console.log(credit, 'member on service');
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'Archives/add/',
      credit,
      this.globalService.getHttpOptions()
    );
  }

  updateArchives(credit: ArchivesModel) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'Archives/update/',
      credit,
      this.globalService.getHttpOptions()
    );
  }

  getArchivesDetails(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'Archives/details?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  deleteArchives(id: number) {
    return this.httpClient.delete<ResponseResult>(
      this.baseUrl + 'Archives/delete?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  getArchivesList() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'Archives/list',
      this.globalService.getHttpOptions()
    );
  }

  getHttpOptions() {
    const userString = localStorage.getItem('logedInUser');
    if (!userString) return;
    const user = JSON.parse(userString);
    //console.log('barener token user', user);
    //console.log('barener token user out', user.value.access_token);
    return {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + user.access_token,
        'Accept-Language': this.globalService.getCurrentLanguage(),
      }),
    };
  }

  getUserId() {
    const userString = localStorage.getItem('logedInUser');
    if (!userString) return;
    const user = JSON.parse(userString);
    return user.userId;
  }
}
