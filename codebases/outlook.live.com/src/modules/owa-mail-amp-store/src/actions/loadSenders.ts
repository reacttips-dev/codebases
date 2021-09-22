import { makeGetRequest } from 'owa-ows-gateway';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import updateAllowedSenders from './updateAllowedSenders';

interface AllowedSendersResponse {
    allowedSenders: string[];
}

const AMP_SENDERS_API_URL = 'ows/beta/Amp/GetAllowedSenders';

export default async function loadSenders() {
    if (isConsumer()) {
        const res = (await makeGetRequest(AMP_SENDERS_API_URL)) as AllowedSendersResponse;
        if (res.allowedSenders) {
            updateAllowedSenders(res.allowedSenders);
        }
    }

    return Promise.resolve();
}
