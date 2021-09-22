import type { WhatsNewCardIdentity } from '../store/schema/WhatsNewCardIdentity';
import { WhatsNewCardStatus } from '../store/schema/WhatsNewCardStatus';
import { WhatsNewCardType } from '../store/schema/WhatsNewCardType';
import type { WhatsNewCardState } from '../store/schema/WhatsNewCardState';
import { getQueryStringParameter } from 'owa-querystring';

const TypeQueryParamName = 'type';
const AutoExpandQueryParamName = 'expand';

export async function getWhatsNewCardsFromQueryString(
    whatsNewQueryParamValue: WhatsNewCardIdentity
): Promise<WhatsNewCardState[]> {
    let typeQueryParamValue = WhatsNewCardType.Free;
    let autoExpandQueryParamValue = false;

    const typeQueryParamValueOverride = getQueryStringParameter(TypeQueryParamName);

    if (typeQueryParamValueOverride) {
        typeQueryParamValue = <WhatsNewCardType>typeQueryParamValueOverride;
    }

    const autoExpandQueryParamValueOverride = getQueryStringParameter(AutoExpandQueryParamName);

    if (autoExpandQueryParamValueOverride) {
        autoExpandQueryParamValue = !!autoExpandQueryParamValueOverride;
    }

    return Promise.resolve([
        {
            identity: whatsNewQueryParamValue,
            status: WhatsNewCardStatus.Unread,
            readCount: 0,
            featureType: typeQueryParamValue,
            autoExpandFlexPane: autoExpandQueryParamValue,
            isHovered: false,
            isExpanded: false,
        },
    ]);
}
