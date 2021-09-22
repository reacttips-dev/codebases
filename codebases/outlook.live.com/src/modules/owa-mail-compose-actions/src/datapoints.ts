import type { ReplyToMessageActionOptions } from './actions/replyToMessage';
import type { ComposeViewState } from 'owa-mail-compose-store';
import safelyGetSmartReplyExtractionId from './utils/safelyGetSmartReplyExtractionId';
import safelyGetStampedLanguage from './utils/safelyGetStampedLanguage';
import { isGroupScenario } from 'owa-mail-compose-store/lib/utils/isGroupComposeViewState';
import type Message from 'owa-service/lib/contract/Message';

export { ComposeOperation } from 'owa-mail-compose-store';

const MailComposeSendDp = 'MailComposeSend';

export { MailComposeSendDp };

export default {
    MailComposeReply: {
        name: 'MailComposeReply',
        options: {},
        customData: (options: ReplyToMessageActionOptions) => [
            options.actionSource,
            options.useFullCompose,
        ],
        actionSource: (options: ReplyToMessageActionOptions) => options.actionSource,
        cosmosOnlyData: (options: ReplyToMessageActionOptions) =>
            getReferenceIdFromItemOrItemId(options.referenceItemOrId),
    },
    MailComposeReplyAll: {
        name: 'MailComposeReplyAll',
        options: {},
        customData: (options: ReplyToMessageActionOptions) => [
            options.actionSource,
            options.useFullCompose,
        ],
        actionSource: (options: ReplyToMessageActionOptions) => options.actionSource,
        cosmosOnlyData: (options: ReplyToMessageActionOptions) =>
            getReferenceIdFromItemOrItemId(options.referenceItemOrId),
    },

    // MailComposeSendE2E captures all send relating javascript across all scenarios.
    // This includes async/sync/delayed send scenarios and is 100% javascript coverage.
    MailComposeSendE2E: {
        name: 'MailComposeSendE2E',
        customData: (viewState: ComposeViewState) => ({
            composeTraceId: viewState.logTraceId,
            operation: viewState.operation,
            isGroupScenario: isGroupScenario(viewState),
        }),
    },
    MailComposeSave: { name: 'MailComposeSave' },
    MailComposeUpConvert: { name: 'MailComposeUpConvert' },

    ComposeCommandDiscardCompose: {
        name: 'ComposeCommandDiscardCompose',
        customData: (viewState: ComposeViewState) => ({
            composeTraceId: viewState.logTraceId,
            messageLanguage: safelyGetStampedLanguage(viewState),
        }),
        options: {
            // TODO: 36033 Re-enable sampling after smart reply experiment
            isCore: true,
        },
        cosmosOnlyData: (viewState: ComposeViewState) => {
            return JSON.stringify({
                smartReplyExtractionId: safelyGetSmartReplyExtractionId(
                    viewState,
                    'smartReply' /* type */
                ),
                smartDocExtractionId: safelyGetSmartReplyExtractionId(
                    viewState,
                    'smartDoc' /* type */
                ),
            });
        },
    },
};

export function getReferenceIdFromItemOrItemId(referenceItemOrId: Message | string): string {
    return typeof referenceItemOrId === 'string' ? referenceItemOrId : referenceItemOrId.ItemId.Id;
}
