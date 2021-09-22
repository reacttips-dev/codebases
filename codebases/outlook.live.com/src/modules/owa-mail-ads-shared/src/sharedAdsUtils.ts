import { getCookie } from 'owa-config';
import { getCurrentCulture } from 'owa-localize';
import { getUserConfiguration, isPremiumConsumer } from 'owa-session-store';
import { isFeatureEnabled } from 'owa-feature-flags';
var astScriptUrl: string;

export const supportedMarkets = [
    'ar-sa',
    'da-dk',
    'de-at',
    'de-ch',
    'de-de',
    'el-gr',
    'en-ar',
    'en-at',
    'en-au',
    'en-br',
    'en-ca',
    'en-ch',
    'en-cl',
    'en-co',
    'en-de',
    'en-dk',
    'en-fi',
    'en-gb',
    'en-gr',
    'en-hk',
    'en-ie',
    'en-in',
    'en-mx',
    'en-my',
    'en-nl',
    'en-no',
    'en-nz',
    'en-pe',
    'en-pt',
    'en-sa',
    'en-se',
    'en-sg',
    'en-th',
    'en-tr',
    'en-us',
    'en-za',
    'es-ar',
    'es-cl',
    'es-co',
    'es-ec',
    'es-es',
    'es-mx',
    'es-pe',
    'es-us',
    'es-ve',
    'fi-fi',
    'fr-be',
    'fr-ca',
    'fr-ch',
    'fr-fr',
    'it-it',
    'ja-jp',
    'ko-kr',
    'ms-my',
    'nb-no',
    'nl-be',
    'nl-nl',
    'pt-br',
    'pt-pt',
    'sv-se',
    'th-th',
    'tr-tr',
    'zh-cn',
    'zh-hk',
    'zh-sg',
    'zh-tw',
];

// We do not serve Ad for the following markets
export const embargoedMarkets = ['ar-ir', 'es-cu', 'ko-kp', 'ar-sy', 'en-su', 'uk-ua'];

const countryDefaultMarkets = {
    ae: 'ar-ae',
    ar: 'es-ar',
    at: 'de-at',
    au: 'en-au',
    be: 'fr-be',
    br: 'pt-br',
    ca: 'en-ca',
    ch: 'de-ch',
    cl: 'es-cl',
    cn: 'zh-cn',
    co: 'es-co',
    cr: 'es-cr',
    cu: 'es-cu',
    de: 'de-de',
    dk: 'da-dk',
    do: 'es-do',
    ec: 'es-ec',
    eg: 'ar-eg',
    es: 'es-es',
    fi: 'fi-fi',
    fr: 'fr-fr',
    gb: 'en-gb',
    uk: 'en-gb',
    gr: 'el-gr',
    gt: 'es-gt',
    hk: 'zh-hk',
    id: 'id-id',
    ie: 'en-ie',
    in: 'en-in',
    ir: 'ar-ir',
    it: 'it-it',
    jp: 'ja-jp',
    kp: 'ko-kp',
    kr: 'ko-kr',
    mx: 'es-mx',
    my: 'ms-my',
    nl: 'nl-nl',
    no: 'nb-no',
    nz: 'en-nz',
    pe: 'es-pe',
    ph: 'fil-ph',
    pl: 'pl-pl',
    pt: 'pt-pt',
    ru: 'ru-ru',
    sa: 'ar-sa',
    se: 'sv-se',
    sg: 'en-sg',
    su: 'en-su',
    th: 'th-th',
    tr: 'tr-tr',
    tw: 'zh-tw',
    ua: 'uk-ua',
    us: 'en-us',
    ve: 'es-ve',
    vn: 'vi-vn',
    za: 'en-za',
};

var adMarketPublishGroupCode: string;

export function calculateAdMarketPublishGroupCode(): string {
    const userConfiguration = getUserConfiguration();
    const userCulture = getCurrentCulture();
    // If AdMarket is null which means user does not select any country in the MSA live profile,
    // we will use userCulture and fall back to en-us if userCulture is not available/set as well
    if (!userConfiguration.AdMarket || !/^[a-zA-z\-]*$/.test(userConfiguration.AdMarket)) {
        return userCulture ? userCulture.toLowerCase() : 'en-us';
    }

    const adMarket = userConfiguration.AdMarket.toLowerCase();

    // If the server-side emit user Ad market is already in the supported market list
    // (which is the majority case and the most ideal case, we will use it directly)
    if (supportedMarkets.indexOf(adMarket) > -1) {
        return adMarket;
    }

    return countryDefaultMarkets[adMarket.split('-')[1]] || adMarket;
}

export function IsPremiumConsumerUser(): boolean {
    return isPremiumConsumer();
}

export function IsChildConsumerUser(): boolean {
    return getUserConfiguration().IsConsumerChild;
}

export function IsShadowMailboxUser(): boolean {
    return getUserConfiguration().SessionSettings.IsShadowMailbox;
}

export function getAdMarketPublishGroupCode(): string {
    // Cache the Ad market as it will not change in one OWA session
    if (typeof adMarketPublishGroupCode != 'undefined') {
        return adMarketPublishGroupCode;
    }

    adMarketPublishGroupCode = calculateAdMarketPublishGroupCode();
    return adMarketPublishGroupCode;
}

export function getMarketParts(usermarket: string): string[] {
    if (usermarket != null) {
        return usermarket.toUpperCase().split('-');
    }

    return [];
}

export function getMarketCountryCode(usermarket: string): string {
    return getMarketParts(usermarket)[1] || 'US';
}

export function getAnidCookie(): string {
    return getCookie('ANON');
}

export function getMuidCookie(): string {
    return getCookie('MUID');
}

export function getToptOutCookie(): boolean {
    return !!getCookie('TOptOut');
}

export function getAstScriptUrl(): string {
    // Cache astScript Url during the whole OWA session
    if (astScriptUrl) {
        return astScriptUrl;
    }

    astScriptUrl = isFeatureEnabled('adsexp-adAstupgrade-037')
        ? 'https://acdn.adnxs.com/ast/static/0.37.0/ast.js'
        : 'https://acdn.adnxs.com/ast/static/0.36.0/ast.js';
    return astScriptUrl;
}

// This is only used for test
export function setAdMarketPublishGroupCodeValue(value: any) {
    adMarketPublishGroupCode = value;
}
