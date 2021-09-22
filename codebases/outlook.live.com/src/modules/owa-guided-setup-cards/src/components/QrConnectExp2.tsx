import * as React from 'react';
import { observer } from 'mobx-react-lite';
import {
    qrConnectExp2Header,
    qrConnectExp2Title,
    qrConnectGetQrCodeButton,
} from './QrConnect.locstring.json';
import {
    phoneImageAriaLabel,
    dismissButtonAriaLabel,
} from './GetOutlookMobileComponent.locstring.json';
import loc from 'owa-localize';
import * as phoneAppCardUtils from '../utils/phoneAppCardUtils';
import { PrimaryButton, IconButton } from '@fluentui/react/lib/Button';
import displayQrCode from '../utils/displayQrCode';
import { logUsage } from 'owa-analytics';
import type { OutlookMobileContainer } from '../utils/OutlookMobileContainer';
import isBusiness from 'owa-session-store/lib/utils/isBusiness';
import { ControlIcons } from 'owa-control-icons';
import { getMobileContainerName } from '../utils/getMobileContainerName';
import { getIsDarkTheme } from 'owa-fabric-theme';

import styles from './PhoneAppCard.scss';

export const QrConnectExp2 = observer(function QrConnectExp2(props: {
    containerName: OutlookMobileContainer;
    onDismissClick?: () => void;
}) {
    React.useEffect(() => {
        logUsage(
            'QrConnectExp2Load',
            { containerName: getMobileContainerName(props.containerName) },
            { isCore: true }
        );
    }, []);

    const onGetQrButtonClick = React.useCallback(() => {
        logUsage(
            'QrConnectExp2Click',
            { containerName: getMobileContainerName(props.containerName) },
            { isCore: true }
        );
        displayQrCode();
    }, []);

    return (
        <div>
            <div className={styles.phoneAppHeader}>
                <div className={styles.closeIconDiv}>
                    {isBusiness() && props.onDismissClick && (
                        <IconButton
                            className={styles.dismissButton}
                            iconProps={{
                                iconName: ControlIcons.ChromeClose,
                                styles: {
                                    root: styles.closeIcon,
                                },
                            }}
                            onClick={props.onDismissClick}
                            tabIndex={0}
                            aria-label={loc(dismissButtonAriaLabel)}
                        />
                    )}
                </div>
            </div>
            <div className={styles.qrConnectCenterFlexColumn}>
                <div className={styles.phoneAppCard}>
                    <div className={styles.phoneContainer}>
                        <img
                            aria-label={loc(phoneImageAriaLabel)}
                            src={
                                getIsDarkTheme()
                                    ? phoneAppCardUtils.qrCodeImageDark
                                    : phoneAppCardUtils.qrCodeImage
                            }
                        />
                    </div>
                </div>

                <div className={styles.phoneCardTitle}>{loc(qrConnectExp2Header)}</div>

                {loc(qrConnectExp2Title)}
                <div className={styles.getQrCodeButton}>
                    <PrimaryButton onClick={onGetQrButtonClick}>
                        {loc(qrConnectGetQrCodeButton)}
                    </PrimaryButton>
                </div>
            </div>
        </div>
    );
});
