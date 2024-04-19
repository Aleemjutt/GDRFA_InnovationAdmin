import { BaseInfoModel } from '../baseInfo';

export interface ArchivesModel extends BaseInfoModel {
  descriptionEn: string | null;
  descriptionAr: string | null;
  titleEn: string | null;
  titleAr: string | null;
}
