import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { id } from '@swimlane/ngx-charts';
import { GlobalServiceService } from 'src/app/_global/-global-service.service';
import { ChallengeViewModel } from 'src/app/_models/CreativeSupport/challengeViewModel';
import { InterviewViewModel } from 'src/app/_models/CreativeSupport/interviewViewModel';
import { JoinProgramChallengeViewModel } from 'src/app/_models/CreativeSupport/joinProgramChallengeViewModel';
import { joinProgramViewModel } from 'src/app/_models/CreativeSupport/joinProgramViewModel';
import { WorkshopViewModel } from 'src/app/_models/CreativeSupport/workshopViewModel';
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

  _getProgramList() {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'joinProgram/list',
      this.globalService.getHttpOptions()
    );
  }

  _getProgramDetail(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'joinProgram/detailProgram?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

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

  _getParticipateTestList(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'creativeSupport/getParticipateTestList?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  _addTest(model: any | null) {
    console.log('test', model);
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'creativeSupport/joinProgram/addParticipateTest',
      model,
      this.globalService.getHttpOptions()
    );
  }

  _updateTest(model: any | null) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'creativeSupport/updateParticipateTest',
      model,
      this.globalService.getHttpOptions()
    );
  }

  _getTestDetail(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'creativeSupport/getParticipateTestDetail?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  _deleteTest(id: number) {
    return this.httpClient.delete<ResponseResult>(
      this.baseUrl + 'creativeSupport/deleteTest?id=' + id,
      this.globalService.getHttpOptions()
    );
  }
  // Workshop
  _addWorkshop(model: WorkshopViewModel) {
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'joinProgram/addWorkshop',
      model,
      this.globalService.getHttpOptions()
    );
  }

  _updateWorkshop(model: WorkshopViewModel) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'joinProgram/updateWorkshop',
      model,
      this.globalService.getHttpOptions()
    );
  }
  _detailWorkshop(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'joinProgram/detailWorkshop?id=' + id,
      this.globalService.getHttpOptions()
    );
  }
  _deleteWorkshop(id: number) {
    return this.httpClient.delete<ResponseResult>(
      this.baseUrl + 'joinProgram/deleteWorkshop?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  _listWorkshop(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'joinProgram/listWorkshop?id=' + id,
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
  _detailInterView(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'joinProgram/detailInterview?id=' + id,
      this.globalService.getHttpOptions()
    );
  }
  _deleteInterView(id: number) {
    return this.httpClient.delete<ResponseResult>(
      this.baseUrl + 'joinProgram/deleteInterview?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  _listInterview(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'joinProgram/listInterview?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  // Challenge

  _addChallenge(model: JoinProgramChallengeViewModel) {
    return this.httpClient.post<ResponseResult>(
      this.baseUrl + 'joinProgram/addChallenge',
      model,
      this.globalService.getHttpOptions()
    );
  }

  _updateChallenge(model: JoinProgramChallengeViewModel) {
    return this.httpClient.put<ResponseResult>(
      this.baseUrl + 'joinProgram/updateChallenge',
      model,
      this.globalService.getHttpOptions()
    );
  }

  _detailChallenge(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'joinProgram/detailChallenge?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  _deleteChallenge(id: number) {
    return this.httpClient.delete<ResponseResult>(
      this.baseUrl + 'joinProgram/deleteChallenge?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  _listChallenge(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'joinProgram/listChallenge?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  // View Details Of Program By Clint End
  _listRegisterInProgram(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'joinProgram/listRegisterInProgram?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  _listParticipateTestAttendance(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'joinProgram/listRegisterInProgram?id=' + id,
      this.globalService.getHttpOptions()
    );
  }
  _listInWorkshopAttendance(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'joinProgram/listWorshopAttendnace?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  _listInInterviewAttendance(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'joinProgram/listInterviewAttendnace?id=' + id,
      this.globalService.getHttpOptions()
    );
  }

  _listChallengeSubmited(id: number) {
    return this.httpClient.get<ResponseResult>(
      this.baseUrl + 'joinProgram/listChallengeSubmit?id=' + id,
      this.globalService.getHttpOptions()
    );
  }
}
