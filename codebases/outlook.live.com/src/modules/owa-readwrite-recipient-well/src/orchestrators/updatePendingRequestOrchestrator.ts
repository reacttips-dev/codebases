import { addPendingRequest, removePendingRequest } from '../actions/updatePendingRequestActions';
import store from '../store/store';
import {
    lazyAddPendingRequestCorrelationId,
    lazyRemovePendingRequestCorrelationId,
} from 'owa-readwrite-recipient-well-internal-feedback';
import { orchestrator } from 'satcheljs';
import { isDogfoodEnv } from 'owa-metatags';

orchestrator(addPendingRequest, actionMessage => {
    store.pendingFindPeopleRequests++;
    if (isDogfoodEnv()) {
        lazyAddPendingRequestCorrelationId.importAndExecute(actionMessage.correlationId);
    }
});

orchestrator(removePendingRequest, actionMessage => {
    store.pendingFindPeopleRequests--;
    if (isDogfoodEnv()) {
        lazyRemovePendingRequestCorrelationId.importAndExecute(actionMessage.correlationId);
    }
});
