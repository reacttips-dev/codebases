import { observer } from 'mobx-react-lite';
import { RebrandedRenewMessage2 } from '../strings.locstring.json';
import { PremiumIconAltText } from './LeftnavUpsellState.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';
import { logUsage } from 'owa-analytics';

import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { IsPremiumConsumerUser } from 'owa-mail-ads-shared/lib/sharedAdsUtils';
import {
    renewUserSubscription,
    MDollarSubscriptionData,
    getUserMDollarSubscription,
    fetchUserMDollarSubscription,
    UserMDollarSubscriptionResponse,
} from 'owa-premium-subscription';
import { getUpsellState, default as upsellState } from './LeftnavUpsellState';
import store from '../store/store';
import setUpsellState from '../mutators/setUpsellState';
import addDays from 'date-fns/add_days';
import { isFeatureEnabled } from 'owa-feature-flags';
import { lazyLaunchOwaPremiumUpsellModal } from 'owa-premium-upsell-modal';
import { isLeftRailVisible } from 'owa-left-rail-utils/lib/isLeftRailVisible';
import { getPackageBaseUrl } from 'owa-config';
import { ButtonIconType } from '../store/schema/leftNavUpsellState';
import { Icon } from '@fluentui/react/lib/Icon';
import {
    lazyInitializeLeftNavUpsellState,
    lazyArcStore,
    lazyLogBeaconCall,
    lazyLogImpressionCall,
} from 'owa-iris-store';
import { Module } from 'owa-workloads';

import styles from './LeftnavUpsell.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

interface SubscriptionInfo {
    expireDate: Date;
    isActive: boolean;
    isAutoRenew: boolean;
    isSuppressedOfferId: boolean;
    isWithinResellerRestrictionPeriod: boolean;
}
export default observer(function LeftnavUpsell() {
    React.useEffect(() => {
        if (IsPremiumConsumerUser()) {
            displayLeftNavUpsellForPremiumUser();
        } else {
            displayLeftNavUpsellForNonPremiumUser();
        }
    }, []);
    let leftNavUpsellCss = styles.display;
    if (store.isHidden) {
        leftNavUpsellCss = styles.hide;
    } else {
        logUsage(store.datapointNameShow);
    }

    let iconPath =
        store.buttonIconType == ButtonIconType.UrlIcon
            ? store.buttonIconPath
            : getPackageBaseUrl() + store.buttonIconPath;
    let icon =
        store.buttonIconType == ButtonIconType.SvgIcon ||
        store.buttonIconType == ButtonIconType.UrlIcon ? (
            <img className={styles.leftNavUpsellSvg} src={iconPath} alt={loc(PremiumIconAltText)} />
        ) : (
            <Icon iconName={store.buttonIconPath} />
        );
    return (
        <div onClick={navigateTo} className={leftNavUpsellCss}>
            <button className={styles.upselllink}>
                <div
                    className={classNames(
                        styles.prose,
                        !isLeftRailVisible(Module.Mail) && styles.horizontalModuleSwitcherPadding
                    )}>
                    <span className={styles.suffix}>
                        {store.buttonText} {store.buttonTextLine2}
                    </span>
                </div>
                <div className={styles.leftnavOrnament}>{icon}</div>
            </button>
        </div>
    );
});

function navigateTo(ev: any) {
    ev.stopPropagation();
    // ifinapp upsell is enabled show the upsell modal
    if (isFeatureEnabled('auth-leftNavInAppUpsell')) {
        lazyLaunchOwaPremiumUpsellModal.importAndExecute();
    } else if (isFeatureEnabled('auth-leftNavIrisControl')) {
        if (store.irisBeaconUrl) {
            lazyLogBeaconCall.importAndExecute(store.irisBeaconUrl, 'Click');
        }
        window.open(store.url, '_blank');
    } else {
        logUsage(store.datapointNameClicked);
        const upgradeUrl =
            store.url +
            encodeURIComponent(getUserConfiguration().SessionSettings.EncryptedUserPuid);
        window.open(upgradeUrl, '_blank');
        if (store.buttonText == loc(RebrandedRenewMessage2)) {
            setUpsellState({
                isHidden: true,
                url: '',
                datapointNameShow: '',
                datapointNameClicked: '',
                buttonText: '',
                buttonTextLine2: '',
                buttonIconPath: '',
                buttonIconType: ButtonIconType.SvgIcon,
            });
            renewUserSubscription();
        }
    }
}

function retriveUserMDollarSubscriptionInfo(response: UserMDollarSubscriptionResponse) {
    const mDollarResult: SubscriptionInfo = {
        expireDate: undefined,
        isAutoRenew: false,
        isActive: false,
        isSuppressedOfferId: false,
        isWithinResellerRestrictionPeriod: false,
    };
    if (response?.subscriptions?.length) {
        // Sort the subscriptions array in decreasing order of endDate
        response.subscriptions.sort((value1, value2) => {
            return new Date(value2.endDate).getTime() - new Date(value1.endDate).getTime();
        });
        const lastmDollarSubscription: MDollarSubscriptionData = response.subscriptions[0];
        mDollarResult.isActive = true;
        mDollarResult.isAutoRenew = lastmDollarSubscription.autoRenew;
        mDollarResult.expireDate = new Date(lastmDollarSubscription.endDate);
        mDollarResult.isWithinResellerRestrictionPeriod =
            lastmDollarSubscription.isWithinResellerRestrictionPeriod;
    }
    return mDollarResult;
}

