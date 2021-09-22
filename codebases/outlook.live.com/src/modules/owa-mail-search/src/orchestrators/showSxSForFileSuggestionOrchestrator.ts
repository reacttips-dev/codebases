import { showSxSForFileSuggestion } from '../actions/internalActions';
import { AttachmentFileType } from 'owa-attachment-file-types';
import initializeAttachmentFullViewState from 'owa-attachment-full-data/lib/actions/initialization/initializeAttachmentFullViewState';
import { AttachmentSelectionSource } from 'owa-attachment-data';
import getWacInfoForSharePointLink from 'owa-attachment-wac/lib/utils/getWacInfoForSharePointLink';
import { convertRestIdToEwsId } from 'owa-identifiers';
import { lazyEvaluateSafeLink } from 'owa-safelinks-evaluator';
import { lazyCreateAttachmentViewState } from 'owa-attachment-well-data';
import { ClientItemId, getUserMailboxInfo, ClientAttachmentId } from 'owa-client-ids';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import type { FileSuggestion } from 'owa-search-service';
import type ReferenceAttachment from 'owa-service/lib/contract/ReferenceAttachment';
import { lazyActivateTab, primaryTab } from 'owa-tab-store';
import { orchestrator } from 'satcheljs';
import { lazyAddAndInitializeAttachments, lazyGetAttachment } from 'owa-attachment-model-store';
import { TypeOfAttachment } from 'owa-attachment-type';
import {
    lazyPreviewAttachmentInSxS,
    lazyPreviewLinkInSxS,
    SxSReadingPaneInitializeMethod,
} from 'owa-attachment-preview-sxs-actions';

orchestrator(showSxSForFileSuggestion, async actionMessage => {
    const suggestion = actionMessage.suggestion;

    const conversationId: ClientItemId = {
        Id: suggestion.ConversationId,
        mailboxInfo: getUserMailboxInfo(),
    };

    const itemId: ClientItemId = {
        Id: suggestion.ItemId,
        mailboxInfo: getUserMailboxInfo(),
    };

    if (
        suggestion.FileSuggestionType == 'ODSP file' ||
        suggestion.FileSuggestionType == 'Link attachment'
    ) {
        await showSxSForLinkOrODSPSuggestion(suggestion, itemId, conversationId);
    } else {
        await showSxSForAttachmentSuggestion(suggestion, itemId, conversationId);
    }
});

async function showSxSForLinkOrODSPSuggestion(
    suggestion: FileSuggestion,
    itemId: ClientItemId,
    conversationId: ClientItemId
) {
    const instrumentationContext = <InstrumentationContext>{
        referenceKey: suggestion.ReferenceId,
        index: -1, // the item is not the the list view table
        traceId: getScenarioStore(SearchScenarioId.Mail).latestQFTraceId,
    };

    // Switch to primary tab immediately
    await lazyActivateTab.importAndExecute(primaryTab);

    const url = (suggestion.AttachmentType as ReferenceAttachment).AttachLongPathName;

    lazyPreviewLinkInSxS.importAndExecute(
        async () => {
            const evaluateSafeLink = await lazyEvaluateSafeLink.import();
            const safeLinkEvaluateResult = await evaluateSafeLink(url);
            return getWacInfoForSharePointLink(
                safeLinkEvaluateResult,
                true // shouldGrantAccess since the user has clicked the link to open it
            );
        },
        itemId,
        AttachmentSelectionSource.FileSuggestion,
        conversationId.Id
            ? {
                  method: SxSReadingPaneInitializeMethod.LoadConversationReadingPane,
                  conversationId,
                  conversationSubject: suggestion.Subject,
                  conversationCategories: [],
                  itemIdToScrollTo: itemId.Id,
              }
            : {
                  method: SxSReadingPaneInitializeMethod.NoOp,
              },
        instrumentationContext,
        null /* linkId */,
        null /* readOnly */,
        window,
        suggestion.FileName,
        url
    );
}

async function showSxSForAttachmentSuggestion(
    suggestion: FileSuggestion,
    itemId: ClientItemId,
    conversationId: ClientItemId
) {
    // ID is in REST format and needs to be converted to EWS format
    const ewsAttachementId = convertRestIdToEwsId(suggestion.AttachmentId);

    const attachmentId: ClientAttachmentId = {
        Id: ewsAttachementId,
        mailboxInfo: getUserMailboxInfo(),
    };

    const createAttachmentViewState = await lazyCreateAttachmentViewState.import();
    const getAttachment = await lazyGetAttachment.import();
    const addAndInitializeAttachmentModels = await lazyAddAndInitializeAttachments.import();

    // Initialize store ViewState and Data for modern attachment items
    // in the broader attachments store
    addAndInitializeAttachmentModels(
        [
            {
                attachmentId: attachmentId,
                attachment: suggestion.AttachmentType,
            },
        ],
        true /* isReadOnly */
    );

    const attachment = getAttachment(attachmentId);

    const attachmentViewState = createAttachmentViewState(
        attachmentId,
        true, // isReadOnly
        true, // uploadCompleted
        attachment.type === TypeOfAttachment.Reference,
        AttachmentFileType.MailSearchFileSuggestion
    );

    initializeAttachmentFullViewState(
        attachmentViewState,
        attachment,
        false /* treatLinksAsAttachments */,
        attachmentViewState.strategy.supportedMenuActions
    );

    const instrumentationContext = <InstrumentationContext>{
        referenceKey: suggestion.ReferenceId,
        index: -1, // the item is not the the list view table
        traceId: getScenarioStore(SearchScenarioId.Mail).latestQFTraceId,
    };

    // Switch to primary tab immediately
    await lazyActivateTab.importAndExecute(primaryTab);

    lazyPreviewAttachmentInSxS.importAndExecute(
        attachmentViewState,
        itemId,
        false,
        false,
        AttachmentSelectionSource.FileSuggestion,
        null,
        {
            method: SxSReadingPaneInitializeMethod.LoadConversationReadingPane,
            conversationId,
            conversationSubject: suggestion.Subject,
            conversationCategories: [],
            itemIdToScrollTo: itemId.Id,
        },
        instrumentationContext,
        window
    );
}
