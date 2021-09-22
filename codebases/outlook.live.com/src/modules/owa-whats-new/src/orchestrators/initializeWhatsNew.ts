import { resetWhatsNewStore } from '../mutators/resetWhatsNewStore';
import { isWhatsNewCardEnabled } from '../utils/isWhatsNewCardEnabled';
import { getInitialWhatsNewCardStates } from '../utils/getInitialWhatsNewCardStates';
import type { WhatsNewCardStatesMap } from '../store/schema/WhatsNewCardStatesMap';
import { updateAutoOpenRegistration } from 'owa-suite-header-auto-open';

export async function initializeWhatsNew(): Promise<void> {
    let initialWhatsNewCards = await getInitialWhatsNewCardStates();
    let shouldAutoOpen = false;

    if (initialWhatsNewCards) {
        let enabledWhatsNewCards = {};
        let cardsAllowAutoExpansion = initialWhatsNewCards
            .filter(c => c.autoExpandFlexPane)
            .map(c => c.identity);

        for (let card of initialWhatsNewCards) {
            let isEnabled = await isWhatsNewCardEnabled(card.identity);

            if (isEnabled) {
                enabledWhatsNewCards[card.identity] = card;

                // Allow auto expand if the card is first downloaded to the client
                // and the card is marked to allow auto expand
                if (card.readCount == 0 && cardsAllowAutoExpansion.indexOf(card.identity) >= 0) {
                    shouldAutoOpen = true;
                }
            }
        }

        resetWhatsNewStore(enabledWhatsNewCards as WhatsNewCardStatesMap);
    }
    updateAutoOpenRegistration('whatsNewPane', { shouldAutoOpen });
}
