import { BaseInfoModel } from '../baseInfo';

export interface CreditModel extends BaseInfoModel {
  descriptionEn: string | null;
  descriptionAr: string | null;
  imageUrl: string | null;
  imageUrlView: string | null;
}
