import { orchestrator } from 'satcheljs';
import { sendLocalizedTextMessage } from '../actions/sendLocalizedTextMessage';
import { logUsage } from 'owa-analytics';
import sendLocalizedSms from '../services/sendLocalizedSms';
import { setPhoneAppCardErrorMessage } from '../mutators/setPhoneAppCardErrorMessage';
import { getMobileContainerName } from '../utils/getMobileContainerName';
import isBusiness from 'owa-session-store/lib/utils/isBusiness';
import { isEdu } from 'owa-nonboot-userconfiguration-manager';
import { isFeatureEnabled } from 'owa-feature-flags';
import { SmsUserType, ContainerName, ExperimentName } from '../store/schema/SendSmsRequest';
import { OutlookMobileContainer } from '../utils/OutlookMobileContainer';
import {
    messageSentConfirmation,
    messageNotSentRetryMessage,
} from '../components/GetOutlookMobileComponent.locstring.json';
import loc from 'owa-localize';

orchestrator(sendLocalizedTextMessage, async actionParams => {
    let sendSmsEventName = 'PhoneCardSendLocSMS';

    let response = await sendLocalizedSms({
        sendTo: actionParams.phoneNumber,
        countryCode: actionParams.countryCode,
        containerName:
            actionParams.containerName == OutlookMobileContainer.ReadingPane
                ? ContainerName.EmptyState
                : actionParams.containerName == OutlookMobileContainer.GetStarted
                ? ContainerName.GetStarted
                : actionParams.containerName == OutlookMobileContainer.ExternalPartner
                ? ContainerName.ExternalPartner
                : ContainerName.OpxHost,
        userType: isBusiness()
            ? isEdu()
                ? SmsUserType.Edu
                : SmsUserType.Business
            : SmsUserType.Consumer,
        experimentName: isFeatureEnabled('rp-emptyStatePhoneCardQrExp')
            ? ExperimentName.QR
            : ExperimentName.SmsOnly,
        coid: actionParams.coid,
        hostName: actionParams.hostName,
    });

    if (response.Success != 'true') {
        sendSmsEventName = 'PhoneCardSendLocSMSFailed';
        setPhoneAppCardErrorMessage(loc(messageNotSentRetryMessage));
    } else {
        setPhoneAppCardErrorMessage(loc(messageSentConfirmation));
    }

    logUsage(
        sendSmsEventName,
        {
            containerName: getMobileContainerName(actionParams.containerName),
            country: actionParams.countryCode,
            coid: response.Coid,
        },
        { isCore: true }
    );
});
