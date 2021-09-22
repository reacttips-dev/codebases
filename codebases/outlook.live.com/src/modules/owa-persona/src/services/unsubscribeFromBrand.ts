import type { BrandUnsubscribeInfo, PersonaIdentifiers } from '../personaConfig';
import { trace } from 'owa-trace';
import { unsubscribeFromBrandSubscription } from 'owa-brands-subscription';

export type UnsubscribeFromBrandCompletedCallback = (
    isSuccess: boolean,
    errorCode?: string
) => void;

export default function unsubscribeFromBrand(
    personaId: PersonaIdentifiers,
    targetBrandUnsubscribeInfo: BrandUnsubscribeInfo,
    completedCallback: UnsubscribeFromBrandCompletedCallback
) {
    trace.info(
        '[unsubscribeFromBrand] target brand smtp identifier: ' +
            targetBrandUnsubscribeInfo.smtpIdentifier
    );

    unsubscribeFromBrandSubscription(
        'BrandCard',
        targetBrandUnsubscribeInfo.smtp,
        targetBrandUnsubscribeInfo.smtpIdentifier,
        targetBrandUnsubscribeInfo.unsubscribeSilentUri,
        targetBrandUnsubscribeInfo.unsubscribeHttpUri[0],
        completedCallback
    );
}
