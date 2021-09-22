setAnswerPlaceholderId;
import { setAnswerPlaceholderId } from '../actions/internalActions';
import { mutator } from 'satcheljs';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';

mutator(setAnswerPlaceholderId, actionMessage => {
    getScenarioStore(SearchScenarioId.Mail).answerPlaceholderId = actionMessage.placeholderId;
});
