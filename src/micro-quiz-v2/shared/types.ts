export type GradingStatus = 'pending' | 'correct' | 'incorrect';

export interface AnswerRecord {
  studentId: string;
  questionId: string;
  answers: string;
  status: GradingStatus;
  updatedAt: string;
}
