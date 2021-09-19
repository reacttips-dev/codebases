import { oneItemStateChange } from './utils';
import { modifyStateWithNewItem, processQuestionsAndAnswers } from './questionsAndAnswers';
import processVotes from './votes';

import {
  ASK_DATA_ERROR,
  CHANGE_VOTE_ON_ASK_ITEM,
  MY_ASK_VOTES_ERROR,
  NEW_ASK_ITEM,
  RECEIVE_ASK_DATA,
  RECEIVE_MY_ASK_VOTES,
  REPORT_ASK_ITEM,
  SET_ANSWERING_ASK_QUESTION,
  SET_ASK_ANSWERS_COLLAPSED,
  SET_ASK_QUESTIONS_COLLAPSED,
  SET_VIEWING_ASK_QUESTIONS_DESKTOP
} from 'constants/reduxActions';
import { AppAction } from 'types/app';

function changeVote(state: AskState, { key, delta }: { key: string; delta: number }): AskState {
  const questionToUpdate = state.questions?.find(question => question.key === key);
  // questions have a `votes`, answers have upvotes and downvotes
  if (questionToUpdate) {
    const newState = oneItemStateChange(state, key, 'myVote', questionToUpdate.myVote + delta);
    const voteChange = questionToUpdate.votes + delta;
    return oneItemStateChange(newState, key, 'votes', voteChange);
  }
  let answerToUpdate: AskAnswer | undefined;
  state.questions?.forEach(question => {
    const answer = question.answers.find(answer => answer.key === key);
    if (answer) {
      answerToUpdate = answer;
    }
  });
  if (answerToUpdate) {
    const myVote = answerToUpdate.myVote + delta;
    const newState = oneItemStateChange(state, key, 'myVote', myVote);
    const affectUpvote = (myVote === 1 && delta === 1) || (myVote === 0 && delta === -1);
    if (affectUpvote) {
      const voteChange = answerToUpdate.upvotes + delta;
      return oneItemStateChange(newState, key, 'upvotes', voteChange);
    } else {
      const voteChange = answerToUpdate.downvotes - delta;
      return oneItemStateChange(newState, key, 'downvotes', voteChange);
    }
  }
  return state;
}

export interface AskQuestion {
  key: string;
  text: string;
  votes: number;
  answers: AskAnswer[];
  answersCollapsed: boolean;
  myVote: number;
  justReported: boolean;
  answering: boolean;
  [index: string]: any;
}

export interface AskAnswer {
  key: string;
  text: string;
  author: string;
  date: string;
  upvotes: number;
  downvotes: number;
  best: boolean;
  myVote: number;
  justReported: boolean;
  [index: string]: any;
}

export interface AskState {
  loading: boolean;
  askError?: boolean;
  myAskVotesError?: boolean;
  authenticated?: boolean;
  questions?: AskQuestion[];
  questionsCollapsed?: boolean;
  viewingQuestionsDesktop?: boolean;
}

export default function ask(state: AskState = { loading: true }, action: AppAction): AskState {

  switch (action.type) {
    case ASK_DATA_ERROR: {
      return { ...state, askError: true };
    }

    case CHANGE_VOTE_ON_ASK_ITEM: {
      const { data } = action;
      return changeVote(state, data);
    }

    case MY_ASK_VOTES_ERROR: {
      return { ...state, myAskVotesError: true };
    }

    case NEW_ASK_ITEM: {
      const { data: { parentKey, newItem } } = action;
      return modifyStateWithNewItem(state, parentKey, newItem);
    }

    case RECEIVE_ASK_DATA: {
      const { data } = action;
      return processQuestionsAndAnswers(data);
    }

    case RECEIVE_MY_ASK_VOTES: {
      const { data } = action;
      return processVotes(state, data);
    }

    case REPORT_ASK_ITEM: {
      const { data } = action;
      return oneItemStateChange(state, data, 'justReported', true);
    }

    case SET_ASK_QUESTIONS_COLLAPSED: {
      const { data: { collapsed } } = action;
      return { ...state, questionsCollapsed: collapsed };
    }

    case SET_ASK_ANSWERS_COLLAPSED: {
      const { data: { questionKey, collapsed } } = action;
      return oneItemStateChange(state, questionKey, 'answersCollapsed', collapsed);
    }

    case SET_ANSWERING_ASK_QUESTION: {
      const { data: { key, answering } } = action;
      return oneItemStateChange(state, key, 'answering', answering);
    }

    case SET_VIEWING_ASK_QUESTIONS_DESKTOP: {
      const { data: { viewing } } = action;
      return { ...state, viewingQuestionsDesktop: viewing };
    }

    default:
      return state;
  }
}
