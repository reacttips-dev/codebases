import {
    whatsNew_Card_Proofing_Premium_Body,
    whatsNew_Card_Proofing_Free_Body,
    whatsNew_Card_Proofing_Title,
} from '../../strings.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { observer } from 'mobx-react-lite';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import { isBrowserChrome, isBrowserEDGECHROMIUM } from 'owa-user-agent';
import { logWhatsNewCardShown } from '../../utils/logDatapoint';
import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { isPremiumConsumer } from 'owa-session-store';

import proofingStyles from './ProofingCards.scss';

const ProofingCard = observer(function ProofingCard(props: {
    identity: WhatsNewCardIdentity;
    bodyTextKey: string;
}) {
    React.useEffect(() => {
        logWhatsNewCardShown(props.identity);
    }, []);

    return <div>{loc(props.bodyTextKey)}</div>;
});

function getProofingCardProps(
    identity: WhatsNewCardIdentity,
    bodyTextKey: string
): WhatsNewCardProperty {
    return {
        identity: identity,
        title: loc(whatsNew_Card_Proofing_Title),
        svgIcon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0,0,2048,2048">
                <path d="M 922 1229 h 716 v 102 h -819 m -205 205 h 717 v 102 h -863 l 70 -25 m 1408 -691 v 102 h -820 l 103 -102 z" />
                <path d="M 1572 271 q 39 40 59 89 q 20 49 20 101 q 0 52 -20 102 q -20 50 -59 88 l -1017 1010 l -555 182 l 194 -574 l 999 -998 q 38 -38 88 -57 q 49 -19 101 -19 q 53 0 103 19 q 49 19 87 57 m -1236 1001 q 85 26 147 88 q 62 62 88 147 l 790 -790 l -235 -235 m -988 1224 l 345 -128 q -6 -42 -25 -79 q -19 -38 -47 -66 q -29 -29 -66 -48 q -38 -19 -80 -25 m 1235 -782 q 24 -24 36 -54 q 12 -31 12 -63 q 0 -33 -12 -63 q -13 -30 -35 -52 q -23 -23 -53 -36 q -31 -13 -66 -13 q -32 0 -63 12 q -31 11 -54 34 l -66 67 l 235 235 z" />
            </svg>
        ),
        svgIconStyle: proofingStyles.proofingIcon,
        body: <ProofingCard identity={identity} bodyTextKey={bodyTextKey} />,
        isHidden: () => Promise.resolve(!isBrowserSupportedForProofing()),
    };
}

export function proofingConsumerCard(): WhatsNewCardProperty {
    const isPremium = !isConsumer() || isPremiumConsumer();
    return getProofingCardProps(
        WhatsNewCardIdentity.ProofingConsumerFree,
        isPremium ? whatsNew_Card_Proofing_Premium_Body : whatsNew_Card_Proofing_Free_Body
    );
}

export function proofingBusinessCard(): WhatsNewCardProperty {
    return getProofingCardProps(
        WhatsNewCardIdentity.ProofingBusiness,
        whatsNew_Card_Proofing_Premium_Body
    );
}

function isBrowserSupportedForProofing() {
    return isBrowserChrome() || isBrowserEDGECHROMIUM();
}
