import { Attachment } from "./attachment";

export interface OperationModel {
  id: number;
  createdDate: string;
  createdBy: number;
  updatedDate: string;
  updatedBy: number;
  optimizationType: string;
  attachments: Attachment[];
  beforeObtimization: string;
  afterObtimization: string;
  numberofprocedures_Before: number;
  numberofprocedures_After: number;
  numberofprocedures_Result: number;
  errorRate_Before: number;
  errorRate_After: number;
  errorRate_Result: number;
  employeeHappinessMeter_Before: number;
  employeeHappinessMeter_After: number;
  employeeHappinessMeter_Result: number;
  customerHappinessMeter_Before: number;
  customerHappinessMeter_After: number;
  customerHappinessMeter_Result: number;
  partnersHappinessMeter_Before: number;
  partnersHappinessMeter_After: number;
  partnersHappinessMeter_Result: number;
  supplierHappinessMeter_Before: number;
  supplierHappinessMeter_After: number;
  supplierHappinessMeter_Result: number;
  communityHappinessMeter_Before: number;
  communityHappinessMeter_After: number;
  communityHappinessMeter_Result: number;
  saveType: number;
}
