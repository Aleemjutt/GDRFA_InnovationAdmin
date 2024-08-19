import { JoinProgramChallengeViewModel } from './joinProgramChallengeViewModel';
import { InterviewViewModel } from './interviewViewModel';
import { WrokshopViewModel } from './wrokshopViewModel';

export interface joinProgramViewModel {
  id: number;
  startDate: string | null;
  endDate: string | null;
  statusCode: StautsCode | null;
  joinProgramChallengesViewModels: JoinProgramChallengeViewModel[] | null;
  interviewsViewModels: InterviewViewModel[] | null;
  wrokshopsViewModels: WrokshopViewModel[] | null;
}

export enum StautsCode {
  Active = 1,
  IActive = 2,
}
