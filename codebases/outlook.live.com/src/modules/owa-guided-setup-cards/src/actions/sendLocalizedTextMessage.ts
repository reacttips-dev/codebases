import { action } from 'satcheljs';
import type { OutlookMobileContainer } from '../utils/OutlookMobileContainer';

export let sendLocalizedTextMessage = action(
    'SEND_LOCALIZED_TEXT_MESSAGE',
    (
        phoneNumber: string,
        countryCode: string,
        coid: string,
        containerName: OutlookMobileContainer,
        hostName: string
    ) => ({
        phoneNumber,
        countryCode,
        coid,
        containerName,
        hostName,
    })
);
