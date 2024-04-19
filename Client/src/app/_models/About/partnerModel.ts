import { BaseInfoModel } from '../baseInfo';

export interface PartnerModel extends BaseInfoModel {
  descriptionEn: string | null;
  descriptionAr: string | null;
  imageUrl: string | null;
  imageUrlView: string | null;

  partnerType: PartnerType;
}

export enum PartnerType {
  Normal = 0,
  Strategic = 1,
}
