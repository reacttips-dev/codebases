import getConversationSubject from '../../utils/getConversationSubject';
import { isFeatureEnabled } from 'owa-feature-flags';
import addInfoBarMessage from 'owa-info-bar/lib/actions/addInfoBarMessage';
import { lazySetItemLocale } from 'owa-mail-inline-translation';
import type { ItemViewState } from '../../index';
import type { ClientItem } from 'owa-mail-store';
import { trace } from 'owa-trace';

export default async function initItemLocale(item: ClientItem, viewState: ItemViewState) {
    if (isFeatureEnabled('rp-inlineTranslation') && item.TranslationData) {
        try {
            const savedUserLanguage = item.TranslationData.userLanguage;

            let subject: string = null;

            if (isFeatureEnabled('rp-inlineTranslationAutomatic')) {
                if (viewState.isConversationItemPart) {
                    subject = getConversationSubject(item.ConversationId?.Id);
                } else {
                    subject = item.Subject;
                }
            }

            await lazySetItemLocale.importAndExecute(
                viewState.isConversationItemPart,
                item,
                subject
            );

            if (
                savedUserLanguage != item.TranslationData.userLanguage &&
                (item.TranslationData.isTranslatable ||
                    item.TranslationData.isForwardContentTranslatable)
            ) {
                // Force translate info bar
                addInfoBarMessage(viewState, 'translateInfoBar');
            }
        } catch (error) {
            trace.warn(`[setItemLocale] Failed to initialize item locale: ${error}`);
        }
    }
}
