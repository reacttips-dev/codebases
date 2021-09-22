import { ComposeEditorType } from './schema/ComposeEditorType';
import type { PreferredEditorMap } from './schema/PreferredEditorMap';
import { isConfigValid } from './isConfigValid';
import type BodyType from 'owa-service/lib/contract/BodyType';
import { getItem, setItem } from 'owa-local-storage';

const LOCALSTORAGE_KEY = 'compose.PREFERRED_EDITORS';

export const defaultPreferredEditorTypes: PreferredEditorMap = {
    Text: ComposeEditorType.Textarea,
    HTML: ComposeEditorType.RoosterHTML,
};

export const editorToBodyType: { [key in ComposeEditorType]: BodyType } = {
    [ComposeEditorType.Textarea]: 'Text',
    [ComposeEditorType.RoosterHTML]: 'HTML',
    [ComposeEditorType.RawContentEditableDivHTML]: 'HTML',
};

let preferredEditorTypes: PreferredEditorMap = null;

export function getDefaultPreferredEditorTypes(): PreferredEditorMap {
    // Initialize from localStorage if unavailable
    if (preferredEditorTypes === null) {
        preferredEditorTypes = initializePreferredEditorType() || {
            ...defaultPreferredEditorTypes,
        };
    }
    return { ...preferredEditorTypes };
}

function initializePreferredEditorType(): PreferredEditorMap {
    try {
        const config = JSON.parse(getItem(window, LOCALSTORAGE_KEY));
        if (!isConfigValid(config)) {
            return null;
        }
        return config;
    } catch (e) {
        return null;
    }
}

export function setPreferredEditorTypeInStorage(
    bodyContentType: BodyType,
    composeEditorType: ComposeEditorType
): void {
    preferredEditorTypes[bodyContentType] = composeEditorType;
    setItem(window, LOCALSTORAGE_KEY, JSON.stringify(preferredEditorTypes));
}
