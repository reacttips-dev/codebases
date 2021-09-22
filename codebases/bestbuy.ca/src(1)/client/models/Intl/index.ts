import { FormattedMessage } from "react-intl";

interface Intl {
    language: Language;
    locale: Locale;
}

type Messages = Record<string, FormattedMessage.MessageDescriptor>;

function convertLocaleToLang(locale: Locale) {
    return locale.split("-")[0] as Language;
}

function convertLangToLocale(lang: Language): Locale {
    return `${lang}-CA` as Locale;
}

export {
    Intl,
    Messages,
    convertLocaleToLang,
    convertLangToLocale,
};
