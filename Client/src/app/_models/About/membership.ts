import { BaseInfoModel } from '../baseInfo';

export interface MembershipsModel extends BaseInfoModel {
  descriptionEn: string | null;
  descriptionAr: string | null;
  url: string | null;
}
