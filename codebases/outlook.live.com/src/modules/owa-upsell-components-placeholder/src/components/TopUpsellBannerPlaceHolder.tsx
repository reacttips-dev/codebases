import { observer } from 'mobx-react-lite';
import * as React from 'react';
import { LightningId } from 'owa-lightning-v2';
import { IrisUpsellBanner } from 'owa-upsell-components';
import { MailtoProtocolUpsellBanner } from 'owa-mailto-protocol-handler';
import { upsellBannerStore } from '../store/UpsellBannerStore';
import { BannerType } from '../utils/BannerType';
import { shouldShowUpsellBanner } from '../utils/shouldShowUpsellBanner';

export const TopUpsellBannerPlaceHolder = observer(function TopUpsellBannerPlaceHolder() {
    const [showUpsellBanner, setShowUpsellBanner] = React.useState<boolean>(false);
    React.useEffect(() => {
        async function init() {
            let shouldShowBanner: boolean = await shouldShowUpsellBanner();
            setShowUpsellBanner(shouldShowBanner);
        }
        init();
    }, []);

    if (showUpsellBanner) {
        switch (upsellBannerStore.upsellBannerType) {
            case BannerType.CommercialBizBar:
                return <IrisUpsellBanner lid={LightningId.CommercialBizBar} />;
            case BannerType.IrisUpsell:
                return <IrisUpsellBanner lid={LightningId.EdgeUpsell} />;
            case BannerType.OWAMailHandlerUpsell:
                return <MailtoProtocolUpsellBanner lid={LightningId.MailtoProtocolHandler} />;
            default:
                return <div />;
        }
    }
    return null;
});
