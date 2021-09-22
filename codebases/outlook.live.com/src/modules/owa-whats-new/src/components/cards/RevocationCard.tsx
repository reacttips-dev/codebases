import { WhatsNewCardIdentity } from '../../store/schema/WhatsNewCardIdentity';
import type { WhatsNewCardProperty } from '../../store/schema/WhatsNewCardProperty';
import { logWhatsNewCardButtonClicked, logWhatsNewCardShown } from '../../utils/logDatapoint';
import { observer } from 'mobx-react-lite';
import WhatsNewActionLink from '../WhatsNewActionLink';
import { ControlIcons } from 'owa-control-icons';
import { isFeatureEnabled } from 'owa-feature-flags';
import loc, { formatToArray } from 'owa-localize';
import * as React from 'react';
import {
    whatsNew_Card_Revocation_Title,
    whatsNew_Card_Revocation_Body,
    whatsNew_Card_Revocation_Body_Placeholder,
    whatsNew_Card_Revocation_LearnMore_Button,
} from '../../strings.locstring.json';

const REVOCATION_MORE_INFO_URL = 'https://go.microsoft.com/fwlink/?linkid=2088427&clcid=0x409';

function onLearnMoreClicked(evt: React.MouseEvent<unknown>): void {
    evt.stopPropagation();

    // Log button click event
    logWhatsNewCardButtonClicked(WhatsNewCardIdentity.Revocation);
    window.open(REVOCATION_MORE_INFO_URL, '_blank');
}

export const RevocationCard = observer(function RevocationCard(props: {}) {
    React.useEffect(() => {
        logWhatsNewCardShown(WhatsNewCardIdentity.Revocation);
    }, []);

    const sentItemsBold = (
        <span style={{ fontWeight: 'bold' }}>{loc(whatsNew_Card_Revocation_Body_Placeholder)}</span>
    );
    return (
        <>
            <div tabIndex={0}>
                {formatToArray(loc(whatsNew_Card_Revocation_Body), sentItemsBold)}
            </div>
            <WhatsNewActionLink
                onClick={onLearnMoreClicked}
                whatsNewCardIdentity={WhatsNewCardIdentity.Revocation}
                whatsNewActionText={loc(whatsNew_Card_Revocation_LearnMore_Button)}
            />
        </>
    );
});

function revocationCardProps(): WhatsNewCardProperty {
    return {
        identity: WhatsNewCardIdentity.Revocation,
        title: loc(whatsNew_Card_Revocation_Title),
        iconName: ControlIcons.Undo,
        body: <RevocationCard />,
        isHidden: () => Promise.resolve(!isFeatureEnabled('rp-omeRevocation')),
    };
}

export default revocationCardProps;
