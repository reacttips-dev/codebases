export const SUPPORTED_LOCALES = {
    AR: 'ar',
    EN_US: 'en-us',
    ES: 'es',
    ID: 'id',
    JA: 'ja',
    KO: 'ko',
    PT_BR: 'pt-br',
    UZ: 'uz',
    ZH_CN: 'zh-cn',
};

export const DEFAULT_LOCALE = SUPPORTED_LOCALES.EN_US;

export default {
    isEN_US(locale) {
        return locale === SUPPORTED_LOCALES.EN_US;
    },
};