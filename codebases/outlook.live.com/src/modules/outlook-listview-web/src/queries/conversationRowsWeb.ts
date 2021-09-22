import type {
    ResolverContext,
    ConversationRowConnection,
    QueryConversationRowsArgs,
} from 'owa-graph-schema';
import { getFindConversationsRestrictionForPausedInbox } from '../utils/getFindConversationsRestrictionForPausedInbox';
import { getPagingType } from '../utils/getPagingType';
import { findConversation } from '../services/findConversation';
import handleServerResponseSuccessAndError from 'owa-service-utils/lib/handleServerResponseSuccessAndError';
import { mapFindConversationResponseMessageToGql } from 'owa-mail-conversation-row-gql-mappers';

export const conversationRowsWeb = async (
    parent: any,
    args: QueryConversationRowsArgs,
    context: ResolverContext,
    info: any
): Promise<ConversationRowConnection> => {
    const options = args.options;

    if (options.category && options.viewFilter != 'UserCategory') {
        throw new Error(
            'conversationRowsWeb: category should be set only for UserCategory view filter'
        );
    }

    let restriction;
    if (options.pausedInboxTime) {
        restriction = getFindConversationsRestrictionForPausedInbox(options.pausedInboxTime);
    }

    const paging = getPagingType(args.first, args.after, true);

    const response = await findConversation(
        options.commonRowsOptions.folderId,
        paging,
        options.viewFilter,
        options.commonRowsOptions.sortBy,
        options.focusedViewFilter,
        options.shape,
        options.commonRowsOptions.mailboxInfo,
        options.category,
        options.searchFolderId,
        restriction /* restriction required for static folders */,
        restriction /* refinerRestriction required for search folders*/,
        context.requestOptions
    );

    const responseBody = response.Body;
    return handleServerResponseSuccessAndError(responseBody).then(() => {
        return mapFindConversationResponseMessageToGql(responseBody);
    });
};
