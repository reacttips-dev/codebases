import { SubstrateSearchScenario } from 'owa-search-service';
import { lazyLogSearchEntityActions } from 'owa-search-instrumentation';
import { orchestrator } from 'satcheljs';
import { is3SServiceAvailable } from 'owa-search';
import { userMailInteractionAction } from 'owa-mail-actions';

orchestrator(userMailInteractionAction, actionMessage => {
    if (is3SServiceAvailable() && actionMessage.instrumentationContexts) {
        // Rank is an index + 1 denoting the position of current rows(s) being acted upon
        actionMessage.instrumentationContexts.forEach(instrumentationContext => {
            if (instrumentationContext) {
                lazyLogSearchEntityActions.importAndExecute(
                    SubstrateSearchScenario.Mail,
                    null,
                    null,
                    instrumentationContext.logicalId,
                    null /* traceId */,
                    instrumentationContext.referenceKey ||
                        (instrumentationContext.index + 1).toString(),
                    actionMessage.interactionType
                );
            }
        });
    }
});
