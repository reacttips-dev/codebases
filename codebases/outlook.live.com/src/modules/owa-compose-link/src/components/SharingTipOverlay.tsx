import {
    RefreshLinkInProgressText,
    LinkSuccessfullyRefreshedText,
} from './SharingTipOverlay.locstring.json';
import loc from 'owa-localize';
import { isExpirationTip } from '../utils/contextMenu/sharingTipContextMenuItem/isExpirationTip';
import { observer } from 'mobx-react-lite';
import { Icon } from '@fluentui/react/lib/Icon';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { ControlIcons } from 'owa-control-icons';
import { LinkActionStatus, setRefreshStatus, SharingLinkInfo } from 'owa-link-data';
import type { SharingTipInfo } from 'owa-sharing-data';
import { useWindowEvent } from 'owa-react-hooks/lib/useWindowEvent';
import * as React from 'react';

import styles from './SharingTipOverlay.scss';
import classNames from 'classnames';

export interface SharingTipsOverlayProps {
    sharingLinkInfo: SharingLinkInfo;
    sharingIssue: SharingTipInfo;
}

export const SharingTipOverlay = observer(function SharingTipOverlay(
    props: SharingTipsOverlayProps
) {
    //For now we only support overlays for expiration, but this should be a switch statement when we support actions for other tips.
    const refreshStatus: LinkActionStatus = props.sharingLinkInfo.linkActionStatus;

    // when the refresh was successful we show an overlay indicating this that fades out
    // after ~4 seconds. Since the link will still expire we reset the status to none.
    useWindowEvent(
        'transitionend',
        event => setRefreshStatus(props.sharingLinkInfo.linkId, LinkActionStatus.none),
        [props.sharingLinkInfo.linkId]
    );

    if (
        !isExpirationTip(props.sharingIssue.id) ||
        refreshStatus === LinkActionStatus.none ||
        refreshStatus === LinkActionStatus.refreshFailed
    ) {
        return null;
    }

    if (refreshStatus === LinkActionStatus.refreshing) {
        return (
            <div className={styles.overlay}>
                <Spinner className={styles.spinner} size={SpinnerSize.medium} />
                {loc(RefreshLinkInProgressText)}
            </div>
        );
    } else if (refreshStatus === LinkActionStatus.refreshSucceeded) {
        return (
            <div className={classNames(styles.overlay, styles.fadeOut)}>
                <Icon iconName={ControlIcons.CheckMark} className={styles.check} />
                {loc(LinkSuccessfullyRefreshedText)}
            </div>
        );
    }

    return null;
});
