import type { WhatsNewCardProperty } from '../store/schema/WhatsNewCardProperty';
import type { WhatsNewCardIdentity } from '../store/schema/WhatsNewCardIdentity';
import { WhatsNewCardPropertiesMap } from '../store/schema/WhatsNewCardPropertiesMap';

export function getWhatsNewCardProperty(identity: WhatsNewCardIdentity): WhatsNewCardProperty {
    if (identity in WhatsNewCardPropertiesMap) {
        return WhatsNewCardPropertiesMap[identity]();
    }

    return null;
}
