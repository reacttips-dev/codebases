import { oneItemStateChange } from './utils';
import { AskAnswer, AskQuestion, AskState } from './ask';

import { formatDate } from 'helpers/dateUtils';
import { AskData, AskItem } from 'types/ask';

const answersReducer = (acc: AskAnswer[], answer: AskItem): AskAnswer[] => {
  const { active = true } = answer;
  if (active) {
    const { qAItemId, text, displayName, timeStamp, upVotes, downVotes } = answer;
    acc.push({
      key: qAItemId,
      text,
      author: displayName,
      date: formatDate('MMMM D, YYYY', new Date(timeStamp * 1000)), // timeStamp is unix seconds and we need ms for date constructor
      upvotes: upVotes,
      downvotes: downVotes,
      best: false,
      myVote: 0,
      justReported: false
    });
  }
  return acc;
};

const processAnswers = (answers: AskAnswer[]) => {
  if (answers.length !== 0) {
    answers[0].best = true;
  }
  return answers;
};

const questionsReducer = (acc: AskQuestion[], question: AskItem): AskQuestion[] => {
  const { active = true, qAItemId, text, score } = question;
  const qAItemsList = question.qAItemsList || [];
  if (active) {
    acc.push({
      key: qAItemId,
      text,
      votes: score,
      answers: processAnswers(qAItemsList.reduce(answersReducer, [])),
      answersCollapsed: true,
      myVote: 0,
      justReported: false,
      answering: false
    });
  }
  return acc;
};

function modifyStateWithNewQuestion(state: AskState, question: AskItem): AskState {
  const currentQuestions = state.questions ?? [];
  const newQuestions = questionsReducer([...currentQuestions], question);
  return { ...state, questions: newQuestions };
}

function modifyStateWithNewAnswer(state: AskState, questionKey: string, answer: AskItem): AskState {
  // newAnswer is a list of 0 or 1 answer(s)
  const question = state.questions?.find(question => question.key === questionKey);
  const existingAnswers = question?.answers ?? [];
  const newAnswers = answersReducer([...existingAnswers], answer);
  return oneItemStateChange(state, questionKey, 'answers', newAnswers);
}

export function modifyStateWithNewItem(state: AskState, questionKey: string | undefined, item: AskItem): AskState {
  if (questionKey) {
    return modifyStateWithNewAnswer(state, questionKey, item);
  } else {
    return modifyStateWithNewQuestion(state, item);
  }
}

export function processQuestionsAndAnswers(data: AskData): AskState {
  const questions = data.qAItemsList.reduce(questionsReducer, []);
  return {
    questions,
    questionsCollapsed: true,
    viewingQuestionsDesktop: true,
    authenticated: false,
    loading: false
  };
}
