import { format } from 'owa-localize';
import type AddEntityFeedbackJsonRequest from 'owa-service/lib/contract/AddEntityFeedbackJsonRequest';
import type AddEntityFeedbackJsonResponse from 'owa-service/lib/contract/AddEntityFeedbackJsonResponse';
import addEntityFeedbackOperation from 'owa-service/lib/operation/addEntityFeedbackOperation';
import addEntityFeedbackRequestFactory from 'owa-service/lib/factory/addEntityFeedbackRequest';
import type AddEntityFeedbackResponseMessage from 'owa-service/lib/contract/AddEntityFeedbackResponseMessage';
import type EntityFeedbackEntry from 'owa-service/lib/contract/EntityFeedbackEntry';

import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import { trace } from 'owa-trace';

/**
 * Calls add entity feeback action
 * @param entityEntries: The list of entity feedback to submit
 */
export function addEntityFeedback(entityEntries: EntityFeedbackEntry[]): Promise<void> {
    let requestBody = addEntityFeedbackRequestFactory({ EntityFeedbackEntries: entityEntries });

    return addEntityFeedbackOperation(<AddEntityFeedbackJsonRequest>{
        Header: getJsonRequestHeader(),
        Body: requestBody,
    }).then(response => {
        processAddEntityResponse(response);
    });
}

/**
 * Process addEntity response.
 * @param response the resquest response
 */
function processAddEntityResponse(response: AddEntityFeedbackJsonResponse) {
    if (response?.Body) {
        let responseMessage: AddEntityFeedbackResponseMessage = response.Body;
        trace.info(format('addEntityFeedback Error count: {0}', responseMessage.ErrorCount));
        trace.info(format('addEntityFeedback error details: {0}', responseMessage.ErrorDetails));
    }
}
