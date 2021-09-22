import { noMessagePreview } from './getPreviewText.locstring.json';
import { sending } from 'owa-locstrings/lib/strings/sending.locstring.json';
import loc, { isStringNullOrWhiteSpace } from 'owa-localize';
import getAlternateBodyForIRM from 'owa-mail-reading-pane-store/lib/utils/getAlternateBodyForIRM';
import type { ClientMessage } from 'owa-mail-store';

export default function getPreviewText(
    message: ClientMessage,
    isNodePending: boolean,
    defaultIfEmpty: boolean
): string {
    const alternateBodyForIRM = getAlternateBodyForIRM(message.RightsManagementLicenseData);
    const messagePreview =
        isStringNullOrWhiteSpace(message.Preview) && defaultIfEmpty
            ? loc(noMessagePreview)
            : message.Preview;

    return (isNodePending && loc(sending)) || alternateBodyForIRM || messagePreview;
}
