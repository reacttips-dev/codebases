import { ComposeViewState, getStore } from 'owa-mail-compose-store';
import { TabViewState, TabType } from 'owa-tab-store';
import type ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import findInlineComposeViewState from './findInlineComposeViewState';
import * as trace from 'owa-trace';

/**
 * Finds the ComposeViewState from a given tab and returns it.
 * @param {TabViewState} tab that contains the tab we want to retrieve the ComposeViewState from.
 * @param {string} id that contains either a ConversationId or a ReferenceItemId property that is part of the ComposeViewState.
 * If it's ConversationView, then the id should be ConversationId.
 * If it's ItemView, then the id should be ReferenceItemId.
 * @param {ReactListViewType} listViewType that represents either a ConversationView or ItemView to loopk up for the .
 * @returns ComposeViewState containing the compose view for the given tab.
 */
export default function findComposeFromTab(
    tab: TabViewState,
    id: string,
    listViewType: ReactListViewType
): ComposeViewState {
    const composeStore = getStore();
    let composeViewState: ComposeViewState;

    if (tab) {
        switch (tab.type) {
            case TabType.SecondaryReadingPane:
                if (tab.data.listViewType == listViewType) {
                    composeViewState = findInlineComposeViewState(id, listViewType);
                }
                break;
            case TabType.MailCompose:
                composeViewState = composeStore.viewStates.get(tab.data);

                break;
            case TabType.Primary:
                // It is possible the user has selected a new conversation while their
                // old conversation was still sending, i.e. in delay send. In this case,
                // hold on to the compose view state for later handling (see below)
                composeViewState = id
                    ? findInlineComposeViewState(
                          id,
                          listViewType,
                          true /* includeDelayedSendState */
                      )
                    : null;
                break;
            default:
                composeViewState = null;
        }

        return composeViewState;
    } else {
        trace.errorThatWillCauseAlert('There is no active tab. Something went very wrong.');
        return null;
    }
}
