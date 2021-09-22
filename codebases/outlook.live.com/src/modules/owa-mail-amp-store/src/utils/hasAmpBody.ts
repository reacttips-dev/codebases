import { isStringNullOrWhiteSpace } from 'owa-localize';
import type Message from 'owa-service/lib/contract/Message';

export default function hasAmpBody(message: Message): boolean {
    return message && !isStringNullOrWhiteSpace(message.AmpHtmlBody);
}
