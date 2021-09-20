import {
    DEFAULT_LOCALE
} from 'constants/locales';
import {
    i18n
} from 'services/localization-service';

const LocaleHelper = {
    isZHCN() {
        return i18n.getLocale() === 'zh-cn';
    },

    isENUS() {
        return i18n.getLocale() === 'en-us';
    },

    setDocumentLanguage(lang) {
        const rtlLangs = [
            'ar',
            'arc',
            'dz',
            'far',
            'ha',
            'he',
            'khw',
            'ks',
            'ku',
            'ps',
            'ur',
            'yi',
        ];

        document.body.lang = lang || DEFAULT_LOCALE;

        if (rtlLangs.indexOf(lang) !== -1) {
            document.body.dir = 'rtl';
        } else {
            document.body.dir = 'ltr';
        }
    },
};

export default LocaleHelper;