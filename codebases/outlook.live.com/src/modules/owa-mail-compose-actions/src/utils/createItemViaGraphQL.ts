import { CreateDraftDocument } from '../graphql/__generated__/CreateDraftMutation.interface';
import { getApolloClient } from 'owa-apollo';
import { ComposeViewState, ComposeOperation as ViewStateOperation } from 'owa-mail-compose-store';
import type Message from 'owa-service/lib/contract/Message';
import type SmartResponseType from 'owa-service/lib/contract/SmartResponseType';
import buildGraphQLDraftInput from './buildGraphQLDraftInput';
import type CreateItemResponse from 'owa-service/lib/contract/CreateItemResponse';
import type ItemInfoResponseMessage from 'owa-service/lib/contract/ItemInfoResponseMessage';

export default async function createItemViaGraphQL(
    messageType: Message | SmartResponseType,
    isSend: boolean,
    viewState?: ComposeViewState,
    suppressServerMarkReadOnReplyOrForward?: boolean
): Promise<CreateItemResponse> {
    const client = getApolloClient();
    const graphQLInput = buildGraphQLDraftInput(messageType, viewState);
    const result = await client.mutate({
        variables: {
            draft: graphQLInput,
            isSend,
            suppressServerMarkReadOnReplyOrForward: suppressServerMarkReadOnReplyOrForward,
            requestIMIOnly: !!viewState?.isInlineCompose,
        },
        mutation: CreateDraftDocument,
    });
    const draftData: ItemInfoResponseMessage = {
        Items: [
            {
                ...result.data.createDraft.draft,
            },
        ],
        ResponseClass: 'Success',
    };
    return {
        ResponseMessages: {
            Items: [draftData],
        },
    };
}

export function isSupportedOperation(operation: ViewStateOperation): boolean {
    switch (operation) {
        case ViewStateOperation.New:
        case ViewStateOperation.Reply:
        case ViewStateOperation.ReplyAll:
        case ViewStateOperation.Forward:
        case ViewStateOperation.EditDraft:
            return true;
        case ViewStateOperation.Approve:
        case ViewStateOperation.Reject:
            return false;
    }
}