// If the date is within ten days of expire, user is eligible for renew upsell
function isMDollarSubscriptionEligibleForRenew(subscription: SubscriptionInfo): boolean {
    const today = new Date();
    if (
        subscription.expireDate &&
        subscription.isActive &&
        subscription.expireDate > today &&
        addDays(subscription.expireDate, -10) < today &&
        !subscription.isAutoRenew &&
        !subscription.isWithinResellerRestrictionPeriod
    ) {
        return true;
    }
    return false;
}

// if subscription expire date is within 10 days of today, user is eligible for reactivate upsell
function isEligibleForReactivate(subscription: SubscriptionInfo): boolean {
    const today = new Date();
    if (
        subscription.expireDate &&
        subscription.expireDate < today &&
        addDays(subscription.expireDate, 10) > today
    ) {
        return true;
    }
    return false;
}

function processMDollarSubscriptionResponseForPremiumUser(
    response: UserMDollarSubscriptionResponse
) {
    const subscriptionInfo = retriveUserMDollarSubscriptionInfo(response);
    // If the date is within ten days of expire show renew upsell
    if (isMDollarSubscriptionEligibleForRenew(subscriptionInfo)) {
        // Due to the current failure of subsync api calls to update sds we want to recheck with m$
        fetchUserMDollarSubscription().then(jsonResponse => {
            const latestSubscriptionInfo = retriveUserMDollarSubscriptionInfo(jsonResponse);
            if (isMDollarSubscriptionEligibleForRenew(latestSubscriptionInfo)) {
                setUpsellState(upsellState.noCCTreatmentRenewUpsell);
            }
        });
    } else if (subscriptionInfo.expireDate != null && subscriptionInfo.expireDate < new Date()) {
        // Due to the current failure of subsync api calls the user subscription is out of sync as the expire date is in the past and the user is still premium
        fetchUserMDollarSubscription();
    }
    // else no-op
}

// Process the subscription response, and show renew/reactive upsell based on the subscription status
async function processMDollarSubscriptionResponseForNonPremiumUser(
    response: UserMDollarSubscriptionResponse
) {
    const subscriptionInfo = retriveUserMDollarSubscriptionInfo(response);
    // if subscription not active and user is within 10 days of expire date, show reactivate upsell
    if (isEligibleForReactivate(subscriptionInfo)) {
        setUpsellState(upsellState.noCCTreatmentReactivateUpsell);
    } else {
        setUpsellState(await getUpsellState());
    }
}

// For premium user, if there is no subscription info at server, fetch it first to get it cached.
// Otherwise process based on the subscription type
function displayLeftNavUpsellForPremiumUser() {
    getUserMDollarSubscription().then(jsonResponse => {
        if (jsonResponse) {
            if (jsonResponse.subscriptions && jsonResponse.subscriptions.length == 0) {
                // no data in sds, so fetchData from M$
                fetchUserMDollarSubscription().then(jsonResponse => {
                    processMDollarSubscriptionResponseForPremiumUser(jsonResponse);
                });
            } else {
                processMDollarSubscriptionResponseForPremiumUser(jsonResponse);
            }
        }
    });
}

// For nonPremium user, display reacitvate upsell if has expired subscription
// Otherwise go to control group or regular upsell
function displayLeftNavUpsellForNonPremiumUser() {
    getUserMDollarSubscription().then(async jsonResponse => {
        if (jsonResponse) {
            if (jsonResponse.subscriptions && jsonResponse.subscriptions.length == 0) {
                setUpsellState(await getUpsellState());
            } else {
                processMDollarSubscriptionResponseForNonPremiumUser(jsonResponse);
            }
        }
        initializeLeftNavUpsellStateFromIris();
    });
}

// Get the LeftNav Upsell state from iris
async function initializeLeftNavUpsellStateFromIris() {
    if (isFeatureEnabled('auth-leftNavIrisControl')) {
        await lazyInitializeLeftNavUpsellState.importAndExecute();
        let arcStore = await lazyArcStore.import();
        if (arcStore.message) {
            setUpsellState({
                isHidden: IsPremiumConsumerUser(),
                url: arcStore.userRedirectionUrl,
                datapointNameShow: '',
                datapointNameClicked: '',
                buttonText: arcStore.message,
                buttonTextLine2: '',
                buttonIconPath: arcStore.iconUri,
                buttonIconType: ButtonIconType.UrlIcon,
                irisImpressionUrl: arcStore.impressionBaseUri,
                irisBeaconUrl: arcStore.trackingBaseUri,
            });
            lazyLogImpressionCall.importAndExecute(arcStore.impressionBaseUri);
        }
    }
}
