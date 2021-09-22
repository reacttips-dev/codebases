import { format } from 'owa-localize';
import getAllAttachmentIds from '../utils/getAllAttachmentIds';
import addInfoBarMessage from 'owa-info-bar/lib/actions/addInfoBarMessage';
import assignWith from 'lodash-es/assignWith';
import type { ComposeViewState } from 'owa-mail-compose-store';
import type DlpPolicyMatchDetail from 'owa-service/lib/contract/DlpPolicyMatchDetail';
import EvaluationResult from 'owa-service/lib/contract/EvaluationResult';
import EventTrigger from 'owa-service/lib/contract/EventTrigger';
import getDlpPolicyTipsOperation from 'owa-service/lib/operation/getDlpPolicyTipsOperation';
import type GetDlpPolicyTipsRequest from 'owa-service/lib/contract/GetDlpPolicyTipsRequest';
import type GetDlpPolicyTipsResponse from 'owa-service/lib/contract/GetDlpPolicyTipsResponse';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import OptimizationResult from 'owa-service/lib/contract/OptimizationResult';
import type PolicyMatchWrapper from 'owa-policy-tips/lib/store/schema/PolicyMatchWrapper';
import type PolicyTipCustomizedStrings from 'owa-service/lib/contract/PolicyTipCustomizedStrings';
import type PolicyTipsViewState from 'owa-policy-tips/lib/store/schema/PolicyTipsViewState';
import removeInfoBarMessage from 'owa-info-bar/lib/actions/removeInfoBarMessage';
import { action } from 'satcheljs/lib/legacy';
import type { ClientAttachmentId } from 'owa-client-ids';

import { getAllRecipients } from '../utils/getAllRecipientsAsEmailAddressStrings';
import { getHighestPriorityPolicyTipMatchDetail } from 'owa-policy-tips/lib/utils/getHighestPriorityPolicyTipMatchDetail';
import { trace } from 'owa-trace';

const triggerPolicyTips = action('triggerPolicyTips')(function triggerPolicyTips(
    composeViewState: ComposeViewState,
    eventTrigger: EventTrigger,
    subjectChecksum?: number,
    contentChecksum?: number,
    attachmentIds?: ClientAttachmentId[]
) {
    const policyTipsViewState = composeViewState.policyTipsViewState;

    if (policyTipsViewState.handlerDisabled || composeViewState.protectionViewState?.IRMData) {
        return;
    }

    const { inProgressPolicyMatch, succeededPolicyMatch, pendingPolicyMatch } = policyTipsViewState;

    if (!subjectChecksum) {
        subjectChecksum = getCheckSum(composeViewState.subject);
    }

    if (!contentChecksum) {
        contentChecksum = getCheckSum(composeViewState.content);
    }

    if (!attachmentIds) {
        attachmentIds = getAllAttachmentIds(composeViewState);
    }

    if (!policyTipsViewState.isRequestInProgress) {
        policyTipsViewState.pendingRequests = false;
        inProgressPolicyMatch.itemId = composeViewState.itemId;
        inProgressPolicyMatch.subjectChecksum = subjectChecksum;
        inProgressPolicyMatch.contentChecksum = contentChecksum;
        inProgressPolicyMatch.eventTrigger = eventTrigger;
        inProgressPolicyMatch.attachmentIds = attachmentIds;

        if (isEmptyContent(inProgressPolicyMatch)) {
            succeededPolicyMatch.policyMatchDetails = [];
            succeededPolicyMatch.subjectChecksum = 0;
            succeededPolicyMatch.contentChecksum = 0;
            succeededPolicyMatch.attachmentIds = [];
            removeInfoBarMessage(composeViewState, 'dlpPolicyTips');
            return;
        }

        // Send server request only when body or subject, attachment, or recipient well is changed
        if (
            isBodyOrSubjectChanged(inProgressPolicyMatch, succeededPolicyMatch) ||
            isAttachmentChanged(inProgressPolicyMatch, succeededPolicyMatch) ||
            eventTrigger == EventTrigger.RecipientWell
        ) {
            getPolicyTipsData(composeViewState);
        }
    } else {
        policyTipsViewState.pendingRequests = true;
        pendingPolicyMatch.itemId = composeViewState.itemId;
        pendingPolicyMatch.subjectChecksum = subjectChecksum;
        pendingPolicyMatch.contentChecksum = contentChecksum;
        pendingPolicyMatch.eventTrigger = eventTrigger;
        pendingPolicyMatch.attachmentIds = attachmentIds;
    }
});

