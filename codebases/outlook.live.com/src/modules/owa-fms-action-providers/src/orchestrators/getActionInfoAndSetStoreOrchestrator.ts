import { orchestrator } from 'satcheljs';
import { getActionByFilter } from '../utils/getActionByFilter';
import { lazySetActionInfoState, getActionInfoAndSetStore } from 'owa-feedback-mitigation';

orchestrator(getActionInfoAndSetStore, async actionMessage => {
    const {
        alchemyId,
        bucketId,
        bucketTitle,
        bucketDescription,
        invokedBy,
        requestId,
        ruleId,
    } = actionMessage;
    const getAction = getActionByFilter(invokedBy, requestId, ruleId);
    await lazySetActionInfoState.importAndExecute({
        InvokedBy: invokedBy,
        RuleId: ruleId,
        AlchemyId: alchemyId,
        BucketId: bucketId,
        BucketTitle: bucketTitle,
        BucketDescription: bucketDescription,
        actionInfo: getAction,
        hideThankYouMessage: true,
    });
});
