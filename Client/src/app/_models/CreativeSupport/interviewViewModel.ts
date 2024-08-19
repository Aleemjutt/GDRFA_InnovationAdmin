export interface InterviewViewModel {
  id: number;
  nameEn: string;
  nameAr: string;
  location: string;
  latitude: string;
  longitude: string;
  locatoinDescription: string;
  interviewDate: string;
  interviewTime: string | null;
  programId: number | null;
  imageUrl: string;
  urlBase64: string;
  venue: number;
  file: File | null;
}
