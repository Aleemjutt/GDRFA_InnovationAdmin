import { JoinProgramChallengeViewModel } from './joinProgramChallengeViewModel';
import { InterviewViewModel } from './interviewViewModel';
import { WorkshopViewModel } from './workshopViewModel';
import { ParticipationTestViewModel } from './participatingTestViewModel';

export interface joinProgramViewModel {
  id: number;
  startDate: string | null;
  endDate: string | null;
  statusCode: StautsCode | null;
  joinProgramChallengesViewModels: JoinProgramChallengeViewModel[] | null;
  interviewsViewModels: InterviewViewModel[] | null;
  workshopsViewModels: WorkshopViewModel[] | null;
  participationTestViewModels: ParticipationTestViewModel[] | null;
}

export enum StautsCode {
  Active = 1,
  IActive = 2,
}
