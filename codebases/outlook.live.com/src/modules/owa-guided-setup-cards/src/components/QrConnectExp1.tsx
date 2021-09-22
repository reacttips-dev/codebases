import * as React from 'react';
import { observer } from 'mobx-react-lite';
import {
    qrConnectExp1Header,
    qrConnectExp1Title,
    qrConnectGetQrCodeButton,
} from './QrConnect.locstring.json';
import {
    phoneImageAriaLabel,
    dismissButtonAriaLabel,
} from './GetOutlookMobileComponent.locstring.json';
import loc from 'owa-localize';
import { getIsDarkTheme } from 'owa-fabric-theme';
import * as phoneAppCardUtils from '../utils/phoneAppCardUtils';
import { PrimaryButton, IconButton } from '@fluentui/react/lib/Button';
import displayQrCode from '../utils/displayQrCode';
import { logUsage } from 'owa-analytics';
import type { OutlookMobileContainer } from '../utils/OutlookMobileContainer';
import isBusiness from 'owa-session-store/lib/utils/isBusiness';
import { ControlIcons } from 'owa-control-icons';
import { getMobileContainerName } from '../utils/getMobileContainerName';

import styles from './PhoneAppCard.scss';

export const QrConnectExp1 = observer(function QrConnectExp1(props: {
    containerName: OutlookMobileContainer;
    onDismissClick?: () => void;
}) {
    React.useEffect(() => {
        logUsage(
            'QrConnectExp1Load',
            { containerName: getMobileContainerName(props.containerName) },
            { isCore: true }
        );
    }, []);

    const onGetQrButtonClick = React.useCallback(() => {
        logUsage(
            'QrConnectExp1Click',
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
                <div className={styles.phoneCardTitle}>{loc(qrConnectExp1Header)}</div>

                {loc(qrConnectExp1Title)}
                <div className={styles.getQrCodeButton}>
                    <PrimaryButton onClick={onGetQrButtonClick}>
                        {loc(qrConnectGetQrCodeButton)}
                    </PrimaryButton>
                </div>
            </div>
            <div className={styles.phoneAppCard}>
                <div className={styles.phoneContainer}>
                    <img
                        aria-label={loc(phoneImageAriaLabel)}
                        className={styles.outlookMobileApps}
                        src={
                            getIsDarkTheme()
                                ? phoneAppCardUtils.outlookMobileAppsDarkTheme
                                : phoneAppCardUtils.outlookMobileApps
                        }
                    />
                    <div className={styles.phoneGradient} />
                </div>
            </div>
        </div>
    );
});
