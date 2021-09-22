import initializeSIGSDataAction from '../actions/initializeSIGSDataAction';
import { mutator } from 'satcheljs';
import { getStore as getMailStore, ClientItem } from 'owa-mail-store';

export default mutator(initializeSIGSDataAction, actionMessage => {
    const {
        itemId,
        isSmartSuggestionsRendered,
        suggestionTypesRendered,
        suggestionsRendered,
        extractionId,
    } = actionMessage;

    const mailItem: ClientItem = getMailStore().items.get(itemId);

    if (mailItem?.SIGSData) {
        mailItem.SIGSData.SmartPillData = {
            IsSmartSuggestionsRendered: isSmartSuggestionsRendered,
            SuggestionTypesRendered: suggestionTypesRendered,
            SuggestionsRendered: suggestionsRendered,
            ExtractionId: extractionId,
        };
    }
});
