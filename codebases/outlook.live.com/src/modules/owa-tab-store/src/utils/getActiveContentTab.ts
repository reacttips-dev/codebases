import TabViewState, { TabType, TabState } from '../store/schema/TabViewState';
import { getStore } from '../store/tabStore';
import * as trace from 'owa-trace';

export default function getActiveContentTab(): TabViewState {
    const store = getStore();

    for (const viewState of store.tabs) {
        if (viewState.state == TabState.Active && viewState.type != TabType.FloatingChat) {
            return viewState;
        }
    }

    // We should never see this happen.
    trace.errorThatWillCauseAlert('There is no active tab. Something went very wrong.');
    return null;
}
