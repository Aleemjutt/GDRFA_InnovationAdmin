import { JoinProgramChallengeViewModel } from './joinProgramChallengeViewModel';
import { InterviewViewModel } from './interviewViewModel';
import { WorkshopViewModel } from './workshopViewModel';
import { ParticipationTestViewModel } from './participatingTestViewModel';
import { StatusCode } from '../Common/enumsConnon';

export interface joinProgramViewModel {
  id: number;
  descriptionEn: string | undefined;
  descriptionAr: string | undefined;
  startDate: string | null;
  endDate: string | null;
  statusCode: StatusCode | StatusCode.InActive;

  joinProgramChallengeViewModels: JoinProgramChallengeViewModel[] | null;
  interviewViewModels: InterviewViewModel[] | null;
  workshopViewModels: WorkshopViewModel[] | null;
  participationTestViewModels: ParticipationTestViewModel[] | null;
}

export interface RegisterJoinProgramViewModel {
  registerDate: string | null;
  userId: number | null;
  userName: string | null;
  empId: string | null;
  empName: string | null;
  programId: number | null;
}
