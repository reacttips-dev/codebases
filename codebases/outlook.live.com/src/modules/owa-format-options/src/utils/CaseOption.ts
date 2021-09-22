import { Capitalization } from 'roosterjs-editor-types';
import {
    uppercase,
    lowercase,
    capitalizeEachWord,
    sentenceCase,
} from './CaseOption.locstring.json';
import loc from 'owa-localize';

export interface CaseOption {
    option: Capitalization;
    name: string;
}

// This list is used to populate case picker drop down
export const CASE_OPTION_LIST: CaseOption[] = [
    { option: Capitalization.Uppercase, name: loc(uppercase) },
    { option: Capitalization.Lowercase, name: loc(lowercase) },
    { option: Capitalization.CapitalizeEachWord, name: loc(capitalizeEachWord) },
    { option: Capitalization.Sentence, name: loc(sentenceCase) },
];
