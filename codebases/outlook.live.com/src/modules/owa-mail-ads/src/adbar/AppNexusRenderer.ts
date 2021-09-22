import { AdsConfig, AdsProvider, endDatapoint, getAdsConfig } from './AdsConfig';
import { loadGdprCmp } from '../utils/loadGdprCmp';
import { DatapointStatus, PerformanceDatapoint } from 'owa-analytics';
import { calculateCookieTargeting, cookieTargetingStore } from 'owa-cookie-targeting';
import { gdprTcfStore } from 'owa-gdpr-ad-tcf';
import { isGdprAdMarket } from 'owa-mail-ads-shared';
import { getUserConfiguration } from 'owa-session-store';

let config: AdsConfig;

export default class AppNexusRenderer implements AdsProvider {
    private containerId: string;
    private firstAdLoaded: boolean = false;
    private datapoint: PerformanceDatapoint;
    private consentStringPurpose: number[];
    private gdprConsentDataString: string;
    private totalThrottleCount: number = 0;
    private totalImpRequestsCount: number = 0;
    private noRefreshReason: string;

    constructor(containerId: string) {
        if (!config) {
            config = getAdsConfig();
        }
        this.containerId = containerId;
        this.load();
    }

    public async load() {
        const apn = (<any>window).apntag;

        let gdprDatapoint = await loadGdprCmp();
        this.gdprConsentDataString = gdprDatapoint.gdprConsentDataString;
        this.consentStringPurpose = gdprDatapoint.consentStringPurpose;

        await calculateCookieTargeting();

        apn &&
            apn.anq.push(() => {
                apn.setEndpoint('m.adnxs.com');

                const countryCode = config.CountryCode;
                // this function call is required to support the user object
                apn.setPageOpts({
                    member: countryCode == 'AU' || countryCode == 'NZ' ? 1705 : 280,
                    user: {
                        dnt: !cookieTargetingStore.effectiveOptInValue, // optional true means opted out, false means not opted out
                        externalUid: cookieTargetingStore.effectiveOptInValue ? config.MUID : '', // recommended
                    },
                });

                apn.defineTag({
                    enableSafeFrame: true,
                    invCode: config.PageGroup,
                    extInvCode: countryCode,
                    sizes: config.AdSizes,
                    targetId: this.containerId,
                    allowedFormats: config.AllowedFormats,
                    allowSmallerSizes: false,
                    trafficSourceCode: 'pg:' + config.PageGroup,
                    externalImpId: config.ExternalImpId,
                    safeframeConfig: {
                        sandbox: true,
                    },
                });

                apn.onEvent('adLoaded', this.containerId, rawAdObject => {
                    this.logCosmosOnlyDataPoint(rawAdObject?.auctionId);
                    endDatapoint(this.datapoint);
                });
                apn.onEvent('adNoBid', this.containerId, rawAdObject => {
                    this.logCosmosOnlyDataPoint(rawAdObject?.auctionId);
                    endDatapoint(this.datapoint, DatapointStatus.ServerError, 'AppNexusadNoBid');
                });
                apn.onEvent('adError', this.containerId, (adError, rawAdObject) => {
                    let adObject = null;
                    if (adError) {
                        adObject = adError.errMessage || adError.exception;
                    }
                    this.logCosmosOnlyDataPoint(rawAdObject?.auctionId);
                    endDatapoint(this.datapoint, DatapointStatus.ServerError, adObject);
                });

                apn.loadTags();
                this.refresh();
            });
    }

    // Disable or enable the refresh such as
    disableOrEnableRefresh(noRefreshReason?: string) {
        this.noRefreshReason = noRefreshReason;
    }

    refresh(throttleCount?: number, actionName?: string) {
        let datapointName = this.noRefreshReason ? 'AdsNoRefresh' : 'AdsImpressed';
        this.totalImpRequestsCount = this.noRefreshReason
            ? this.totalImpRequestsCount
            : this.totalImpRequestsCount + 1;
        this.totalThrottleCount = this.totalThrottleCount + throttleCount || 0;

        endDatapoint(this.datapoint, DatapointStatus.RequestNotComplete);
        this.datapoint = new PerformanceDatapoint(datapointName);
        const isGdprAdMarketValue = isGdprAdMarket();
        const consentStringVaue = this.consentStringPurpose
            ? this.consentStringPurpose.toString()
            : 'NullConsentString';
        this.datapoint.addCustomData({
            UserAdCountry: config.CountryCode,
            CalculatedAdMarket: config.AdMarket,
            PGPrefix: config.PageGroup?.substring(0, 4),
            PG: config.PageGroup,
            AdLoadReason: actionName ? actionName : 'loadOWA',
            ThrottleCount: throttleCount,
            TotalThrottleCount: this.totalThrottleCount,
            TotalImpRequestsCount: this.totalImpRequestsCount,
            GDPRApplies_2: isGdprAdMarketValue,
            GDPRPurposes_2: consentStringVaue,
            ReadingPanePosition: getUserConfiguration()?.UserOptions
                ?.GlobalReadingPanePositionReact,
            IsFocusedInboxEnabled: getUserConfiguration()?.UserOptions?.IsFocusedInboxEnabled,
            FirstPartyCookieOptOut: cookieTargetingStore.gdprFirstPartyCookieOptInBit != 2,
            MSOptOut: cookieTargetingStore.microsoftChoiceCookieOptOutBit == 2,
            SendMuid: cookieTargetingStore.effectiveOptInValue,
            NoRefreshReason: this.noRefreshReason,
            AdProvider: 'AppNexus',
        });

        if (!this.noRefreshReason) {
            const apn = (<any>window).apntag;
            if (apn) {
                apn.anq.push(() => {
                    if (this.firstAdLoaded) {
                        const modifications: any = {
                            externalImpId: config.ExternalImpId,
                            invCode: config.PageGroup,
                            trafficSourceCode: 'pg:' + config.PageGroup,
                            sizes: config.AdSizes,
                            allowedFormats: config.AllowedFormats,
                        };

                        apn.modifyTag(this.containerId, modifications);
                        apn.refresh([this.containerId]);
                    } else {
                        this.firstAdLoaded = true;
                        apn.showTag(this.containerId);
                    }
                });
            }
        }
    }
    modify() {
        this.refresh();
    }
    logCosmosOnlyDataPoint(anAuctionId: string) {
        this.datapoint.addCosmosOnlyData(
            JSON.stringify({
                Asid: config.ExternalImpId,
                GDPRConsentString_2: gdprTcfStore.gdprTcfString || this.gdprConsentDataString,
                AnAuctionId: anAuctionId || 'NoAnAuctionIdGot',
            })
        );
    }
}
