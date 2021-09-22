import { loadDisplayScript } from './AdBar';
import { AdsConfig, AdsProvider, endDatapoint, getAdsConfig } from './AdsConfig';
import { AdType } from './AdType';
import { loadGdprCmp } from '../utils/loadGdprCmp';
import { DatapointStatus, PerformanceDatapoint } from 'owa-analytics';
import { calculateCookieTargeting, cookieTargetingStore } from 'owa-cookie-targeting';
import { isFeatureEnabled } from 'owa-feature-flags';
import { gdprTcfStore } from 'owa-gdpr-ad-tcf';
import { getLiveRampEnvelopId } from 'owa-liveramp';
import { isGdprAdMarket, isLgpdAdFlightEnabled, isLgpdAdMarket } from 'owa-mail-ads-shared';
import { getUserConfiguration } from 'owa-session-store';

interface VzmsspParams {
    msft_asid: string;
    msft_optout: number;
    msft_muid: string;
    msft_envelopeid?: string;
}

let config: AdsConfig;

export default class VerizonYahooRenderer implements AdsProvider {
    private containerId: string;
    private datapoint: PerformanceDatapoint;
    private consentStringPurpose: number[];
    private gdprConsentDataString: string;
    private userLiveRampEnvelopId: string;
    private totalThrottleCount: number = 0;
    private totalImpRequestsCount: number = 0;
    private retryInitializeYahooAdTimes: number = 0;
    private noRefreshReason: string;
    private isGdprAdMarketValue: boolean;
    private isLgpdAdMarketValue: boolean;
    private initialCookieTargetingValue: boolean;

    constructor(containerId: string) {
        if (!config) {
            config = getAdsConfig();
        }
        this.containerId = containerId;
        this.load();
    }

    private async load() {
        let gdprDatapoint = await loadGdprCmp();
        this.gdprConsentDataString = gdprDatapoint.gdprConsentDataString;
        this.consentStringPurpose = gdprDatapoint.consentStringPurpose;
        this.isGdprAdMarketValue = isGdprAdMarket();
        this.isLgpdAdMarketValue = isLgpdAdFlightEnabled() && isLgpdAdMarket();
        await calculateCookieTargeting();
        this.initialCookieTargetingValue = cookieTargetingStore.effectiveOptInValue;
        this.userLiveRampEnvelopId = await getLiveRampEnvelopId(config.ANID);

        this.initializeJacConfigAndFile();
    }

    // Disable or enable the refresh such as flex pane hides the ad
    disableOrEnableRefresh(noRefreshReason?: string) {
        this.noRefreshReason = noRefreshReason;
    }

