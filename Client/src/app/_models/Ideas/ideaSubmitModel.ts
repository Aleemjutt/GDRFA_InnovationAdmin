export interface IdeasSubmitModel {
  termAndCondition: boolean | null;
  title: string | null;
  ideaText: string | null;
  employeehappiness: boolean | null;
  improvingservices: boolean | null;
  rationalizationofexpenses: boolean | null;
  customerhappiness: boolean | null;
  informationabouttechnologydevelopment: boolean | null;
  findindnewsourcesoffinancing: boolean | null;
  sectorId: number | null;
  administrationId: number | null;
  administrationName: string | null;
  sectorName: string | null;
  submitterStatus: number | null;
  status: number | null;
  modificationNote: string | null;
  createdDate: string | null;
  attachmentsModel: AttachmentModel[] | [];
  workFlowStatus: WorkFlowStatus;
  workFlowStatusName: string | null;
}

export interface AttachmentModel {
  url: string | null;
  IdeaId: number | 0;
  title: string | null;
  extension: string | null;
  size: string | null;
}

export enum WorkFlowStatus {
  Accept = 0,
  Reject = 1,
  Approved = 2,
  Modification = 3,
  UnderProcesses = 4,
  Returned = 5,
}
