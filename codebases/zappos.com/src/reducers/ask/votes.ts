import { AskAnswer, AskQuestion, AskState } from './ask';
import { oneItemStateChange } from './utils';

import { VotesData } from 'types/ask';

const parseVoteString = (voteString: string) => {
  const [itemId, changeString] = voteString.split(',');
  return [itemId, +changeString] as const;
};

const loadVoteAndCheckEmpty = (state: AskState, item: AskQuestion | AskAnswer, votes: Record<string, number>) => {
  const vote = votes[item.key];
  let newState = { ...state };
  if (typeof vote !== 'undefined') {
    newState = oneItemStateChange(state, item.key, 'myVote', vote);
    delete votes[item.key];
  }
  return newState;
};

const loadVotes = (state: AskState, votes: Record<string, number>) => {
  if (Object.keys(votes).length === 0) {
    return state;
  }

  const { questions } = state;
  if (questions) {
    for (let i = 0; i < questions.length; ++i) {
      state = loadVoteAndCheckEmpty(state, questions[i], votes);
      if (Object.keys(votes).length === 0) {
        return state;
      }
      const { answers } = questions[i];
      for (let j = 0; j < answers.length; ++j) {
        state = loadVoteAndCheckEmpty(state, questions[i].answers[j], votes);
        if (Object.keys(votes).length === 0) {
          return state;
        }
      }
    }
    return state;
  }
  return state;
};

export default function processVotes(state: AskState, data: VotesData): AskState {
  if (state.askError) {
    return state;
  }

  const dataHasQaidList = Boolean(data && data.qaidList);
  let voteStrings: string[] = [];
  if (dataHasQaidList) {
    voteStrings = data.qaidList;
  }
  const votes = voteStrings.reduce((acc: Record<string, number>, voteString) => {
    const [itemId, change] = parseVoteString(voteString);
    acc[itemId] = change;
    return acc;
  }, {});
  const newState = loadVotes(state, votes);

  if (dataHasQaidList) {
    return { ...newState, authenticated: true };
  }
  return newState;
}
