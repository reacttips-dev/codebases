import {
    appErrorCode1_0,
    appErrorCodeUpdateAction,
    appErrorCode1_1,
    appErrorCode1_2,
    appErrorCode2_0,
    appErrorCode2_1,
    appErrorCode3_0,
    appErrorCodeDetailsAction,
    appErrorCode3_1,
    appErrorCode3_2,
    appErrorCode3_3,
    appErrorTitle,
    appInfoTitle,
    appTrialMessage,
    appBuyButtonLabel,
} from './AddinErrorNotificationFactory.locstring.json';
import loc from 'owa-localize';

import WebExtNotificationTypeType from 'owa-service/lib/contract/WebExtNotificationTypeType';
import type { IAddinCommand } from 'owa-addins-store';

export function getErrorNotification(
    controlId: string,
    addinCommand: IAddinCommand,
    status: string
): OSF.Notification {
    let errorDescription = '';
    let buttonText = '';
    let detailView = false;
    let displayDeactive = false;
    switch (status) {
        case '1.0':
            // This app could not be automatically updated. This app needs to be re-installed from the Office Store.
            errorDescription = loc(appErrorCode1_0);
            buttonText = loc(appErrorCodeUpdateAction);
            detailView = true;
            displayDeactive = true;
            break;
        case '1.1':
            // This app could not be automatically updated. The app is asking for increased permissions, and this requires your review and confirmation to install.
            errorDescription = loc(appErrorCode1_1);
            buttonText = loc(appErrorCodeUpdateAction);
            detailView = true;
            displayDeactive = true;
            break;
        case '1.2':
            // This app could not be automatically updated. The current license is expired or otherwise invalid. This app needs to be re-installed from the Office Store.
            errorDescription = loc(appErrorCode1_2);
            buttonText = loc(appErrorCodeUpdateAction);
            detailView = true;
            displayDeactive = true;
            break;
        case '2.0':
            // The app license could not be automatically updated. The license for this app needs to be recovered from the Office Store.
            errorDescription = loc(appErrorCode2_0);
            buttonText = loc(appErrorCodeUpdateAction);
            break;
        case '2.1':
            // The app license could not be automatically updated. The current license has expired. A new license for this app needs to be installed from the Office Store.
            errorDescription = loc(appErrorCode2_1);
            buttonText = loc(appErrorCodeUpdateAction);
            break;
        case '3.0':
            // The Office Store status for this app has changed. This may indicate that there is a problem with the app. Please go to the app page in the Office Store for more information.
            errorDescription = loc(appErrorCode3_0);
            buttonText = loc(appErrorCodeDetailsAction);
            break;
        case '3.1':
            // This app has been removed from the Office Store.
            errorDescription = loc(appErrorCode3_1);
            buttonText = loc(appErrorCodeDetailsAction);
            break;
        case '3.2':
            // There is a known issue with this app. Please go to the app page in the Office Store for more information.
            errorDescription = loc(appErrorCode3_2);
            buttonText = loc(appErrorCodeDetailsAction);
            break;
        case '3.3':
            // This app will be removed from the Office Store soon (within 30 days).
            errorDescription = loc(appErrorCode3_3);
            buttonText = loc(appErrorCodeDetailsAction);
            break;
        default:
            return null;
    }

    return {
        infoType: OSF.InfoType.Warning,
        id: controlId,
        title: loc(appErrorTitle),
        description: errorDescription,
        buttonTxt: buttonText,
        buttonCallback: openEndNodeUrl(addinCommand),
        detailView,
        displayDeactive,
        reDisplay: true,
    };
}

const openEndNodeUrl = (addinCommand: IAddinCommand) => () => {
    window.open(addinCommand.extension.EndNodeUrl);
};

export function getTrialNotification(
    addinCommand: IAddinCommand,
    controlId: string
): OSF.Notification {
    return {
        infoType: OSF.InfoType.Information,
        id: controlId,
        title: loc(appInfoTitle),
        description: loc(appTrialMessage),
        buttonTxt: loc(appBuyButtonLabel),
        buttonCallback: () => {
            window.open(addinCommand.extension.EndNodeUrl);
        },
        reDisplay: true,
    };
}

export function getNotificationTypeFromOSFInfoType(
    infoType: OSF.InfoType
): WebExtNotificationTypeType {
    switch (infoType) {
        case OSF.InfoType.Error:
        case OSF.InfoType.SecurityInfo:
        case OSF.InfoType.Warning:
            return WebExtNotificationTypeType.ErrorMessage;
        case OSF.InfoType.Information:
        default:
            return WebExtNotificationTypeType.InformationalMessage;
    }
}
