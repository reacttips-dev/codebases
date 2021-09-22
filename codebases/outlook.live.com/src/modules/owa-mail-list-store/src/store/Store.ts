import type AttachmentPreviewWellView from './schema/AttachmentPreviewWellView';
import type BusStopState from './schema/BusStopState';
import type ConversationItem from './schema/ConversationItem';
import type ListViewStore from './schema/ListViewStore';
import type TableView from './schema/TableView';
import type TableViewConversationRelation from './schema/TableViewConversationRelation';
import type RowInfoForVLV from './schema/RowInfoForVLV';
import type TableViewItemRelation from './schema/TableViewItemRelation';
import { ObservableMap } from 'mobx';
import type { AttachmentFullViewState } from 'owa-attachment-well-data';
import { createStore } from 'satcheljs';
import type { ClientItem } from 'owa-mail-store';
export { ObservableMap };
import type ActionButtonData from 'txp-data/lib/schema/viewSchema/ActionButtonData';

const listViewDefaultStore: ListViewStore = {
    conversationItems: new ObservableMap<string, ConversationItem>({}),
    itemContextMenuState: null,
    selectedTableViewId: null,
    tableViewConversationRelations: new ObservableMap<string, TableViewConversationRelation>({}),
    tableViewItemRelations: new ObservableMap<string, TableViewItemRelation>({}),
    tableViews: new ObservableMap<string, TableView>({}),
    attachmentViewStates: new ObservableMap<string, AttachmentFullViewState>({}),
    expandedConversationViewState: {
        expandedRowKey: null,
        focusedNodeId: null,
        selectedNodeIds: [],
        allNodeIds: [],
        shouldBeExpanded: false,
        busStopStateMap: new ObservableMap<string, BusStopState>({}),
        forks: null,
    },
    rowAttachmentPreviewWellViews: new ObservableMap<string, AttachmentPreviewWellView>({}),
    focusedOtherDropViewState: null,
    couponPeekPreviews: new ObservableMap<string, string[]>({}),
    rowInfoForVLV: new ObservableMap<string, RowInfoForVLV>({}),
    meetingMessageItems: new ObservableMap<string, ClientItem>({}),
    offsetHeight: 0,
    scrollTop: 0,
    inboxPausedDateTime: null,
    inboxPausedLength: null,
    txpActionButtonData: new ObservableMap<string, ActionButtonData>({}),
    lastIndexToRender: 0,
    doNotVirtualize: false,
};

export let getStore = createStore<ListViewStore>('listview', listViewDefaultStore);
const listViewStore = getStore();

export default listViewStore;
