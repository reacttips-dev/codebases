import loc, { format } from 'owa-localize';
import { getStore } from '../store/store';
import { GENERAL_GHOST_TEXT_BANK, PERSONALIZED_GHOST_TEXT_BANK } from '../searchConstants';
import GeneralizedGhostTextStrings from '../components/GeneralGhostTextSuggestions.locstring.json';
import PersonalizedGhostTextStrings from '../components/PersonalizedGhostTextSuggestions.locstring.json';

/*
 * Gender-neutral en-us names first names
 * from https://microsoft.sharepoint.com/sites/celaweb-tools/sitepages/fictitiousnamefinder.aspx
 */
const recipients: string[] = [
    'Riley',
    'Avery',
    'Jordan',
    'Parker',
    'Tyler',
    'Jamie',
    'Jessie',
    'Cameron',
    'Morgan',
    'Casey',
];

export default function getNaturalLanguageGhostText(isNeededForStringComparison?: boolean): string {
    const {
        personalizedGhostTextBankIndex,
        recipientForPersonalizedGhostTextIndex,
        generalizedGhostTextBankIndex,
        usePersonalGhostText,
    } = getStore();

    if (usePersonalGhostText) {
        const personalizedGhostTextString = loc(
            PersonalizedGhostTextStrings[
                PERSONALIZED_GHOST_TEXT_BANK[personalizedGhostTextBankIndex]
            ]
        );

        if (personalizedGhostTextString && isNeededForStringComparison) {
            return personalizedGhostTextString;
        }

        /**
         * Checks if the personalized ghost text string is defined in case there
         * is a falsy index or bad string key.
         */
        if (personalizedGhostTextString) {
            // uses the index to pick a name from the recipient cache
            const personName = recipients[recipientForPersonalizedGhostTextIndex];
            // returns the personalized ghost text string with a name from the recipient cache
            return format(personalizedGhostTextString, personName);
        }
    }

    // uses index to pick a generalized ghost text string
    return loc(GeneralizedGhostTextStrings[GENERAL_GHOST_TEXT_BANK[generalizedGhostTextBankIndex]]);
}
