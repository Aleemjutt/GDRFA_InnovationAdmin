export interface ParticipationTestViewModel {
  id: number;
  questionViewModels: QuestionViewModel[] | null;
  participationTestAnswersViewModels: ParticipationTestAnswerViewModel[] | null;
  status: boolean;
  programId: number;
}

export interface QuestionViewModel {
  id: number | 0;
  textAr: string;
  textEn: string;
  mqsOptionsViewModel: MQSOptionViewModel[];
  participationTestId: number;
}

export interface MQSOptionViewModel {
  id: number | 0;
  textAr: string;
  textEn: string;
  isCorrect: boolean;
  questionId: number;
}

export interface ParticipationTestAnswerViewModel {
  id: number;
  questionId: number;
  isSelected: boolean;
  optionId: number;
}

export interface ParticipationTestAttendnaceViewModel {
  submitDate: string | null;
  userId: number | null;
  userName: string | null;
  empId: string | null;
  empName: string | null;
  testId: number | null;
  testStatus: TestStatus;
}

export enum TestStatus {
  Non = 0,
  Passed = 1,
  Fail = 2,
  NotAttended = 3,
}
