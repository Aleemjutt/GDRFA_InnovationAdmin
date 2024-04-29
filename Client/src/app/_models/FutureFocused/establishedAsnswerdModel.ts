export interface EstablishedAsnswerdModel {
  establishingDubaiForTheFutureId: number;
  establishedAsnswerdAttachmentModels:
    | EstablishedAsnswerdAttachmentModel[]
    | null;
}

export interface EstablishedAsnswerdAttachmentModel {
  url: string;
  establishedAsnswerdId: number;
}
