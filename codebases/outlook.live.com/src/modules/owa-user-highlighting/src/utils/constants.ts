import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';

export const MARKUP_EVENT = 'userHighlightEvent';

export const ORIGINAL_HIGHLIGHT = 'originalHighlight';

export const EXISTING_HIGHLIGHT_DATAPOINT = 'existingHighlight';
export const NEW_HIGHLIGHT_DATAPOINT = 'newHighlight';

export const USER_NOTE_EXTENDED_PROPERTY_URI = extendedPropertyUri({
    PropertyName: 'UserNoteData',
    PropertyType: 'String',
    DistinguishedPropertySetId: 'Common',
});

export const MAX_POPUP_ABOVE_LEN = 500;

export const POPUP_GAPSPACE = 10;
