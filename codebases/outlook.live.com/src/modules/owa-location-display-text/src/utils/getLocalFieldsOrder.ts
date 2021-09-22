import { getCurrentCulture } from 'owa-localize';
import { isNullOrWhiteSpace } from 'owa-string-utils';

/**
 * Default localeId in case we fail locale lookup
 */
const DefaultLocaleId = 'en-us';

/**
 * Disctionary of locale to field order mapping.
 */
const LocalFieldOrderMapping: { [local: string]: string } = {
    'am-et': 'a_c_pc_pr_ctry',
    'ar-dz': 'a_pc_c_pr_ctry',
    'ar-bh': 'a_pc_c_pr_ctry',
    'ar-eg': 'a_ctry_c_pr_pc',
    'ar-iq': 'a_pc_c_pr_ctry',
    'ar-jo': 'a_c_pc_pr_ctry',
    'ar-kw': 'a_pc_c_pr_ctry',
    'ar-lb': 'a_c_pc_pr_ctry',
    'ar-ly': 'a_pc_c_pr_ctry',
    'ar-ma': 'a_pc_c_pr_ctry',
    'ar-om': 'a_c_pr_ctry_pc',
    'ar-qa': 'a_pc_c_pr_ctry',
    'ar-sa': 'a_c_pc_pr_ctry',
    'ar-sy': 'a_pc_c_pr_ctry',
    'ar-tn': 'a_pc_c_pr_ctry',
    'ar-ae': 'a_pc_c_pr_ctry',
    'ar-ye': 'a_pc_c_pr_ctry',
    'eu-es': 'a_pc_c_pr_ctry',
    'bn-in': 'a_c_pc_pr_ctry',
    'bg-bg': 'a_pc_c_pr_ctry',
    'ca-es': 'a_pc_c_pr_ctry',
    'zh-cn': 'pc_ctry_pr_c_a',
    'zh-sg': 'a_c_pc_pr_ctry',
    'zh-hk': 'ctry_pc_pr_c_a',
    'zh-mo': 'ctry_pr_c_pc_a',
    'zh-tw': 'pc_ctry_pr_c_a',
    'hr-hr': 'a_pc_c_pr_ctry',
    'cs-cz': 'a_pc_c_pr_ctry',
    'da-dk': 'a_pc_c_pr_ctry',
    'nl-be': 'a_pc_c_pr_ctry',
    'nl-nl': 'a_pc_c_pr_ctry',
    'en-au': 'a_c_pc_pr_ctry',
    'en-bz': 'a_pc_c_pr_ctry',
    'en-ca': 'a_c_pc_pr_ctry',
    'en-ie': 'a_c_pc_pr_ctry',
    'en-jm': 'a_pc_c_pr_ctry',
    'en-nz': 'a_c_pc_pr_ctry',
    'en-ph': 'a_pc_pr_c_ctry',
    'en-za': 'a_c_pc_pr_ctry',
    'en-tt': 'a_pc_c_pr_ctry',
    'en-gb': 'a_c_pc_pr_ctry',
    'en-us': 'a_c_pr_pc_ctry',
    'en-zw': 'a_pc_c_pr_ctry',
    'et-ee': 'a_pc_c_pr_ctry',
    'fil-ph': 'a_pc_pr_c_ctry',
    'fi-fi': 'a_pc_c_pr_ctry',
    'fr-be': 'a_pc_c_pr_ctry',
    'fr-ca': 'a_c_pc_pr_ctry',
    'fr-fr': 'a_pc_c_pr_ctry',
    'fr-lu': 'a_pc_c_pr_ctry',
    'fr-mc': 'a_pc_c_pr_ctry',
    'fr-ch': 'a_pc_c_pr_ctry',
    'gl-es': 'a_pc_c_pr_ctry',
    'de-at': 'a_pc_c_pr_ctry',
    'de-de': 'a_pc_c_pr_ctry',
    'de-li': 'a_pc_c_pr_ctry',
    'de-lu': 'a_pc_c_pr_ctry',
    'de-ch': 'a_pc_c_pr_ctry',
    'el-gr': 'a_pc_c_pr_ctry',
    'gu-in': 'a_c_pc_pr_ctry',
    'he-il': 'a_pc_c_pr_ctry',
    'hi-in': 'a_c_pc_pr_ctry',
    'hu-hu': 'c_a_pc_pr_ctry',
    'is-is': 'a_pc_c_pr_ctry',
    'id-id': 'a_c_pc_pr_ctry',
    'it-it': 'a_pc_c_pr_ctry',
    'it-ch': 'a_pc_c_pr_ctry',
    'ja-jp': 'pc_pr_c_a_ctry',
    'kn-in': 'a_c_pc_pr_ctry',
    'kk-kz': 'ctry_pr_c_pc_a',
    'ko-kr': 'pc_pr_c_a_ctry',
    'lv-lv': 'a_c_pc_pr_ctry',
    'lt-lt': 'a_c_pc_pr_ctry',
    'ms-bn': 'a_c_pc_pr_ctry',
    'ms-my': 'a_pc_c_pr_ctry',
    'ml-in': 'a_c_pc_pr_ctry',
    'mr-in': 'a_c_pc_pr_ctry',
    'nb-no': 'a_pc_c_pr_ctry',
    'or-in': 'a_c_pc_pr_ctry',
    'fa-ir': 'a_c_pc_pr_ctry',
    'pl-pl': 'a_pc_c_pr_ctry',
    'pt-br': 'a_pc_c_pr_ctry',
    'pt-pt': 'a_pc_c_pr_ctry',
    'ro-ro': 'a_pc_c_pr_ctry',
    'ru-ru': 'ctry_pc_pr_c_a',
    'sr-cyrl-cs': 'a_pc_c_pr_ctry',
    'sk-sk': 'a_pc_c_pr_ctry',
    'sl-si': 'a_pc_c_pr_ctry',
    'es-ar': 'a_pc_c_pr_ctry',
    'es-bo': 'a_pc_c_pr_ctry',
    'es-cl': 'a_pc_c_pr_ctry',
    'es-co': 'a_pc_c_pr_ctry',
    'es-cr': 'a_pc_c_pr_ctry',
    'es-do': 'a_pc_c_pr_ctry',
    'es-ec': 'a_pc_c_pr_ctry',
    'es-sv': 'a_c_pc_pr_ctry',
    'es-gt': 'a_pc_c_pr_ctry',
    'es-hn': 'a_pc_c_pr_ctry',
    'es-mx': 'a_pc_c_pr_ctry',
    'es-ni': 'a_c_pc_pr_ctry',
    'es-pa': 'a_pc_c_pr_ctry',
    'es-py': 'a_pc_c_pr_ctry',
    'es-pe': 'a_pc_c_pr_ctry',
    'es-pr': 'a_c_pc_pr_ctry',
    'es-es': 'a_pc_c_pr_ctry',
    'es-us': 'a_c_pc_pr_ctry',
    'es-uy': 'a_pc_c_pr_ctry',
    'es-ve': 'a_pc_c_pr_ctry',
    'sv-fi': 'a_pc_c_pr_ctry',
    'sv-se': 'a_pc_c_pr_ctry',
    'ta-in': 'a_c_pc_pr_ctry',
    'te-in': 'a_c_pc_pr_ctry',
    'th-th': 'a_c_pc_pr_ctry',
    'tr-tr': 'a_pc_pr_c_ctry',
    'uk-ua': 'ctry_pc_pr_c_a',
    'ur-pk': 'a_c_pc_pr_ctry',
    'cy-gb': 'a_c_pc_pr_ctry',
};

/**
 * gets the appropriate fields order for the locale; if mapping is not found, then use mapping for default locale
 */
export default function getLocalFieldsOrder(): string {
    let localeId = '';

    if (!isNullOrWhiteSpace(getCurrentCulture())) {
        localeId = getCurrentCulture();
    }

    // Fetch the appropriate fields order for the locale; if mapping is not found, then use mapping for default locale
    let fieldsOrder = LocalFieldOrderMapping[localeId];
    if (fieldsOrder == null) {
        fieldsOrder = LocalFieldOrderMapping[DefaultLocaleId];
    }

    return fieldsOrder;
}
