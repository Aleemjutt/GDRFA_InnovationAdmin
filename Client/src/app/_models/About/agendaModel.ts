import { Time } from '@angular/common';
import { BaseInfoModel } from '../baseInfo';
import { AgendaAttachmentModel } from './agendaAttachment';

export interface AgendaModel {
  id: number | null;
  headingEn: string | null;
  headingAr: string | null;
  descriptionEn: string | null;
  descriptionAr: string | null;
  date: string | null;
  time: string | null;
  locationDescriptionEn: string | null;
  locationDescriptionAr: string | null;
  urlBase64: string | null;
  imageUrl: string | null;
  agendaVenue: AgendaVenue;
  agendaAttachmentModels: AgendaAttachmentModel[];
}

export enum AgendaVenue {
  OnPrimises = 0,
  Online = 1,
}
