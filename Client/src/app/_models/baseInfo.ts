export interface BaseInfoModel {
  id: number;
  createdDate: string | null;
  createdBy: number | null;
  updatedDate: string | null;
  updatedBy: number | null;
  isDeleted: boolean;
  isActive: boolean;
}
