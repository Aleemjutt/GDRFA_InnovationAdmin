import { NumberCardModule } from '@swimlane/ngx-charts';

export interface ResearchAndStudiesModel {
  id: number | 0;
  discuss: Discuss | null;
  researchAndStudiesCategories: ResearchAndStudiesCategories | null;
  descrtionEn: string | null;
  descrtionAr: string | null;
  publisherNameEn: string | null;
  publisherNameAr: string | null;
  newArrivals: boolean;
  storyNameEn: string | null;
  storyNameAr: string | null;
  bookNoEn: string | null;
  bookNoAr: string | null;
  url: string | null;
  urlBase64: string | null;
  bookLink: string | null;
}

export enum ResearchAndStudiesCategories {
  ScholarsResearchMastersAndPhD = 1,
  InnovativeResearch = 2,
  AccreditedResearch = 3,
}

export enum Discuss {
  InstitutionalSupportSector = 1,
  ViolatorsAndForeignersFollowupSector = 2,
  LandandAirPortssector = 3,
  HumanAndFinancialResourcessector = 4,
  EntryandResidencePermitssector = 5,
  NationalityAffairsSector = 6,
  Airportssector = 7,
}
