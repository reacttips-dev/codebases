import { mutatorAction } from 'satcheljs';
import { getLocalizedStringStore } from '../store/store';

export const addLocstringsToStore = mutatorAction(
    'ADD_LOCSTRINGS',
    (strings: Record<string, string>) => {
        getLocalizedStringStore().localizedStrings.merge(strings);
    }
);
