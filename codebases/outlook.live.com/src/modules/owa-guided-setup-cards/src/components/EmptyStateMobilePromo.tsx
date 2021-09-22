import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { GetOutlookMobileComponent } from './GetOutlookMobileComponent';
import { OutlookMobileContainer } from '../utils/OutlookMobileContainer';
import { updateUserOutlookClient } from '../services/updateUserOutlookClient';
import { owaDate } from 'owa-datetime';
import { getUserOutlookClientByType } from '../selectors/getUserOutlookClientByType';
import { OutlookClientsToUpdate } from '../utils/phoneAppCardUtils';
import { getClientVersion } from 'owa-config';
import { logUsage } from 'owa-analytics';
import { getMobileContainerName } from '../utils/getMobileContainerName';
import { setPhoneAppCardDismissState } from '../mutators/setPhoneAppCardDismissState';
import { QrConnectExp1 } from './QrConnectExp1';
import { QrConnectExp2 } from './QrConnectExp2';
import { isFeatureEnabled } from 'owa-feature-flags';

import styles from './PhoneAppCard.scss';
export const EmptyStateMobilePromo = observer(function EmptyStateMobilePromo(props: {
    containerName: OutlookMobileContainer;
    onComponentUnmount?: () => void;
}) {
    const onDimissClick = React.useCallback(() => {
        logUsage(
            'EmptyStateMobilePromoDismiss',
            { containerName: getMobileContainerName(props.containerName) },
            { isCore: true }
        );

        setPhoneAppCardDismissState(true);

        OutlookClientsToUpdate.forEach(clientType => {
            let userClient = getUserOutlookClientByType(clientType);
            if (userClient) {
                updateUserOutlookClient({
                    clientId: userClient.clientId,
                    clientType: userClient.clientType,
                    clientVersion: getClientVersion(),
                    mobilePromoDismissDate: owaDate(),
                });
            }
        });

        if (props.onComponentUnmount) {
            props.onComponentUnmount();
        }
    }, []);

    const renderEmptyStateExperiment = React.useCallback(() => {
        let shouldSkipFlights =
            props.containerName == OutlookMobileContainer.OpxHost ||
            props.containerName == OutlookMobileContainer.ExternalPartner;
        if (isFeatureEnabled('rp-emptyStateQrConnectExp1') && !shouldSkipFlights) {
            return (
                <QrConnectExp1 containerName={props.containerName} onDismissClick={onDimissClick} />
            );
        } else if (isFeatureEnabled('rp-emptyStateQrConnectExp2') && !shouldSkipFlights) {
            return (
                <QrConnectExp2 containerName={props.containerName} onDismissClick={onDimissClick} />
            );
        } else if (
            isFeatureEnabled('rp-emptyStatePhoneCardQrExp') ||
            isFeatureEnabled('rp-emptyStatePhoneCardExp') ||
            shouldSkipFlights
        ) {
            return (
                <GetOutlookMobileComponent
                    containerName={props.containerName}
                    onComponentUnmount={props.onComponentUnmount}
                    onDismissClick={onDimissClick}
                />
            );
        } else {
            return null;
        }
    }, []);

    return (
        <div className={styles.getOutlookMobileContainer}>
            <div className={styles.getOutlookMobileComponent}>{renderEmptyStateExperiment()}</div>
        </div>
    );
});
