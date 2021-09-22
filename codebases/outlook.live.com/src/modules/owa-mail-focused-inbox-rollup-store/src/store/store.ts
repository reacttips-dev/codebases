import type FocusedInboxRollupStore from './schema/FocusedInboxRollupStore';
import InboxViewType from 'owa-service/lib/contract/InboxViewType';
import { createStore } from 'satcheljs';

const defaultFocusedInboxRollupStore: FocusedInboxRollupStore = {
    uniqueSenders: null,
    unseenCountToDisplay: null,
    viewType: InboxViewType.Invalid,
};

const store = createStore<FocusedInboxRollupStore>(
    'focusedInboxRollupStore',
    defaultFocusedInboxRollupStore
)();
export default store;
