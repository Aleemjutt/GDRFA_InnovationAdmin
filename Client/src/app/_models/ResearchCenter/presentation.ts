import { AttachmentModel } from '../Ideas/ideaSubmitModel';

export interface tblPresentationModel {
  searchNameEn: string | null;
  searchNameAr: string | null;
  researchAreaCategory: ResearchAreaCategory | null;
  searchContent: string | null;
  searchVersion: string | null;
  presentationAttachmentModels: PresentationAttachmentModel[];
}

export interface PresentationAttachmentModel {
  presentationId: number | null;
  url: string | null;
  title: string;
  extension: string | null;
  size: string | null;
  urlBase64: string;
}

export enum ResearchAreaCategory {
  ForgeryAndDocumentExamination = 1,
  InstitutionalInnovation = 2,
  NationalityAndPassportAffairs = 3,
  ResidencyLawViolatorsAffairs = 4,
}
