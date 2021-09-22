import { isStringNullOrWhiteSpace } from 'owa-localize';
import { isFeatureEnabled } from 'owa-feature-flags';

import type Message from 'owa-service/lib/contract/Message';

const MEETINGPOLL_MESSAGE_IDENTIFIER = 'findtime/vote?getrequesturl=';

export default function hasMeetingPoll(message: Message): boolean {
    if (!isFeatureEnabled('cal-mf-meetingPollCard') || !message) {
        return false;
    }

    let messageBody = null;
    if (message.UniqueBody) {
        messageBody = message.UniqueBody.Value;
    } else if (message.NormalizedBody) {
        messageBody = message.NormalizedBody.Value;
    }

    return (
        !isStringNullOrWhiteSpace(messageBody) &&
        messageBody.indexOf(MEETINGPOLL_MESSAGE_IDENTIFIER) > -1
    );
}
