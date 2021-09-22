import PrimaryHomepageItem from "@similarweb/ui-components/dist/homepages/primary/src/PrimaryHomepageItem";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import React, { useMemo } from "react";
import {
    AdCreativeIcon,
    AffiliateIcon,
    KeywordsIcon,
    PublishersIcon,
} from "../DigitalMarketingHomepageIcons";
import { useTrack } from "components/WithTrack/src/useTrack";
import { DigitalMarketingHomePage } from "../DigitalMarketingHomepageComponent";
import { useTranslation } from "components/WithTranslation/src/I18n";

const homepageItemClick = (trackName, gotoState, navigator, trackWithGuid): void => {
    // eslint-disable-next-line @typescript-eslint/camelcase
    trackWithGuid("ai-homepage.item.click", "click", { item_name: trackName });
    navigator.go(gotoState);
};

const getHomepageItems = (navigator: SwNavigator, translate, trackWithGuid): JSX.Element[] => {
    return [
        <PrimaryHomepageItem
            key="affiliate-research"
            primaryText={translate("aquisitionintelligence.homepage.affiliateResearch.primaryText")}
            secondaryText={translate(
                "aquisitionintelligence.homepage.affiliateResearch.secondaryText",
            )}
            buttonIconName="arrow-right"
            onClick={homepageItemClick.bind(
                null,
                "find affiliates",
                "findaffiliates_home",
                navigator,
                trackWithGuid,
            )}
            renderImage={AffiliateIcon}
        />,
        <PrimaryHomepageItem
            key="adcreative-research"
            primaryText={translate(
                "aquisitionintelligence.homepage.adCreativeResearch.primaryText",
            )}
            secondaryText={translate(
                "aquisitionintelligence.homepage.adCreativeResearch.secondaryText",
            )}
            buttonIconName="arrow-right"
            onClick={homepageItemClick.bind(
                null,
                "find ad creatives",
                "findSearchTextAds_home",
                navigator,
                trackWithGuid,
            )}
            renderImage={AdCreativeIcon}
        />,
        <PrimaryHomepageItem
            key="mediabuying-research"
            primaryText={translate(
                "aquisitionintelligence.homepage.mediaBuyingResearch.primaryText",
            )}
            secondaryText={translate(
                "aquisitionintelligence.homepage.mediaBuyingResearch.secondaryText",
            )}
            buttonIconName="arrow-right"
            onClick={homepageItemClick.bind(
                null,
                "find publishers",
                "findpublishers_home",
                navigator,
                trackWithGuid,
            )}
            renderImage={PublishersIcon}
        />,
    ];
};

export const DigitalMarketingDefault = () => {
    const translate = useTranslation();
    const navigator = useMemo(() => {
        return Injector.get<SwNavigator>("swNavigator");
    }, []);
    const [track, trackWithGuid] = useTrack();
    return (
        <DigitalMarketingHomePage
            homePageItems={getHomepageItems(navigator, translate, trackWithGuid)}
            title={translate("aquisitionintelligence.homepage.mainTitle")}
            subtitle={translate("aquisitionintelligence.homepage.subTitle")}
            taglineText={translate("aquisitionintelligence.homepage.tagline")}
            bodyText={translate("aquisitionintelligence.homepage.bodyText")}
        />
    );
};
