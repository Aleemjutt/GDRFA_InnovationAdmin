export interface TargetCompainModel {
  id: number | null;
  targetCompainTextAr: string | null;
  targetCompainTextEn: string | null;
  targetCompainsOptionModels: TargetCompainsOptionModel[] | null;
  noteEn: string | null;
  noteAr: string | null;
}

export interface TargetCompainsOptionModel {
  id: number | null;
  optiontextEn: string | null;
  optiontextAR: string | null;
}

export interface TargetCompainOptionAnswerModel {
  optionId: number | null;

  targetAnswerId: number | null;

  optionAnswer: boolean | null;
}

export interface TargetAttachmentModel {
  extension: string | null;
  url: string | null;
  targetAnswerId: number | null;
  title: string | null;
}

export interface TargetAnswerModel {
  id: number | null;
  challengeTitle: string | null;
  challengeDetails: string | null;
  targetCompanId: number | null;
}

// Answer detials with Options

export interface TargetAnswerDetailsModel {
  id: 0 | null;
  challengeTitle: string | null;
  challengeDetails: string | null;
  targetCompanId: number | null;
  targetCompainOptionAnswerModels:
    | TargetCompainOptionAnswerDetailsModel[]
    | null;
  targetAttachmentModel: TargetAttachmentModel[] | null;
}

export interface TargetCompainOptionAnswerDetailsModel {
  optionId: number | null;
  optiontextEn: string | null;
  optiontextAR: string | null;
  targetAnswerId: number | null;
  optionAnswer: string | null;
  displayValue: string | null;
}
