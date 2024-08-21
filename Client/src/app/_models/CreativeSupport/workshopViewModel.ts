export interface WorkshopViewModel {
  id: number;
  nameEn: string;
  nameAr: string;
  location: string;
  latitude: string;
  longitude: string;
  locationDescription: string;
  workshopDate: string | null;
  wrokshopTime: string | null;
  programId: number | null;
  venue: number | null;
  imageUrl: string;
  urlBase64: string;
  file: File | null;
}
