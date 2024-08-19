import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { ChallengeViewModel } from 'src/app/_models/CreativeSupport/challengeViewModel';
import { InterviewViewModel } from 'src/app/_models/CreativeSupport/interviewViewModel';
import { joinProgramViewModel } from 'src/app/_models/CreativeSupport/joinProgramViewModel';
import { WrokshopViewModel } from 'src/app/_models/CreativeSupport/wrokshopViewModel';
import { ResponseResult } from 'src/app/_models/responseResult';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class JoinProgramService {
  baseUrl = environment.apiUrl;

  responseReuslt = new ResponseResult();
  //Agenda = new AgendaModel;
  constructor(
    private httpClient: HttpClient,
    private globalService: GlobalServiceService
  ) {}

  _addProgram(model: joinProgramViewModel) {
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'joinProgram/addProgram',
      model,
      this.globalService.getHttpOptions()
    );
  }

  _updateProgram(model: joinProgramViewModel) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'joinProgram/updateProgram',
      model,
      this.globalService.getHttpOptions()
    );
  }

  _deleteProgram(id: number) {
    return this.httpClient.delete<ResponseResult>(
      this.baseUrl + 'joinProgram/deletePogram?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  _getParticipateTestList() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'creativeSupport/getParticipateTestList',
      this.globalService.getHttpOptions()
    );
  }

  add(model: any | null) {
    console.log('test', model);
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'creativeSupport/joinProgram/addParticipateTest',
      model,
      this.globalService.getHttpOptions()
    );
  }

  update(model: any | null) {
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'creativeSupport/updateParticipateTest',
      model,
      this.globalService.getHttpOptions()
    );
  }

  _getDetail(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'creativeSupport/getParticipateTestDetail?id=' + id,
      this.globalService.getHttpOptions()
    );
  }
  // WrokShop
  _addWrokshop(model: WrokshopViewModel) {
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'joinProgram/addWrokshop',
      model,
      this.globalService.getHttpOptions()
    );
  }

  _updateWrokshop(model: WrokshopViewModel) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'joinProgram/updateWrokshop',
      model,
      this.globalService.getHttpOptions()
    );
  }

  _deleteWrokshop(id: number) {
    return this.httpClient.delete<ResponseResult>(
      this.baseUrl + 'joinProgram/deleteWrokshop?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  //InterView

  _addInterView(model: InterviewViewModel) {
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'joinProgram/addInterView',
      model,
      this.globalService.getHttpOptions()
    );
  }

  _updateInterView(model: InterviewViewModel) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'joinProgram/updateInterview',
      model,
      this.globalService.getHttpOptions()
    );
  }

  _deleteInterView(id: number) {
    return this.httpClient.delete<ResponseResult>(
      this.baseUrl + 'joinProgram/deleteInterview?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  // Challenge

  _addChallenge(model: ChallengeViewModel) {
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'joinProgram/addChallenge',
      model,
      this.globalService.getHttpOptions()
    );
  }

  _updateChallenge(model: ChallengeViewModel) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'joinProgram/updateChalllenge',
      model,
      this.globalService.getHttpOptions()
    );
  }

  _deleteChallenge(id: number) {
    return this.httpClient.delete<ResponseResult>(
      this.baseUrl + 'joinProgram/deleteChallenge?id=' + id,
      this.globalService.getHttpOptions()
    );
  }
}
