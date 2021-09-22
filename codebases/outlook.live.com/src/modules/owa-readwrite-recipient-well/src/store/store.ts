import { createStore } from 'satcheljs';
import type ReadWriteRecipientWellStore from './schema/ReadWriteRecipientWellStore';
import '../orchestrators/removePersonaFromWellOrchestrator';
import '../orchestrators/removeRecipientsFromRecipientWellsOrchestrator';
import '../orchestrators/addRecipientsToRecipientWellOrchestrator';
import '../orchestrators/updatePendingRequestOrchestrator';

var initialReadWriteRecipientWellStore: ReadWriteRecipientWellStore = {
    pendingFindPeopleRequests: 0,
};
var store = createStore<ReadWriteRecipientWellStore>(
    'readwriterecipientwell',
    initialReadWriteRecipientWellStore
)();

export default store;
