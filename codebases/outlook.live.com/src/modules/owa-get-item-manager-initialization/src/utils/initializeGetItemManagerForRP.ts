import { initialize } from 'owa-get-item-manager/lib/utils/GetItemManager';
import inlineTranslationDataAndStatusItemPropertyEntry from 'owa-mail-inline-translation/lib/utils/inlineTranslationDataAndStatusItemPropertyEntry';
import inlineTranslationLocaleItemPropertyEntry from 'owa-mail-inline-translation/lib/utils/inlineTranslationLocaleItemPropertyEntry';
import omeMessageStatePropertyEntry from 'owa-mail-revocation/lib/utils/omeMessageStatePropertyEntry';
import languageAndLocaleItemPropertyEntry from 'owa-mail-smart-pill/lib/utils/extendedPropertyUris/languageAndLocaleItemPropertyEntry';
import smartDocItemPropertyEntry from 'owa-mail-smart-pill/lib/utils/extendedPropertyUris/smartDocItemPropertyEntry';
import smartReplyItemPropertyEntry from 'owa-mail-smart-pill/lib/utils/extendedPropertyUris/smartReplyItemPropertyEntry';
import smartTimeItemPropertyEntry from 'owa-mail-smart-pill/lib/utils/extendedPropertyUris/smartTimeItemPropertyEntry';
import meetingConflictsPropertyEntry from 'owa-meeting-message/lib/utils/meetingConflictsPropertyEntry';
import userHighlightItemPropertyEntry from 'owa-user-highlighting/lib/utils/userHighlightItemPropertyEntry';
import userNoteItemPropertyEntry from 'owa-user-highlighting/lib/utils/userNoteItemPropertyEntry';
import extractedUrlPropertyEntry from 'owa-mail-extracted-url/lib/utils/extractedUrlPropertyEntry';
import linkDiscoveryItemPropertyEntry from 'owa-mail-attachment-previews/lib/utils/linkDiscoveryItemPropertyEntry';

// Initialize the GetItemManager for reading pane
export default function initializeGetItemManagerForRP() {
    initialize([
        inlineTranslationDataAndStatusItemPropertyEntry,
        inlineTranslationLocaleItemPropertyEntry,
        userHighlightItemPropertyEntry,
        userNoteItemPropertyEntry,
        languageAndLocaleItemPropertyEntry,
        smartDocItemPropertyEntry,
        smartReplyItemPropertyEntry,
        smartTimeItemPropertyEntry,
        meetingConflictsPropertyEntry,
        omeMessageStatePropertyEntry,
        extractedUrlPropertyEntry,
        linkDiscoveryItemPropertyEntry,
    ]);
}
