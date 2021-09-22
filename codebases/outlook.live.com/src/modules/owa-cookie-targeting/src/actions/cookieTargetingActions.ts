import cookieTargetingStore from '../store/cookieTargetingStore';
import { mutatorAction } from 'satcheljs';

export const setLgpdOptInBit = mutatorAction('SetLgpdOptInBit', (optInBit: number) => {
    cookieTargetingStore.lgpdOptInBit = optInBit;
});

export const setGdprFirstPartyCookieOptInBit = mutatorAction(
    'SetGdprFirstPartyCookieOptOutBit',
    (optOutBit: number) => {
        cookieTargetingStore.gdprFirstPartyCookieOptInBit = optOutBit;
    }
);

export const setMicrosoftChoiceUserOptOutBit = mutatorAction(
    'SetMicrosoftChoiceUserOptOutBit',
    (optOutValue: number) => {
        cookieTargetingStore.microsoftChoiceCookieOptOutBit = optOutValue;
    }
);

export const setTargetingOptInValue = mutatorAction(
    'SetTargetingOptInValue',
    (optInValue: boolean) => {
        cookieTargetingStore.effectiveOptInValue = optInValue;
    }
);