export default triggerPolicyTips;

function getPolicyTipsData(composeViewState: ComposeViewState) {
    const { succeededPolicyMatch, inProgressPolicyMatch } = composeViewState.policyTipsViewState;
    const itemId = composeViewState.itemId;

    if (itemId?.Id) {
        const requestObject: GetDlpPolicyTipsRequest = {
            ItemId: itemId,
            ClientSupportsScanResultData: true,
            ScanResultData: succeededPolicyMatch.scanResultData,
            ScanResultMetadata: succeededPolicyMatch.scanResultMetaData,
            BodyOrSubjectChanged: isBodyOrSubjectChanged(
                inProgressPolicyMatch,
                succeededPolicyMatch
            ),
            NeedToReclassify: !succeededPolicyMatch.itemId,
            CustomizedStringsNeeded: true,
            Recipients: getAllRecipients(composeViewState),
            EventTrigger: inProgressPolicyMatch.eventTrigger,
        };

        composeViewState.policyTipsViewState.isRequestInProgress = true;
        getDlpPolicyTipsOperation(requestObject).then(response => {
            handleGetPolicyTipsResponse(
                response,
                composeViewState,
                onGetDlpPolicyTipsSucceeded,
                onGetDlpPolicyTipsFailed
            );
        });
    }
}

function handleGetPolicyTipsResponse(
    response: GetDlpPolicyTipsResponse,
    composeViewState: ComposeViewState,
    succeededCallback: (
        composeViewState: ComposeViewState,
        response: GetDlpPolicyTipsResponse
    ) => void,
    failedCallback: (composeViewState: ComposeViewState, response: GetDlpPolicyTipsResponse) => void
) {
    const policyTipsViewState = composeViewState.policyTipsViewState;
    const pendingPolicyMatch = policyTipsViewState.pendingPolicyMatch;
    policyTipsViewState.isRequestInProgress = false;
    if (policyTipsViewState.pendingRequests && pendingPolicyMatch) {
        triggerPolicyTips(
            composeViewState,
            pendingPolicyMatch.eventTrigger,
            pendingPolicyMatch.subjectChecksum,
            pendingPolicyMatch.contentChecksum,
            pendingPolicyMatch.attachmentIds
        );
    }

    if (
        response.EvaluationResult == EvaluationResult.Success ||
        response.OptimizationResult == OptimizationResult.NoRules ||
        response.EvaluationResult == EvaluationResult.ClientErrorNoContent
    ) {
        succeededCallback(composeViewState, response);
    } else {
        failedCallback(composeViewState, response);
    }
}

function onGetDlpPolicyTipsSucceeded(
    composeViewState: ComposeViewState,
    response: GetDlpPolicyTipsResponse
) {
    const policyTipsViewState = composeViewState.policyTipsViewState;
    const { succeededPolicyMatch, inProgressPolicyMatch } = policyTipsViewState;

    // Copy in progress data to succeeded data
    succeededPolicyMatch.itemId = inProgressPolicyMatch.itemId;
    succeededPolicyMatch.attachmentIds = inProgressPolicyMatch.attachmentIds;
    succeededPolicyMatch.subjectChecksum = inProgressPolicyMatch.subjectChecksum;
    succeededPolicyMatch.contentChecksum = inProgressPolicyMatch.contentChecksum;
    succeededPolicyMatch.policyMatchDetails = response.Matches;

    // If we're dealing with an older server it's possible that ScanResultData and DetectedClassificationIds are not present, so just ignore them in this case
    if (response.ScanResultData) {
        succeededPolicyMatch.scanResultData = response.ScanResultData;
    }

    // ScanResultMetadaData may not always be present, so just ignore it if that's the case
    if (response.ScanResultMetadata) {
        succeededPolicyMatch.scanResultMetaData = response.ScanResultMetadata;
    }

    // Stop sending further requests to server if optimization result is NoRules
    if (response.OptimizationResult == OptimizationResult.NoRules) {
        policyTipsViewState.handlerDisabled = true;
    }

    // If there are any customized strings, store them.
    updateCustomizedStrings(composeViewState, response.CustomizedStrings);

    updatePolicyTipMessage(composeViewState);
}

