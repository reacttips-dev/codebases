import getRespondSubject from './getRespondSubject';
import type { ComposeOperation } from 'owa-mail-compose-store';
import type Message from 'owa-service/lib/contract/Message';
import { lazyCreateMailResponseBodyContent } from 'owa-smime';

export default async function getQuotedBodyForSmimeItemReply(
    referenceItem: Message,
    composeOperation: ComposeOperation,
    isHtml: boolean
): Promise<string> {
    try {
        return (await lazyCreateMailResponseBodyContent.import())(
            referenceItem,
            isHtml,
            referenceItem.Subject || getRespondSubject(referenceItem, composeOperation)
        );
    } catch (error) {
        // TODO: show an infobar to the user #45790
        return '';
    }
}
