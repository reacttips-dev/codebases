import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { PrimaryButton, IconButton } from '@fluentui/react/lib/Button';
import { ControlIcons } from 'owa-control-icons';
import { sendLocalizedTextMessage } from '../actions/sendLocalizedTextMessage';
import * as phoneAppCardUtils from '../utils/phoneAppCardUtils';
import { getIsDarkTheme } from 'owa-fabric-theme';
import { logUsage } from 'owa-analytics';
import { OutlookMobileContainer } from '../utils/OutlookMobileContainer';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getGuid } from 'owa-guid';
import {
    headerBusiness,
    headerConsumer,
    titleBusiness,
    titleConsumer,
    smsTextPlaceHolder,
    mobileComponentDisclaimerText,
    sendButtonTextBusiness,
    sendButtonTextConsumer,
    dismissButtonAriaLabel,
    phoneImageAriaLabel,
    phoneErrorMessage,
} from './GetOutlookMobileComponent.locstring.json';
import loc, { format } from 'owa-localize';
import { setPhoneAppCardErrorMessage } from '../mutators/setPhoneAppCardErrorMessage';
import { phoneAppCardStore } from '../store/store';
import isBusiness from 'owa-session-store/lib/utils/isBusiness';
import { getMobileContainerName } from '../utils/getMobileContainerName';
import intlTelInput from 'intl-tel-input';
import displayQrCode from '../utils/displayQrCode';

import 'intl-tel-input/build/css/intlTelInput.css';
import 'intl-tel-input/build/js/utils.js';

import styles from './PhoneAppCard.scss';
import { hasQueryStringParameter } from 'owa-querystring';
import { getHostname } from '../utils/getHostname';

export const GetOutlookMobileComponent = observer(function GetOutlookMobileComponent(props: {
    containerName: OutlookMobileContainer;
    sendButtonCallback?: () => void;
    onComponentUnmount?: () => void;
    onDismissClick?: () => void;
}) {
    const [phoneNumber, setphoneNumber] = React.useState<string>('empty');
    const [countryCode, setCountryCode] = React.useState<string>('');
    const [disableSend, setDisableSend] = React.useState<boolean>(true);

    const [timerId, setTimerId] = React.useState<number>(0);

    const onSendButtonClick = React.useCallback(() => {
        setDisableSend(true);
        let timeoutId = window.setTimeout(() => {
            setDisableSend(false);
        }, 30000);
        setTimerId(timeoutId);
        sendLocalizedTextMessage(
            phoneNumber,
            countryCode,
            getGuid(),
            props.containerName,
            getHostname()
        );

        if (
            isFeatureEnabled('rp-emptyStatePhoneCardQrExp') ||
            hasQueryStringParameter('displayQR')
        ) {
            displayQrCode();
        }

        if (props.sendButtonCallback) {
            props.sendButtonCallback();
        }
    }, [phoneNumber, countryCode]);

    React.useEffect(() => {
        return () => {
            if (timerId != 0) {
                window.clearTimeout(timerId);
            }
        };
    }, [timerId]);

    React.useEffect(() => {
        var input = document.querySelector('#phone');
        var intlInputControl = intlTelInput(input, {
            localizedCountries: phoneAppCardUtils.localizedCountriesIntlPhoneInput,
            onlyCountries: phoneAppCardUtils.allowedCountriesPhoneInput,
        });

        input.addEventListener('keyup', function (e) {
            setPhoneAppCardErrorMessage('');
            intlInputControl.getNumber() != '' ? setDisableSend(false) : setDisableSend(true);

            let validationError = intlInputControl.getValidationError();
            if (
                validationError == window.intlTelInputUtils.validationError.TOO_LONG ||
                validationError == window.intlTelInputUtils.validationError.TOO_SHORT
            ) {
                setPhoneAppCardErrorMessage(loc(phoneErrorMessage));
                setDisableSend(true);
            }

            setphoneNumber(intlInputControl.getNumber());
            setCountryCode(intlInputControl.getSelectedCountryData().iso2);
        });

        logUsage(
            'GetMobileComponentLoad',
            { containerName: getMobileContainerName(props.containerName) },
            { isCore: true }
        );
        return () => {
            if (props.onComponentUnmount) {
                props.onComponentUnmount();
            }
        };
    }, []);

    return (
        /* tslint:disable:react-no-dangerous-html */
        /* eslint-disable react/no-danger */
        //its safe to use innerHTML as content is static and is coming from locstrings
        <>
            <div className={styles.phoneAppHeader}>
                <div className={styles.closeIconDiv}>
                    {isBusiness() &&
                        props.onDismissClick &&
                        props.containerName != OutlookMobileContainer.OpxHost &&
                        props.containerName != OutlookMobileContainer.ExternalPartner && (
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
            <div className={styles.phoneSmsInput}>
                <div className={styles.phoneCardTitle}>
                    {loc(isBusiness() ? headerBusiness : headerConsumer)}
                </div>

                {loc(isBusiness() ? titleBusiness : titleConsumer)}

                <div
                    className={
                        getIsDarkTheme() ? styles.phoneInputWrapperDark : styles.phoneInputWrapper
                    }>
                    <input type="tel" id="phone" placeholder={loc(smsTextPlaceHolder)} />
                    <PrimaryButton onClick={onSendButtonClick} disabled={disableSend}>
                        {loc(isBusiness() ? sendButtonTextBusiness : sendButtonTextConsumer)}
                    </PrimaryButton>
                </div>
            </div>
            <div className={styles.phoneAppCard}>
                <div className={styles.phoneSmsDiv}>
                    <div className={styles.smsSendConfirmation}>
                        {<div role="alert">{phoneAppCardStore().errorMessage}</div>}
                    </div>
                    <div className={styles.phoneSmsDesc}>
                        <span
                            dangerouslySetInnerHTML={{
                                __html: format(
                                    loc(mobileComponentDisclaimerText),
                                    'https://go.microsoft.com/fwlink/?linkid=872595'
                                ),
                            }}
                        />
                    </div>
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
        </>
        /* eslint-enable react/no-danger */
        /* tslint:enable:react-no-dangerous-html */
    );
});
