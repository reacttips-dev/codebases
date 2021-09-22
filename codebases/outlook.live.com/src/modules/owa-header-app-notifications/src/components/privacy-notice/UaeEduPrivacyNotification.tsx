import { lighted, LightningProps, Lightable } from 'owa-lightning-v2';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import loc from 'owa-localize';
import { IconButton, ActionButton } from '@fluentui/react/lib/Button';
import { Icon } from '@fluentui/react/lib/Icon';
import { ControlIcons } from 'owa-control-icons';
import {
    privacyNoticeTitle,
    privacyNoticeBody,
    privacyNoticeLearnMoreButton,
} from './UaeEduPrivacyNotification.locstring.json';

import Styles from './UaeEduPrivacyNotification.scss';

export const UaeEduPrivacyNotification = observer(function UaeEduPrivacyNotification(
    props: LightningProps
) {
    const onLearnMore = React.useCallback(
        evt => {
            window.open('https://privacy.microsoft.com/privacystatement', '_blank');
            lighted(props.lid);
        },
        [props.lid]
    );
    const onDismiss = React.useCallback(evt => lighted(props.lid), [props.lid]);

    return (
        <Lightable {...props}>
            <div className={Styles.privacyNotice}>
                <Icon className={Styles.privacyNoticeIcon} iconName={ControlIcons.Info} />
                <div className={Styles.description}>
                    <div className={Styles.header}>{loc(privacyNoticeTitle)}</div>
                    <div className={Styles.body}>{loc(privacyNoticeBody)}</div>
                    <ActionButton
                        text={loc(privacyNoticeLearnMoreButton)}
                        className={Styles.learnMoreButton}
                        onClick={onLearnMore}
                    />
                </div>
            </div>
            <IconButton
                className={Styles.closeButton}
                iconProps={{
                    iconName: ControlIcons.Cancel,
                }}
                styles={{
                    root: Styles.closeButtonIcon,
                }}
                onClick={onDismiss}
            />
        </Lightable>
    );
});
