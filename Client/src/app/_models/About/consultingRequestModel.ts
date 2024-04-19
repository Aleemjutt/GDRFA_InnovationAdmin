import { WorkFlowStatus } from '../Common/workflowStatus';

export interface InnovationConsultingRequestModel {
  name: string | null;
  email: string | null;
  subject: string | null;
  message: string | null;
  replyMessage: string | null;
  status: WorkFlowStatus;
  statusName: string | null;
}
