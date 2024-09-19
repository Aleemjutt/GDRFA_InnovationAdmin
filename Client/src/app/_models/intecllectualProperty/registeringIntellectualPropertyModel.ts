import { BaseInfoAttachmentModel } from '../Common/baseInfoAttachmentModel';
import {
  Gender,
  AuthorNature,
  AuthorType,
  AccommodationType,
  WorkbookType,
} from '../Common/enumsConnon';

export interface RegisteringIntellectualPropertyModel {
  id: 0;
  fullNameEn: string | null;
  fullNameAr: string | null;
  firstNameEn: string | null;
  firstNameAr: string | null;
  secondNameEn: string | null;
  secondNameAr: string | null;
  thirdNameEn: string | null;
  thirdNameAr: string | null;
  familyNameEn: string | null;
  familyNameAr: string | null;
  dateofBirth: string | null;
  gender: Gender;
  personsofDetermination: boolean;
  mobile: string | null;
  email: string | null;
  emiratesIDNumber: string | null;
  passportNumber: string | null;
  authorDataModel: AuthorDataModel | null;
  classifierDataModel: ClassifierDataModel | null;
}

export interface AuthorDataModel {
  authorNature: AuthorNature;
  authorType: AuthorType;
  accommodationType: AccommodationType;
  nameEn: string | null;
  nameAr: string | null;
  nationality: number | null;
  mobile: string | null;
  email: string | null;
  registeringIntellectualPropertyId: number | null;
}

export interface ClassifierDataModel {
  nameofworkEn: string | null;
  nameofworkAr: string | null;
  workbookType: WorkbookType;
  descriptionWorkbook: string | null;
  workbookContent: string | null;
  registeringIntellectualPropertyId: number | null;
  attachmentsModel: AttachmentClassifierModel[];
}

export interface AttachmentClassifierModel extends BaseInfoAttachmentModel {
  classifierId: number | null;
  url: string | null;
  urlBase64: string | null;
}
