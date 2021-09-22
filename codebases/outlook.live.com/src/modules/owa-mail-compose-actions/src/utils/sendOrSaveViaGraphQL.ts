import {
    SaveDraftDocument,
    SaveDraftMutation,
} from '../graphql/__generated__/SaveDraftMutation.interface';
import {
    SaveSmartReplyDocument,
    SaveSmartReplyMutation,
} from '../graphql/__generated__/SaveSmartReplyMutation.interface';
import {
    SendDraftDocument,
    SendDraftMutation,
} from '../graphql/__generated__/SendDraftMutation.interface';
import {
    SendSmartReplyDocument,
    SendSmartReplyMutation,
} from '../graphql/__generated__/SendSmartReplyMutation.interface';
import type { SendOrSaveDraftResult } from 'owa-graph-schema';
import { getApolloClient } from 'owa-apollo';
import type { ComposeViewState } from 'owa-mail-compose-store';
import type Message from 'owa-service/lib/contract/Message';
import type SmartResponseType from 'owa-service/lib/contract/SmartResponseType';
import buildGraphQLDraftInput from './buildGraphQLDraftInput';
import type UpdateItemResponse from 'owa-service/lib/contract/UpdateItemResponse';
import type UpdateItemResponseMessage from 'owa-service/lib/contract/UpdateItemResponseMessage';

export default async function sendOrSaveViaGraphQL(
    messageType: Message | SmartResponseType,
    isSend: boolean,
    viewState: ComposeViewState
): Promise<UpdateItemResponse> {
    const client = getApolloClient();
    const graphQLDraft = buildGraphQLDraftInput(messageType, viewState);
    const mutateResult = await client.mutate({
        variables: {
            draft: graphQLDraft,
            itemId: viewState.itemId,
            requestIMIOnly: viewState.isInlineCompose,
        },
        mutation: getMutationDocument(isSend, viewState.useSmartResponse),
    });
    const mutationResult = getDraftDataFromResult(
        mutateResult.data,
        isSend,
        viewState.useSmartResponse
    );
    const draftData: UpdateItemResponseMessage = {
        Items: !!mutationResult.draft
            ? [
                  {
                      ...mutationResult.draft,
                  },
              ]
            : null,
        ResponseClass: 'Success',
    };
    return {
        ResponseMessages: {
            Items: [draftData],
        },
    };
}

function getMutationDocument(isSend: boolean, useSmartResponse: boolean) {
    if (isSend) {
        return useSmartResponse ? SendSmartReplyDocument : SendDraftDocument;
    } else {
        return useSmartResponse ? SaveSmartReplyDocument : SaveDraftDocument;
    }
}

function getDraftDataFromResult(
    result: SendSmartReplyMutation | SendDraftMutation | SaveSmartReplyMutation | SaveDraftMutation,
    isSend: boolean,
    useSmartResponse: boolean
): SendOrSaveDraftResult {
    if (isSend) {
        return useSmartResponse
            ? (result as SendSmartReplyMutation).sendSmartReply
            : (result as SendDraftMutation).sendDraft;
    } else {
        return useSmartResponse
            ? (result as SaveSmartReplyMutation).saveSmartReply
            : (result as SaveDraftMutation).saveDraft;
    }
}
