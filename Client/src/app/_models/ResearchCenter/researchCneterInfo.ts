export interface ResearchCenterInfoModel {
  id: number | 0;
  descriptionEn: string | null;
  descriptionAr: string | null;
  presentingscientificResearchEn: string | null;
  presentingscientificResearchAr: string | null;
  researchAreaModels: ResearchAreaModel[] | null;
}

export interface ResearchAreaModel {
  id: number | 0;
  textEn: string | null;
  textAr: string | null;
  researchCenterInfoId: number | null;
}