    refresh(throttleCount?: number, actionName?: string) {
        // If JAC is not there, it means the Yahoo Jac file has not been loaded successfully. We skip the whole refresh section and do not log anything
        // It is supposed an SDK initialization failure is already logged
        if ((window as any).JAC == null) {
            return;
        }

        let datapointName = this.noRefreshReason ? 'AdsNoRefresh' : 'AdsImpressed';
        this.totalImpRequestsCount = this.noRefreshReason
            ? this.totalImpRequestsCount
            : this.totalImpRequestsCount + 1;
        this.totalThrottleCount = this.totalThrottleCount + throttleCount || 0;

        endDatapoint(this.datapoint, DatapointStatus.RequestNotComplete);
        this.datapoint = new PerformanceDatapoint(datapointName);
        const consentStringValue = this.consentStringPurpose
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
            GDPRApplies_2: this.isGdprAdMarketValue,
            GDPRPurposes_2: consentStringValue,
            LGPDApplies: this.isLgpdAdMarketValue,
            LGPDOptInStatus: this.isLgpdAdMarketValue ? cookieTargetingStore.lgpdOptInBit : -1,
            ReadingPanePosition: getUserConfiguration().UserOptions?.GlobalReadingPanePositionReact,
            IsFocusedInboxEnabled: getUserConfiguration().UserOptions?.IsFocusedInboxEnabled,
            FirstPartyCookieOptOut: this.isGdprAdMarketValue
                ? cookieTargetingStore.gdprFirstPartyCookieOptInBit != 2
                : null,
            MSOptOut: cookieTargetingStore.microsoftChoiceCookieOptOutBit == 2,
            SendMuid: cookieTargetingStore.effectiveOptInValue,
            NoRefreshReason: this.noRefreshReason,
            AdProvider: 'VerizonYahoo',
        });
        this.datapoint.addCosmosOnlyData(
            JSON.stringify({
                Asid: config.ExternalImpId,
                GDPRConsentString_2: gdprTcfStore.gdprTcfString || this.gdprConsentDataString,
                LiveRampEnvelopeId: isFeatureEnabled('adsExp-JacLiveRamp-treatment')
                    ? this.userLiveRampEnvelopId
                    : 'NA',
            })
        );

        if (!this.noRefreshReason) {
            if ((window as any).JAC_CONFIG == null) {
                // If JAC_Config or JAC is null, it means the initialLoad is blocked by some external factors, we will try to re-initialize the JAC config and reload the file
                // We will retry three times in this session before giving up. If the file has some long-time file server issue, more tries will not be helpful.
                if (this.retryInitializeYahooAdTimes >= 4) {
                    return;
                } else {
                    this.retryInitializeYahooAdTimes = this.retryInitializeYahooAdTimes + 1;
                    this.initializeJacConfigAndFile();
                }
            } else {
                // Refresh the asid passed in the new ad
                if (
                    (window as any).JAC_CONFIG?.service?.adServer?.VZMSSP?.params?.msft_asid != null
                ) {
                    (window as any).JAC_CONFIG.service.adServer.VZMSSP.params.msft_asid =
                        config.ExternalImpId;
                    (window as any).JAC.setConfig((window as any).JAC_CONFIG);
                }

                if (
                    this.initialCookieTargetingValue != cookieTargetingStore.effectiveOptInValue &&
                    cookieTargetingStore.effectiveOptInValue
                ) {
                    if ((window as any).JAC_CONFIG?.service?.adServer?.VZMSSP?.params != null) {
                        (window as any).JAC_CONFIG.service.adServer.VZMSSP.params.msft_optout = 0;
                        (window as any).JAC_CONFIG.service.adServer.VZMSSP.params.msft_muid =
                            config.MUID;
                        (window as any).JAC.setConfig((window as any).JAC_CONFIG);
                    }

                    if (
                        isFeatureEnabled('adsExp-JacLiveRamp-treatment') &&
                        (window as any).JAC_CONFIG?.service != null &&
                        this.userLiveRampEnvelopId != null
                    ) {
                        (window as any).JAC_CONFIG.service.user = {
                            eids: [
                                {
                                    source: 'liveramp.com',
                                    uids: [
                                        {
                                            id: this.userLiveRampEnvelopId,
                                        },
                                    ],
                                },
                            ],
                        };
                        (window as any).JAC.setConfig((window as any).JAC_CONFIG);
                    }
                }

                // If position does not exist OR position's alias does not equal to the incoming page group
                // We need to create the position as the Ad config is different.
                // This usually happens when the user changes the browser resolution.
                // If position exists AND the incoming page group equals to the position alias, we will call FETCH directly to save some cost
                if (
                    config.JACPosition == 'RR' &&
                    (window as any).JAC.getConfig()?.service?.positions?.RR?.alias !=
                        config.PageGroup
                ) {
                    (window as any).JAC.createPosition('RR', {
                        service: { alias: config.PageGroup, sizes: config.JACAdSize },
                        client: {
                            targetElement: this.containerId,
                            nonFriendlyIframe: {
                                enabled: true,
                            },
                            trackers: {
                                opus: false,
                                smartPixel: true,
                                msftSync: cookieTargetingStore.effectiveOptInValue,
                            },
                        },
                    });
                } else if (
                    config.JACPosition == 'BILLBOARD' &&
                    (window as any).JAC.getConfig()?.service?.positions?.BILLBOARD?.alias !=
                        config.PageGroup
                ) {
                    (window as any).JAC.createPosition('BILLBOARD', {
                        service: { alias: config.PageGroup, sizes: config.JACAdSize },
                        client: {
                            targetElement: this.containerId,
                            nonFriendlyIframe: {
                                enabled: true,
                            },
                            trackers: {
                                opus: false,
                                smartPixel: true,
                                msftSync: cookieTargetingStore.effectiveOptInValue,
                            },
                        },
                    });
                } else {
                    (window as any).JAC.fetch([config.JACPosition]);
                }
            }
        }
    }
    modify() {
        this.refresh();
    }

    private async initializeJacConfigAndFile() {
        let vzmsspParams: VzmsspParams = {
            msft_asid: config.ExternalImpId,
            msft_optout: !cookieTargetingStore.effectiveOptInValue ? 1 : 0,
            msft_muid: cookieTargetingStore.effectiveOptInValue ? config.MUID : null,
        };

        (window as any).JAC_CONFIG = (window as any).JAC_CONFIG || {
            service: {
                adServer: {
                    VZMSSP: {
                        // key/value parameters set on all positions.
                        params: vzmsspParams,
                    },
                },

                // site information
                site: {
                    name: 'Microsoft Outlook '.concat(config.CountryCode),
                    url: 'https://outlook.live.com',
                },

                ...(isFeatureEnabled('adsExp-JacLiveRamp-treatment') &&
                    cookieTargetingStore.effectiveOptInValue &&
                    this.userLiveRampEnvelopId != null && {
                        user: {
                            eids: [
                                {
                                    source: 'liveramp.com',
                                    uids: [
                                        {
                                            id: this.userLiveRampEnvelopId,
                                        },
                                    ],
                                },
                            ],
                        },
                    }),
            },
            client: {
                // this must be set to not have us include OPUS pings
                trackers: {
                    opus: false,
                    smartPixel: true,
                    msftSync: cookieTargetingStore.effectiveOptInValue,
                },
            },
        };

        await loadDisplayScript(AdType.YahooVerizon);

        if ((window as any).JAC) {
            (window as any).JAC.on('FETCH_COMPLETE', (event: any) => {
                // Status from the Yahoo Verizon Ad:
                // status=1 means good ad
                // status=2 means blank ad
                // status=3 means TIMEOUT
                // status=4 means ERROR
                let adLoadStatus;
                if (config.JACPosition == 'RR') {
                    adLoadStatus = event.meta.response.positions?.RR?.status;
                } else {
                    adLoadStatus = event.meta.response.positions?.BILLBOARD?.status;
                }

                this.datapoint.addCustomData({ YahooAdFetchStatus: adLoadStatus });

                // If status is not successful, there will not be RENDER_COMPLETE event triggered. We need to end the endpoint now.
                if (adLoadStatus != 1) {
                    endDatapoint(
                        this.datapoint,
                        DatapointStatus.ServerError,
                        'Verizon_FETCH_COMPLETE_Error'
                    );
                }
            });
            (window as any).JAC.on('FETCH_ERROR', () => {
                endDatapoint(this.datapoint, DatapointStatus.ServerError, 'Verizon_FETCH_ERROR');
            });
            (window as any).JAC.on('RENDER_COMPLETE', () => {
                endDatapoint(this.datapoint);
            });
            this.refresh();
        }
    }
}
