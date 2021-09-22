import { loadTableViewFromSearchTableQuery } from '../actions/publicActions';
import {
    getStore,
    GENERAL_GHOST_TEXT_BANK_COUNT,
    PERSONALIZED_GHOST_TEXT_BANK_COUNT,
} from '../store/store';
import { mutator } from 'satcheljs';
import { MAX_NAMES_FOR_GHOST_TEXT } from '../bootSearchConstants';
import isNaturalLanguageGhostTextEnabled from '../utils/isNaturalLanguageGhostTextEnabled';

mutator(loadTableViewFromSearchTableQuery, () => {
    if (isNaturalLanguageGhostTextEnabled()) {
        const mailSearchStore = getStore();
        mailSearchStore.recipientForPersonalizedGhostTextIndex =
            (mailSearchStore.recipientForPersonalizedGhostTextIndex + 1) % MAX_NAMES_FOR_GHOST_TEXT;
        mailSearchStore.generalizedGhostTextBankIndex =
            (mailSearchStore.generalizedGhostTextBankIndex + 1) % GENERAL_GHOST_TEXT_BANK_COUNT;
        mailSearchStore.personalizedGhostTextBankIndex =
            (mailSearchStore.personalizedGhostTextBankIndex + 1) %
            PERSONALIZED_GHOST_TEXT_BANK_COUNT;
        mailSearchStore.usePersonalGhostText = !!Math.round(Math.random());
    }
});
