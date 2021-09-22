import { webpushOverlayGuidance } from './AllowWebPushOverlay.locstring.json';
import loc from 'owa-localize';
import { dismissNotificationPermissionsOverlay } from '../actions/overlayActions';
import { observer } from 'mobx-react-lite';
import { Icon } from '@fluentui/react/lib/Icon';
import { Layer } from '@fluentui/react/lib/Layer';
import { Overlay } from '@fluentui/react/lib/Overlay';

import * as React from 'react';

import styles from './AllowWebPushOverlay.scss';

export const AllowWebPushOverlay = observer(function AllowWebPushOverlay(props: {}) {
    return (
        <Layer>
            <Overlay isDarkThemed={true} onClick={dismissNotificationPermissionsOverlay}>
                <div className={styles.guidance}>
                    <Icon iconName={'ChevronUp'} className={styles.chevron} />
                    <div className={styles.message}>{loc(webpushOverlayGuidance)}</div>
                </div>
            </Overlay>
            ,
        </Layer>
    );
});
