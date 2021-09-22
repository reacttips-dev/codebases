import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { Link, ILinkProps } from '@fluentui/react/lib/Link';
import type { WhatsNewCardIdentity } from '../store/schema/WhatsNewCardIdentity';

import styles from './WhatsNewFluentCard.scss';

export interface WhatsNewActionLinkProps extends ILinkProps {
    whatsNewCardIdentity: WhatsNewCardIdentity;
    whatsNewActionText: string;
}

export default observer(function WhatsNewActionLink(props: WhatsNewActionLinkProps) {
    const id = `${props.whatsNewCardIdentity}Link`;
    const labelledByIdRef = `${id} ${props.whatsNewCardIdentity}`;

    return (
        <Link
            href={'javascript:void(0);'}
            onClick={props.onClick}
            className={props.className ?? styles.whatsNewCardCallToAction}
            id={id}
            aria-labelledby={labelledByIdRef}>
            {props.whatsNewActionText}
        </Link>
    );
});
