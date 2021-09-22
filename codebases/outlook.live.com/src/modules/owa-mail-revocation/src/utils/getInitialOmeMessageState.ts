import getParsedOmeMessageStatus from './getParsedOmeMessageStatus';
import type OmeMessageState from '../store/schema/OmeMessageState';
import { isFeatureEnabled } from 'owa-feature-flags';
import type ClientItem from 'owa-mail-store/lib/store/schema/ClientItem';
import getExtendedPropertyValue from 'owa-mail-store/lib/utils/getExtendedPropertyValue';
import type Message from 'owa-service/lib/contract/Message';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';

const OME_MESSAGE_STATE_PROPERTY_NAME = 'x-ms-exchange-organization-ome-messagestate';
export const revocationFeatureName: any = 'rp-omeRevocation';
export const sentItemsFolder: string = 'sentitems';

export default function getInitialOmeMessageState(message: Message | ClientItem): OmeMessageState {
    if (
        !isFeatureEnabled(revocationFeatureName) ||
        (message?.ParentFolderId && message.ParentFolderId.Id !== folderNameToId(sentItemsFolder))
    ) {
        return null;
    }

    const omeMessageStateValue = getExtendedPropertyValue(
        message,
        null /*Tag*/,
        OME_MESSAGE_STATE_PROPERTY_NAME
    );

    return getParsedOmeMessageStatus(omeMessageStateValue);
}
