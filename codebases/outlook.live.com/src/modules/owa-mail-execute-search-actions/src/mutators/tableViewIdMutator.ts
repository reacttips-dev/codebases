import { setTableViewId } from '../actions/internalActions';
import { mutator } from 'satcheljs';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';

mutator(setTableViewId, actionMessage => {
    getScenarioStore(SearchScenarioId.Mail).tableViewId = actionMessage.tableViewId;
});
