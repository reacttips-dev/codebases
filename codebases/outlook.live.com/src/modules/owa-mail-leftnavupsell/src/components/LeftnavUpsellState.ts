import { RebrandedRenewMessage2 } from '../strings.locstring.json';
import {
    UpgradeRebrandedMessage1,
    UpgradeMessage2,
    ReactiveRebrandedMessage,
} from './LeftnavUpsellState.locstring.json';
import loc from 'owa-localize';
import { isFeatureEnabled } from 'owa-feature-flags';
import { LeftNavUpsellState, ButtonIconType } from '../store/schema/leftNavUpsellState';

export async function getUpsellState(): Promise<LeftNavUpsellState> {
    if (isFeatureEnabled('wvn-sxsEditButtonSplitcf')) {
        return upsellState.upsellWovenEditButtonSplitControl;
    } else if (
        isFeatureEnabled('wvn-sxsEditButtonSplit') ||
        isFeatureEnabled('wvn-editOptionsMasterFlight')
    ) {
        return upsellState.upsellWovenEditButtonSplitTreatment;
    } else {
        return upsellState.regularUpsell;
    }
}

const diamondIconPath = 'resources/leftNavUpsellIcons/premium-diamond-01.svg';

const upsellState = {
    upsellWovenEditButtonSplitTreatment: {
        isHidden: false,
        url: 'https://go.microsoft.com/fwlink/?linkid=2141325&clcid=0x409',
        datapointNameShow: 'LeftNavPremiumUpsellWovenEditButtonSplitTreatmentDisplayed',
        datapointNameClicked: 'LeftNavPremiumUpsellWovenEditButtonSplitTreatmentClicked',
        buttonText: loc(UpgradeRebrandedMessage1),
        buttonTextLine2: loc(UpgradeMessage2),
        buttonIconPath: diamondIconPath,
        buttonIconType: ButtonIconType.SvgIcon,
    },
    upsellWovenEditButtonSplitControl: {
        isHidden: false,
        url: 'https://go.microsoft.com/fwlink/?linkid=2141326&clcid=0x409',
        datapointNameShow: 'LeftNavPremiumUpsellWovenEditButtonSplitControlDisplayed',
        datapointNameClicked: 'LeftNavPremiumUpsellWovenEditButtonSplitControlClicked',
        buttonText: loc(UpgradeRebrandedMessage1),
        buttonTextLine2: loc(UpgradeMessage2),
        buttonIconPath: diamondIconPath,
        buttonIconType: ButtonIconType.SvgIcon,
    },
    regularUpsell: {
        isHidden: false,
        url: 'https://go.microsoft.com/fwlink/?linkid=2123186&ep=',
        datapointNameShow: 'LeftNavPremiumUpsellDisplayed',
        datapointNameClicked: 'LeftNavPremiumUpsellClicked',
        buttonText: loc(UpgradeRebrandedMessage1),
        buttonTextLine2: loc(UpgradeMessage2),
        buttonIconPath: diamondIconPath,
        buttonIconType: ButtonIconType.SvgIcon,
    },
    noCCTreatmentRenewUpsell: {
        isHidden: false,
        url:
            'https://go.microsoft.com/fwlink/?linkid=867712&WT.mc_id=PROD_OL-Web_InApp_LeftNav_NoCCTreatmentRenew&ep=',
        datapointNameShow: 'LeftNavPremiumUpsellRenewNoCCTreatment',
        datapointNameClicked: 'LeftNavPremiumUpsellRenewClickedNoCCTreatment',
        buttonText: loc(RebrandedRenewMessage2),
        buttonTextLine2: '',
        buttonIconPath: diamondIconPath,
        buttonIconType: ButtonIconType.SvgIcon,
    },
    noCCTreatmentReactivateUpsell: {
        isHidden: false,
        url:
            'https://go.microsoft.com/fwlink/?linkid=867712&WT.mc_id=PROD_OL-Web_InApp_LeftNav_NoCCTreatmentReactivate&ep=',
        datapointNameShow: 'LeftNavPremiumUpsellReactivateDisplayedNoCCTreatment',
        datapointNameClicked: 'LeftNavPremiumUpsellReactivateClickedNoCCTreatment',
        buttonText: loc(ReactiveRebrandedMessage),
        buttonTextLine2: loc(UpgradeMessage2),
        buttonIconPath: diamondIconPath,
        buttonIconType: ButtonIconType.SvgIcon,
    },
};

export default upsellState;
