import { AskState } from './ask';

export const oneItemStateChange = <T>(state: AskState, id: string, keyToUpdate: string, valueToUpdate: T): AskState => {
  if (!state.questions) {
    return state;
  }
  for (let i = 0; i < state.questions.length; ++i) {
    const question = state.questions[i];
    if (question.key === id) {
      const newQuestions = [...state.questions];
      newQuestions[i] = { ...newQuestions[i], [keyToUpdate]: valueToUpdate };
      return { ...state, questions: newQuestions };
    }
    for (let j = 0; j < question.answers.length; ++j) {
      const answer = question.answers[j];
      if (answer.key === id) {
        const newQuestions = [...state.questions];
        const newAnswers = [...question.answers];
        newAnswers[j] = { ...newAnswers[j], [keyToUpdate]: valueToUpdate };
        newQuestions[i] = { ...newQuestions[i], answers: newAnswers };
        return { ...state, questions: newQuestions };
      }
    }
  }
  return state;
};
