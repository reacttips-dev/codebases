import { setIsAnswerRendered } from '../actions/internalActions';
import { mutator } from 'satcheljs';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';

mutator(setIsAnswerRendered, actionMessage => {
    getScenarioStore(SearchScenarioId.Mail).isAnswerRendered = actionMessage.value;
});
