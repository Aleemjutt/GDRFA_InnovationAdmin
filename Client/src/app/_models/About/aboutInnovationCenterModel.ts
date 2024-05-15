import { BaseInfoModel } from '../baseInfo';

export interface AboutInnovationCenterModel extends BaseInfoModel {
  aboutDescriptionAr: string | null;
  aboutDescriptionEn: string | null;
  orgStractureUrlAr: string | null;
  orgStractureUrlArBase64: string | null;
  orgStractureUrlEn: string | null;
  orgStractureUrlEnBase64: string | null;
  messageFromDirectorAr: string | null;
  messageFromDirectorEn: string | null;
  directorNameEn: string | null;
  directorNameAr: string | null;
  directorImgUrl: string | null;
  directorImgUrlBase64: string | null;
  strategyAr: string | null;
  strategyEn: string | null;
  strategyImageUrlAr: string | null;
  strategyImageUrlArBase64: string | null;
  strategyImageUrlEn: string | null;
  strategyImageUrlEnBase64: string | null;

  ourVisionAr: string | null;
  ourVisionEn: string | null;
  ourVisionImageUrlAr: string | null;
  ourVisionImageUrlArBase64: string | null;
  ourVisionImageUrlEn: string | null;
  ourVisionImageUrlEnBase64: string | null;

  ourMissionAr: string | null;
  ourMissionEn: string | null;
  ourMissionImageUrlAr: string | null;
  ourMissionImageUrlArBase64: string | null;
  ourMissionImageUrlEn: string | null;
  ourMissionImageUrlEnBase64: string | null;
  ourValuesImageUrlAr: string | null;
  ourValuesImageUrlArBase64: string | null;
  ourValuesImageUrlEn: string | null;
  ourValuesImageUrlEnBase64: string | null;
  ourGoalsImageUrlAr: string | null;
  ourGoalsImageUrlArBase64: string | null;
  ourGoalsImageUrlEn: string | null;
  ourGoalsImageUrlEnBase64: string | null;
  ourValuesModel: OurValueModel[] | null;
  ourGoalsModel: OurGoalModel[] | null;
}

export interface OurValueModel {
  id: number | 0;
  ourValuesAr: string | null;
  ourValuesEn: string | null;
  innovationAboutCenterId: number | null;
}

export interface OurGoalModel {
  id: number | 0;
  ourGoalAr: string | undefined;
  ourGoalEn: string | undefined;
  innovationAboutCenterId: number | null;
}
