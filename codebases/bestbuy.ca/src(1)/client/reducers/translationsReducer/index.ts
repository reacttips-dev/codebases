import {translationsActionTypes} from "../../actions";
import {Intl} from "../../models";

export interface TranslationsState extends Intl {
    formats?: object;
    messages: object;
    language: Language;
    locale: Locale;
}

export const initialTranslationsState: TranslationsState = {
    language: "en",
    locale: "en-CA",
    messages: {},
};

export const intl = (state = initialTranslationsState, action): TranslationsState => {
    switch (action.type) {
        case translationsActionTypes.INITIALIZE_INTL:
            return {formats: action.formats, messages: action.messages, ...action.intl};

        default:
            return state;
    }
};

export default intl;
