import { EstablishedAsnswerdModel } from './establishedAsnswerdModel';

export interface EstablishingDubaiForTheFutureModel {
  descriptionEn: string;
  descriptionAr: string;
  establishingDubaiForTheFutureDetailModels:
    | EstablishingDubaiForTheFutureDetailModel[]
    | null;

  establishedAsnswerdModels: EstablishedAsnswerdModel[] | null;
}

export interface EstablishingDubaiForTheFutureDetailModel {
  descriptionEn: string;
  descriptionAr: string;
  establishingDubaiForTheFutureId: number;
  requirmentsHeadingPointModels: RequirmentsHeadingPointModel[] | null;
  requirmentsPointsModels: RequirmentsPointsModel[] | null;
}

export interface RequirmentsHeadingPointModel {
  textEn: string;
  textAr: string;
  establishingDubaiForTheFutureDetailId: number;
}

export interface RequirmentsPointsModel {
  textEn: string;
  textAr: string;
  establishingDubaiForTheFutureDetailId: number;
}
