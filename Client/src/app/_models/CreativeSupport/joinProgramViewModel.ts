export interface ParticipationTestViewModel {
  questionViewModels: QuestionViewModel[] | null;
  participationTestAnswersViewModels: ParticipationTestAnswerViewModel[] | null;
  status: boolean;
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
  questionId: number;
  isSelected: boolean;
  optionId: number;
}
