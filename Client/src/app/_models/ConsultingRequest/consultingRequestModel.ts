import { WorkFlowStatus } from '../Common/workflowStatus';

export interface InnovationConsultingRequestModel {
  id: number | null;
  name: string | null;
  email: string | null;
  subject: string | null;
  message: string | null;
  replyMessage: string | null;
  status: WorkFlowStatus | null;
}
