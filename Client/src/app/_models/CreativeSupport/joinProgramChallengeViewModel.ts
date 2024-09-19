import { extend } from 'jquery';
import { BaseInfoAttachmentModel } from '../Common/baseInfoAttachmentModel';

export interface JoinProgramChallengeViewModel {
  id: number;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  link: string | null;
  programId: number | null;
}

export interface JoinProgramChallengeSubmitViewModel {
  challengeId: number | null;
  userId: number | null;
  userName: string | null;
  empId: string | null;
  empName: string | null;
  attachmentViewModel: ChallengePresentationAttachment | null;
}

export interface ChallengePresentationAttachment
  extends BaseInfoAttachmentModel {
  joinProgramChallengeSubmitId: number | null;
  challengeId: number | null;
  submitedDate: string | null;
  url: string | null;
  base64String: string | null;
}
