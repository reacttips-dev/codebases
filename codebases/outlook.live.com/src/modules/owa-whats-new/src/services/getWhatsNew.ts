import { makeGetRequest } from 'owa-ows-gateway';
import { isSuccessStatusCode } from 'owa-http-status-codes';
import type { WhatsNewCardState } from '../store/schema/WhatsNewCardState';
import { getApp } from 'owa-config';
import { getUserConfiguration } from 'owa-session-store';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

function getUserType(): string {
    let userType = isConsumer() ? 'Consumer' : 'Business';
    let sessionSettings = getUserConfiguration().SessionSettings;

    if (sessionSettings.IsShadowMailbox) {
        userType = 'CloudCache';
    }

    return userType;
}

export async function getWhatsNew(): Promise<WhatsNewCardState[]> {
    let response = await makeGetRequest(
        `ows/api/v1.0/whatsnew/items/unseen?appId=${getApp()}&userType=${getUserType()}`,
        undefined,
        true
    );

    if (isSuccessStatusCode(response.status)) {
        let json = await response.json();

        return json.map(card => {
            return {
                identity: card.identity,
                status: card.status,
                readCount: card.readCount,
                featureType: card.featureType,
                autoExpandFlexPane: card.autoExpandFlexPane,
                isHovered: false,
                isExpanded: false,
            };
        });
    }

    return undefined;
}
