import { getWhatsNewCardsFromServer } from './getWhatsNewCardsFromServer';
import { getWhatsNewCardsFromQueryString } from './getWhatsNewCardsFromQueryString';
import { getQueryStringParameter } from 'owa-querystring';
import type { WhatsNewCardState } from '../store/schema/WhatsNewCardState';
import type { WhatsNewCardIdentity } from '../store/schema/WhatsNewCardIdentity';

const WhatsNewQueryParamName = 'whatsnew';

export async function getInitialWhatsNewCardStates(): Promise<WhatsNewCardState[]> {
    const whatsNewQueryParamValue = getQueryStringParameter(WhatsNewQueryParamName);

    if (whatsNewQueryParamValue) {
        return getWhatsNewCardsFromQueryString(<WhatsNewCardIdentity>whatsNewQueryParamValue);
    }

    return getWhatsNewCardsFromServer();
}
