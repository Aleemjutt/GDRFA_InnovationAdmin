export interface InterviewViewModel {
  id: number;
  nameEn: string;
  nameAr: string;
  location: string;
  latitude: string;
  longitude: string;
  locatoinDescription: string;
  interviewDate: string | null;
  interviewTime: string | null;
  programId: number | null;
  imageUrl: string;
  urlBase64: string;
  venue: number;
  file: File | null;
  interviewTimeTo: string | null;
}

export interface InterviewAttendanceViewModel {
  registerDate: string | null;
  userId: number | null;
  userName: string | null;
  empId: string | null;
  empName: string | null;
  interviewId: number | null;
  interviewStatus: InterviewStatus;
}

export enum InterviewStatus {
  Non = 0,
  Passed = 1,
  Fail = 2,
  NotAttended = 3,
}
