import type SmartResponseType from 'owa-service/lib/contract/SmartResponseType';
import type ItemInfoResponseMessage from 'owa-service/lib/contract/ItemInfoResponseMessage';
import type Message from 'owa-service/lib/contract/Message';
import { createItem } from 'owa-mail-create-item-service';
import createResponseFromModernGroupItem from 'owa-mail-store/lib/services/createResponseFromModernGroupItem';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import getDefaultBodyType from '../utils/getDefaultBodyType';
import { isFeatureEnabled } from 'owa-feature-flags';
import createItemViaGraphQL from '../utils/createItemViaGraphQL';

export default async function createSmartResponseItem(
    itemToSave: SmartResponseType,
    groupId: string,
    suppressServerMarkReadOnReplyOrForward: boolean,
    remoteExecute: boolean
): Promise<Message> {
    const timeFormat = getUserConfiguration().UserOptions.TimeFormat;
    const bodyType = itemToSave.NewBodyContent?.BodyType || getDefaultBodyType();
    itemToSave.ShouldIgnoreChangeKey = isFeatureEnabled('mon-cmp-experimentalGraphQLCompose')
        ? true
        : undefined;
    try {
        const response = groupId
            ? await createResponseFromModernGroupItem(
                  groupId,
                  itemToSave,
                  bodyType,
                  false /*isSend*/,
                  timeFormat
              )
            : isFeatureEnabled('mon-cmp-experimentalGraphQLCompose')
            ? await createItemViaGraphQL(
                  itemToSave,
                  false /* isSend */,
                  undefined,
                  suppressServerMarkReadOnReplyOrForward
              )
            : await createItem(
                  itemToSave,
                  bodyType,
                  false /*isSend*/,
                  timeFormat,
                  false /* isInlineCompose */,
                  null /* IRMData */,
                  null /*folderId*/,
                  remoteExecute,
                  suppressServerMarkReadOnReplyOrForward
              );

        const responseMessage = response.ResponseMessages.Items[0] as ItemInfoResponseMessage;
        return responseMessage.ResponseClass === 'Success' ? responseMessage.Items[0] : null;
    } catch {
        return null;
    }
}
