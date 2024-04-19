import { BaseInfoModel } from '../baseInfo';

export interface AwardDetailModel extends BaseInfoModel {
  awardClassification: AwardClassification | null;
  year: number | null;
  imageUrl: string | null;
  imageUrlView: string | null;
}
export enum AwardClassification {
  everyone = 1,
  international = 2,
  climatic = 3,
  local = 4,
}
