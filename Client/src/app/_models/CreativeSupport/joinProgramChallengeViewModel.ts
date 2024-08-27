export interface JoinProgramChallengeViewModel {
  id: number;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  link: string | null;
  programId: number | null;
}

export interface JoinProgramChallengeSubmitViewModel {
  challengeId: number | null;
  userId: number | null;
  userName: string | null;
  empId: string | null;
  empName: string | null;
}
