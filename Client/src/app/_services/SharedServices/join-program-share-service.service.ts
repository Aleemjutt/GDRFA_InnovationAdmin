import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChallengeViewModel } from 'src/app/_models/CreativeSupport/challengeViewModel';
import { InterviewAttendanceViewModel } from 'src/app/_models/CreativeSupport/interviewViewModel';
import { JoinProgramChallengeSubmitViewModel } from 'src/app/_models/CreativeSupport/joinProgramChallengeViewModel';
import { RegisterJoinProgramViewModel } from 'src/app/_models/CreativeSupport/joinProgramViewModel';
import { ParticipationTestAttendnaceViewModel } from 'src/app/_models/CreativeSupport/participatingTestViewModel';
import { WorkshopAttendanceViewModel } from 'src/app/_models/CreativeSupport/workshopViewModel';

@Injectable({
  providedIn: 'root',
})
export class JoinProgramShareServiceService {
  constructor() {}

  private registerProgramListSource = new BehaviorSubject<
    RegisterJoinProgramViewModel[]
  >([]); // Replace `any[]` with your actual type
  programList$ = this.registerProgramListSource.asObservable();

  private wrokshopListSource = new BehaviorSubject<
    WorkshopAttendanceViewModel[]
  >([]); // Replace `any[]` with your actual type
  workshopList$ = this.wrokshopListSource.asObservable();

  private interviewListSource = new BehaviorSubject<
    InterviewAttendanceViewModel[]
  >([]); // Replace `any[]` with your actual type
  interviewList$ = this.interviewListSource.asObservable();

  private challengeListSource = new BehaviorSubject<
    JoinProgramChallengeSubmitViewModel[]
  >([]); // Replace `any[]` with your actual type
  challengeList$ = this.challengeListSource.asObservable();

  private ParticipateInTestListSource = new BehaviorSubject<
    ParticipationTestAttendnaceViewModel[]
  >([]); // Replace `any[]` with your actual type
  participateInTestListSource$ =
    this.ParticipateInTestListSource.asObservable();

  _setProgramList(programs: RegisterJoinProgramViewModel[]) {
    this.registerProgramListSource.next(programs);
  }

  _setWorkshopList(woshops: WorkshopAttendanceViewModel[]) {
    this.wrokshopListSource.next(woshops);
  }

  _setInterviewList(interviews: InterviewAttendanceViewModel[]) {
    this.interviewListSource.next(interviews);
  }

  _setChallengeList(challenges: JoinProgramChallengeSubmitViewModel[]) {
    this.challengeListSource.next(challenges);
  }
  _setParticipateAttendanceList(
    testParticipates: ParticipationTestAttendnaceViewModel[]
  ) {
    this.ParticipateInTestListSource.next(testParticipates);
  }
}