function onGetDlpPolicyTipsFailed(
    composeViewState: ComposeViewState,
    response: GetDlpPolicyTipsResponse
) {
    const policyTipsViewState = composeViewState.policyTipsViewState;
    if (response) {
        trace.warn(
            format(
                'PolicyTips failed with EvaluationResult code of: {0}',
                response.EvaluationResult
            ) +
                ' Diagnostic: ' +
                response.DiagnosticData
        );

        // With any of these error results, disable the PolicyTips handler for the remainder of the life of the current message
        if (
            response.EvaluationResult == EvaluationResult.PermanentError ||
            response.EvaluationResult == EvaluationResult.UnexpectedPermanentError ||
            response.EvaluationResult == EvaluationResult.ClientErrorInvalidStoreItemId ||
            response.EvaluationResult == EvaluationResult.NullOrganization ||
            response.EvaluationResult == EvaluationResult.ClientErrorInvalidClientScanResult
        ) {
            trace.warn('Disabling further PolicyTips requests because of the failure');
            policyTipsViewState.handlerDisabled = true;
        }
    } else {
        trace.warn('PolicyTipsResponse is null (PolicyTipsRequest is timed out)');
        policyTipsViewState.handlerDisabled = true;
    }

    removeInfoBarMessage(composeViewState, 'dlpPolicyTips');
}

export function updatePolicyTipMessage(viewState: ComposeViewState) {
    removeInfoBarMessage(viewState, ['consumerDlpPolicyTips', 'enterpriseDlpPolicyTips']);
    const matchDetail: DlpPolicyMatchDetail = getHighestPriorityPolicyTipMatchDetail(
        viewState.policyTipsViewState.succeededPolicyMatch
    );
    if (matchDetail) {
        if (isConsumer()) {
            addInfoBarMessage(viewState, 'consumerDlpPolicyTips');
        } else {
            addInfoBarMessage(viewState, 'enterpriseDlpPolicyTips');
        }
    }
}

function getCheckSum(text: string): number {
    let checkSum = 0;
    if (text) {
        for (let i = 0; i < text.length; i++) {
            checkSum += text.charCodeAt(i);
        }
    }

    return checkSum;
}

function isEmptyContent(policyMatchWrapper: PolicyMatchWrapper): boolean {
    return (
        policyMatchWrapper.subjectChecksum == 0 &&
        policyMatchWrapper.contentChecksum == 0 &&
        policyMatchWrapper.attachmentIds.length == 0
    );
}

function isBodyOrSubjectChanged(
    newPolicyMatchWrapper: PolicyMatchWrapper,
    oldPolicyMatchWrapper: PolicyMatchWrapper
): boolean {
    return (
        newPolicyMatchWrapper.subjectChecksum != oldPolicyMatchWrapper.subjectChecksum ||
        newPolicyMatchWrapper.contentChecksum != oldPolicyMatchWrapper.contentChecksum
    );
}

function isAttachmentChanged(
    newPolicyMatchWrapper: PolicyMatchWrapper,
    oldPolicyMatchWrapper: PolicyMatchWrapper
): boolean {
    if (newPolicyMatchWrapper.attachmentIds.length != oldPolicyMatchWrapper.attachmentIds.length) {
        return true;
    }

    for (let i = 0; i < newPolicyMatchWrapper.attachmentIds.length; i++) {
        if (
            newPolicyMatchWrapper.attachmentIds[i] != null &&
            oldPolicyMatchWrapper.attachmentIds[i] != null &&
            newPolicyMatchWrapper.attachmentIds[i].Id != oldPolicyMatchWrapper.attachmentIds[i].Id
        ) {
            return true;
        }
    }

    return false;
}

function updateCustomizedStrings(
    composeViewState: ComposeViewState,
    customStrings: PolicyTipCustomizedStrings
) {
    if (customStrings) {
        const policyTipsViewState = composeViewState.policyTipsViewState;
        const unpackedObj = <PolicyTipsViewState>{
            complianceUrl: customStrings.ComplianceURL,
            blockString: customStrings.PolicyTipMessageBlockString,
            notifyString: customStrings.PolicyTipMessageNotifyString,
            overrideString: customStrings.PolicyTipMessageOverrideString,
        };
        const customizer = (objValue, srcValue) => {
            return srcValue ? srcValue : objValue;
        };
        assignWith(policyTipsViewState, unpackedObj, customizer);
    }
}
