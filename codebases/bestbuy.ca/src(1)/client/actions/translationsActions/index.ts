import * as Moment from "moment";
import {ActionCreatorsMapObject} from "redux";
import enTranslations from "../../../../temp/en.json";
import frTranslations from "../../../../temp/fr.json";
import {Intl} from "../../models";

export const translationsActionTypes = {
    INITIALIZE_INTL: "TRANSLATIONS_INITIALIZE_INTL",
};

export interface TranslationsActionCreators extends ActionCreatorsMapObject {
    initializeIntl: (intl: Intl) => any;
}

export const translationsActionCreators: TranslationsActionCreators = (() => {
    const initializeIntl = (intl: Intl) => {
        const messages = intl.language === "en" ? enTranslations : frTranslations;
        Moment.locale(intl.locale);
        // The format setting has been disabled to address the bug due to a recent change in CLDR that
        // provides specification for the currency, number, DateTime, etc based on the locale. Due to
        // this change, our site has seen to append 'CA' to the price on Chrome in mobile devices and
        // Safari v14. A browser based logic to use 'narrowSymbol' for the currencyDisplay to fix the
        // issue is tried and it worked for most browsers. For Safari, when we logically skip the use
        // of 'narrowSymbol', the BBY cache setup on the production (not based on browser type) can serve
        // a request originated from Safari with non-safari cache with an incorrect settings. This results
        // in an intermitted issue where formatMessage template are seen plain. Workaround: Add $ symbol
        // in the translation messages for EN and FR. Future fix: When all the browsers full support
        // 'narrowSymbol' and support for problematic version of the browser phase out we can enable this
        // again.

        // const currencyFormat = {style: "currency", currency: "CAD", currencyDisplay: "narrowSymbol"};
        // const formats = {
        //     number: {
        //         price: currencyFormat,
        //         saving: {...currencyFormat, minimumFractionDigits: 0},
        //     },
        // };

        return {
            // formats,
            intl,
            messages,
            type: translationsActionTypes.INITIALIZE_INTL,
        };
    };

    return {
        initializeIntl,
    };
})();
