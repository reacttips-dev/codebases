import type { InVideoQuestion } from 'bundles/video-quiz/types';
import type { QuizQuestionPrompt } from 'bundles/compound-assessments/types/FormParts';

class VideoQuiz {
  public readonly questions: InVideoQuestion<QuizQuestionPrompt>[];

  public readonly sessionId: string;

  constructor({ sessionId, questions }: { sessionId: string; questions: InVideoQuestion<QuizQuestionPrompt>[] }) {
    this.sessionId = sessionId;
    this.questions = questions;
  }
}

export default VideoQuiz;
