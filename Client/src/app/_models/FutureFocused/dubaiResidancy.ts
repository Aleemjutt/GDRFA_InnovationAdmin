export interface DubaiResidencyCentenaryModel {
  tagLineEn: string | null;
  tagLineAr: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  dubaiResidencyCentenaryPointsMainModels:
    | DubaiResidencyCentenaryPointsMainModel[]
    | null;
}

export interface DubaiResidencyCentenaryPointsMainModel {
  headLineEn: string | null;
  headLineAr: string | null;
  dubaiResidencyCentenaryId: number | null;
  dubaiResidencyCentenaryPointsLineModels:
    | DubaiResidencyCentenaryPointsLineModel[]
    | null;
}

export interface DubaiResidencyCentenaryPointsLineModel {
  textEn: string | null;
  textAr: string | null;
  dubaiResidencyCentenaryPointsMainId: number | null;
}
