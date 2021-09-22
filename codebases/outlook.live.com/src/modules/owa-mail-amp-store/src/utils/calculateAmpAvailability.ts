import hasAmpBody from './hasAmpBody';
import isMessageSafe from './isMessageSafe';
import getAmpSender from './getAmpSender';
import isAmpEnabled from './isAmpEnabled';
import { isBrowserEdge, isBrowserIE } from 'owa-user-agent/lib/userAgent';
import { AMPAvailability } from '../store/schema/AmpViewState';
import type Message from 'owa-service/lib/contract/Message';
import store from '../store/store';
import {
    getOptionsForFeature,
    AmpDeveloperOptions,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';

export default function calculateAmpAvailability(message: Message): AMPAvailability {
    if (!hasAmpBody(message)) {
        return AMPAvailability.None;
    }

    if (!isAmpEnabled()) {
        return AMPAvailability.AmpDisabled;
    }

    if (!isMessageSafe(message)) {
        return AMPAvailability.MessageUnsafe;
    }

    const sender = getAmpSender(message);
    if (sender == null || (!isSenderInUserList(sender) && !isSenderGloballyAllowed(sender))) {
        return AMPAvailability.SenderNotAllowed;
    }

    if (isBrowserEdge() || isBrowserIE()) {
        return AMPAvailability.BrowserNotSupported;
    }

    return AMPAvailability.AmpNotValidated;
}

function isCaseIncensitiveEqual(str1: string, str2: string): boolean {
    return str1.toLowerCase() == str2.toLowerCase();
}

/**
 * Is the sender in globally allowed list
 */
function isSenderGloballyAllowed(sender: string): boolean {
    return (
        store.allowedSenders && store.allowedSenders.some(s => isCaseIncensitiveEqual(s, sender))
    );
}

/**
 * Is the sender in user level list
 */
function isSenderInUserList(sender: string): boolean {
    const ampDeveloperOptions = getOptionsForFeature<AmpDeveloperOptions>(
        OwsOptionsFeatureType.AmpDeveloper
    );
    return (
        ampDeveloperOptions.enabled &&
        ampDeveloperOptions.allowedSender.some(s => isCaseIncensitiveEqual(s, sender))
    );
}
