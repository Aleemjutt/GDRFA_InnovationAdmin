import { BaseInfoModel } from '../baseInfo';

export interface AboutInnovationCenterModel extends BaseInfoModel {
  aboutDescriptionAr: string | null;
  aboutDescriptionEn: string | null;
  orgStractureUrlAr: string | null;
  orgStractureUrlEn: string | null;
  messageFromDirectorAr: string | null;
  messageFromDirectorEn: string | null;
  directorNameEn: string | null;
  directorNameAr: string | null;
  directorImgUrl: string | null;
  strategyAr: string | null;
  strategyEn: string | null;
  strategyImageUrlAr: string | null;
  strategyImageUrlEn: string | null;
  ourVisionAr: string | null;
  ourVisionEn: string | null;
  ourVisionImageUrlAr: string | null;
  ourVisionImageUrlEn: string | null;
  ourMissionAr: string | null;
  ourMissionEn: string | null;
  ourMissionImageUrlAr: string | null;
  ourMissionImageUrlEn: string | null;
  ourValuesImageUrlAr: string | null;
  ourValuesImageUrlEn: string | null;
  ourGoalsImageUrlAr: string | null;
  ourGoalsImageUrlEn: string | null;
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
