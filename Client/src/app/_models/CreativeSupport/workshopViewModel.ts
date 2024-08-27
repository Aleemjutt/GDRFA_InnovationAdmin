export interface WorkshopViewModel {
  id: number;
  nameEn: string;
  nameAr: string;
  location: string;
  latitude: string;
  longitude: string;
  locationDescription: string;
  workshopDate: string | null;
  workshopTime: string | null;
  programId: number | null;
  venue: number | null;
  imageUrl: string;
  urlBase64: string;
  file: File | null;
}

export interface WorkshopAttendanceViewModel {
  registerDate: string | null;
  userId: number | null;
  userName: string | null;
  empId: string | null;
  empName: string | null;
  workshopId: number | null;
  attendanceStatus: AttendanceStatus;
}

export enum AttendanceStatus {
  Non = 0,
  Present = 1,
  Absent = 2,
}
