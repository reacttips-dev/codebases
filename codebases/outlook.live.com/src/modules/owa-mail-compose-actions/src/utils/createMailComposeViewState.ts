import { createAddinViewState } from 'owa-editor-addin-plugin-types/lib/utils/createAddinViewState';
import { ComposeType } from 'owa-editor-addin-plugin-types/lib/utils/AddinViewState';
import convertInlineCssForHtml from './convertInlineCssForHtml';
import getFromViewState from './getFromViewState';
import createInfoBarHostViewState from 'owa-info-bar/lib/utils/createInfoBarHostViewState';
// tslint:disable-next-line:forbid-import
import { observable } from 'mobx';
import getAttachmentWellInitialValue from 'owa-attachment-well-data/lib/utils/getAttachmentWellInitialValue';
import createDropViewState from 'owa-dnd/lib/utils/createDropViewState';
import createProtectionViewState from 'owa-mail-protection/lib/utils/createProtectionViewState';
import { createCompositeEditorViewState } from 'owa-editor/lib/utils/createCompositeEditorViewState';
import createPolicyTipsViewState from 'owa-policy-tips/lib/utils/createPolicyTipsViewState';
import createRecipientWellInComposeViewState from './createRecipientWellInComposeViewState';
import { generateSmimeViewState } from 'owa-smime/lib/utils/createSmimeDefaultViewState';
import {
    ComposeViewState,
    AsyncSendState,
    UIEnabledState,
    ComposeOperation,
    MailComposeViewStateInitProps,
} from 'owa-mail-compose-store';
import { createSmartPillViewState } from 'owa-mail-smart-pill-features';
import createComposePluginViewState from './createComposePluginViewState';
import createAccCheckerViewState from 'owa-editor-acc-checker/lib/utils/createAccCheckerViewState';
import createPostOpenTasks from './createPostOpenTasks';
import getExpressionId from 'owa-expressions-store/lib/utils/getExpressionId';
import { getIsDarkTheme } from 'owa-fabric-theme';
import { createAugloopSession } from 'augloop-service/lib/utils/createAugloopSession';
import EditorScenarios from 'owa-editor/lib/store/schema/EditorScenarios';
import { getGuid } from 'owa-guid';
let nextComposeId = 0;

function getNextComposeId(): string {
    return (nextComposeId++).toString();
}

export default function createMailComposeViewState(
    props: MailComposeViewStateInitProps
): ComposeViewState {
    const {
        operation,
        bodyType,
        itemId,
        subject,
        newContent,
        to,
        cc,
        bcc,
        referenceItemId,
        referenceItemDocumentId,
        conversationId,
        importance,
        preferAsyncSend,
        from,
        pendingSocialActivityTags,
        IRMData,
        saveAndUpgrade,
        logTraceId,
        isReadReceiptRequested,
        isDeliveryReceiptRequested,
        meetingRequestItem,
        sensitivity,
        smimeViewState,
        existingLabelString,
        classification,
        smartDocOption,
        appendOnSend,
        draftComposeType,
    } = props;
    const isInlineCompose =
        props.isInlineCompose === undefined ? !!conversationId : props.isInlineCompose;
    // For consumer mailbox, we will not show CC for new and reply if there is no CC recipient; unless AlwaysShowBcc is true.
    const isRibbonShown = bodyType == 'HTML';

    // If we have newContent, append it to the top of the updatedContent so it's above the signature.
    const updatedContent = convertInlineCssForHtml(newContent, bodyType) || '';

    const composeId = getNextComposeId();
    const fromViewState = getFromViewState(from, meetingRequestItem, referenceItemId);

    // We should get rid of this observable.object call once #38650 is addressed
    const composeViewState: ComposeViewState = observable.object({
        // CompositeEditorViewState
        ...createCompositeEditorViewState(EditorScenarios.MailCompose, updatedContent, bodyType),

        // ComposePluginViewState
        ...createComposePluginViewState(pendingSocialActivityTags, isRibbonShown, isInlineCompose),

        // InfoBarHostViewState
        ...createInfoBarHostViewState(composeId),

        // Recipient well
        ...createRecipientWellInComposeViewState(to, cc, bcc, isInlineCompose),

        // Message properties
        operation: operation,

        // Fix 46674: Pasted inline image is lost in popout compose
        // Need to make sure viewstate property values are not undefined otherwise it will be dropped during serialization
        itemId: itemId || null,
        subject: subject || '',
        attachmentWell: getAttachmentWellInitialValue(
            false /*isReadOnly*/,
            false /*isInitialized*/,
            composeId
        ),
        referenceItemId: referenceItemId,
        referenceItemDocumentId: referenceItemDocumentId,
        importance: importance || 'Normal',
        fromViewState: fromViewState,
        policyTipsViewState: createPolicyTipsViewState(),
        meetingRequestItem: meetingRequestItem,
        isReadReceiptRequested: isReadReceiptRequested || false,
        isDeliveryReceiptRequested: isDeliveryReceiptRequested || false,
        virtualEditContent: null,
        linksContainerId: getGuid(),

        // UI properties
        isInlineCompose: isInlineCompose,
        conversationId: conversationId || null,
        lastSaveTimeStamp: null,
        isRibbonShown: isRibbonShown,
        isSending: false,
        isSavingSpinnerShown: false,
        showCompactRecipientWell: isInlineCompose && !fromViewState.isFromShown,
        dropViewState: createDropViewState(),
        showSendDiscardAsIcon: false,
        uiEnabledState: UIEnabledState.Enabled,
        smimeViewState: smimeViewState || generateSmimeViewState(),
        accChecker: createAccCheckerViewState(true /*useFlexPane*/),

        // UpConvert / Upgrade
        quotedBody: null,
        useSmartResponse: isInlineCompose || !!saveAndUpgrade,
        numberOfWaitingAttachments: 0,

        // Async send
        preferAsyncSend,
        asyncSendState: AsyncSendState.None,
        handledByDelaySend: false,
        changeAsyncSendStateTimer: 0,

        // Internal data, for multiple compose instance
        composeId,
        logTraceId,
        expressionId: getExpressionId(),

        // Message sensitivity
        sensitivity,

        // If the editor is in dark mode.
        isDarkMode: getIsDarkTheme(),

        // Initialize protection view state.
        protectionViewState: createProtectionViewState(
            existingLabelString,
            referenceItemId,
            classification,
            IRMData
        ),

        // Flag that tracks if the draft was manually saved at any point.
        isManuallySaved: false,

        smartPillViewState: createSmartPillViewState(smartDocOption),

        deferredSendTime: null,

        postOpenTasks: createPostOpenTasks(props),

        // Addins
        addin: createAddinViewState(
            appendOnSend,
            draftComposeType ? draftComposeType : getComposeOperation(operation)
        ),

        // Augloop
        augloopSession: createAugloopSession(),
    });

    return composeViewState;
}

function getComposeOperation(operation: ComposeOperation) {
    if (operation === ComposeOperation.Reply || operation === ComposeOperation.ReplyAll) {
        return ComposeType.Reply;
    } else if (operation === ComposeOperation.Forward) {
        return ComposeType.Forward;
    } else {
        return ComposeType.New;
    }
}
