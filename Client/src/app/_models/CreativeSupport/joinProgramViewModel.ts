import { JoinProgramChallengeViewModel } from './joinProgramChallengeViewModel';
import { InterviewViewModel } from './interviewViewModel';
import { WorkshopViewModel } from './workshopViewModel';
import { ParticipationTestViewModel } from './participatingTestViewModel';

export interface joinProgramViewModel {
  id: number;
  startDate: string | null;
  endDate: string | null;
  statusCode: StautsCode | null;
  joinProgramChallengeViewModels: JoinProgramChallengeViewModel[] | null;
  interviewViewModels: InterviewViewModel[] | null;
  workshopViewModels: WorkshopViewModel[] | null;
  participationTestViewModels: ParticipationTestViewModel[] | null;
}

export enum StautsCode {
  Active = 1,
  IActive = 2,
}
