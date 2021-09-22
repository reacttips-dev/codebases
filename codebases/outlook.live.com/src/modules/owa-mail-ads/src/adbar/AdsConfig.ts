import type { DatapointStatus, PerformanceDatapoint } from 'owa-analytics';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getAdTargetingOptOut } from 'owa-topt';
import {
    getAnidCookie,
    getMarketParts,
    getMuidCookie,
    getAdMarketPublishGroupCode,
    supportedMarkets,
} from 'owa-mail-ads-shared';

const EN_NON_EN_MARKET_MAPPING = {
    BREN: 'BRPT',
    PLEN: 'PLPL',
    MXEN: 'MXES',
    DEEN: 'DEDE',
    DKEN: 'DKDA',
    AREN: 'ARES',
    NOEN: 'NONB',
    NLEN: 'NLNL',
    IDEN: 'IDID',
    VNEN: 'VNVI',
    COEN: 'COES',
    CHEN: 'CHDE',
    SEEN: 'SESV',
    AEAR: 'AEEN',
    EGAR: 'EGEN',
    RUEN: 'RURU',
};

// Some page code with markets have special mappings
const PAGE_MARKET_MAPPING_EXCEPTIONS = {
    WAB8NLNL: 'WAB8NLNL2',
    WAB8IEEN: 'WAB8IEEN2',
    WAB2USEN: 'OVT2USEN',
    WAB2CNZH: 'WAB2CNZHH',
    WAB8ESES: 'WAB10ESES',
    WAB2ROW: 'WAB1ROW',
};

export interface AdsDimension {
    Size: number[][];
    PageGroupPrefix: string;
    ComposeGroupPrefix?: string;
    AllowedFormats: string[];
    JACPosition?: string;
    JACAdSize?: string[];
}

export interface AdsProvider {
    refresh(throttleCount?: number, actionName?: string): void;
    modify(): void;
    disableOrEnableRefresh(noRefreshReason?: string): void;
}

export interface AdsConfig {
    AdMarket: string;
    MUID: string;
    ANID: string;
    AdSizes?: number[][];
    CountryCode?: string;
    ExternalImpId?: string;
    PageGroup?: string;
    PageGroupMarketCode?: string;
    AdblockerWhiteListPageGroup?: string;
    AllowedFormats?: string[];
    JACPosition?: string;
    JACSiteId?: string;
    JACAdSize?: string[];
    RefreshThottleInterval?: number;
}

let config: AdsConfig;
export function getAdsConfig() {
    if (!config) {
        config = {
            AdMarket: getAdMarketPublishGroupCode(),
            MUID: getMuidCookie(),
            ANID: getAnidCookie(),
        };

        const marketParts = getMarketParts(config.AdMarket);
        config.CountryCode = marketParts[1] || 'US';

        // Order of evaluating the page group
        // 1. Use 'ROW' (Rest of World) if the admarket is not in the default support list
        // 2. Use the market support list
        if (config.AdMarket && supportedMarkets.indexOf(config.AdMarket.toLowerCase()) == -1) {
            config.PageGroupMarketCode = 'ROW';
        } else {
            const marketPageGroup = config.CountryCode + (marketParts[0] || 'EN');
            config.PageGroupMarketCode =
                EN_NON_EN_MARKET_MAPPING[marketPageGroup] || marketPageGroup;
        }

        config.RefreshThottleInterval = getRefreshThottleInterval();
    }

    return config;
}

export function TEST_clearConfig() {
    config = null;
}

export function parseAdsDimension(adsDimension: AdsDimension, isCompose?: boolean) {
    getAdsConfig();
    const pageGroupPrefix =
        (isCompose && adsDimension.ComposeGroupPrefix) || adsDimension.PageGroupPrefix;
    config.PageGroup = pageGroupPrefix + config.PageGroupMarketCode;
    config.PageGroup = PAGE_MARKET_MAPPING_EXCEPTIONS[config.PageGroup] || config.PageGroup;
    config.AdSizes = adsDimension.Size;
    config.AllowedFormats = adsDimension.AllowedFormats;
    config.ExternalImpId = generateUUID();
    config.JACPosition = adsDimension.JACPosition;
    config.JACAdSize = adsDimension.JACAdSize;
}

export function getUserTOptOutBit() {
    const userANID = getAnidCookie();
    return getAdTargetingOptOut(userANID);
}

export function endDatapoint(
    datapoint: PerformanceDatapoint,
    status?: DatapointStatus,
    errorObj?: any
) {
    if (datapoint) {
        const errorType = typeof errorObj;
        if (errorType === 'object' && errorObj.message) {
            datapoint.addCustomData({
                reason: errorObj.message + (errorObj.stack ? '|' + errorObj.stack : ''),
            });
        } else if (errorType == 'string') {
            datapoint.addCustomData({ reason: errorObj });
        }
        datapoint.end(null, status);
        datapoint = null;
    }
}

// Get refresh throttle interval in milli-second
function getRefreshThottleInterval(): number {
    let refreshThottleInterval = 5000;

    if (isFeatureEnabled('adsexp-DisplayVerizon-30s')) {
        refreshThottleInterval = 30000;
    } else if (isFeatureEnabled('adsexp-Display-7s')) {
        refreshThottleInterval = 7000;
    }

    return refreshThottleInterval;
}

// Generate a UUID for externalUid
function generateUUID(): string {
    let d = new Date().getTime();
    if (window.performance && typeof window.performance.now === 'function') {
        d += performance.now();
    }
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c: string) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
}
