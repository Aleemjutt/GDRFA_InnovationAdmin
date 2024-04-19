import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { AgendaModel } from 'src/app/_models/About/agendaModel';
import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AgendaService {
  baseUrl = environment.apiUrl;
  Agenda: AgendaModel | undefined = undefined;
  responseReuslt = new ResponseResult();
  //Agenda = new AgendaModel;
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  addAgenda(Agenda: AgendaModel | undefined) {
    console.log(Agenda, 'Agenda on service');
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'agenda/add/',
      Agenda,
      this.globalService.getHttpOptions()
    );
  }

  updateAgenda(Agenda: AgendaModel) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'agenda/update/',
      Agenda,
      this.globalService.getHttpOptions()
    );
  }

  getAgendaDetails(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'agenda/details?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  deleteAgenda(id: number) {
    return this.httpClient.delete<ResponseResult>(
      this.baseUrl + 'agenda/delete?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  getAgendaList() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'agenda/list',
      this.globalService.getHttpOptions()
    );
  }

  // getHttpOptions() {
  //   const userString = localStorage.getItem('logedInUser');
  //   if (!userString) return;
  //   const user = JSON.parse(userString);
  //   //console.log('barener token user', user);
  //   //console.log('barener token user out', user.value.access_token);
  //   return {
  //     headers: new HttpHeaders({
  //       Authorization: 'Bearer ' + user.access_token,
  //       'Accept-Language': this.globalService.getCurrentLanguage(),
  //     }),
  //   };
  // }

  getUserId() {
    const userString = localStorage.getItem('logedInUser');
    if (!userString) return;
    const user = JSON.parse(userString);
    return user.userId;
  }
}
