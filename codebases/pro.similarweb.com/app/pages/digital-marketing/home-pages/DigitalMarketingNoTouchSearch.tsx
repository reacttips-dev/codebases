import PrimaryHomepageItem from "@similarweb/ui-components/dist/homepages/primary/src/PrimaryHomepageItem";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import React, { useMemo } from "react";
import {
    AdCreativeIcon,
    AffiliateIcon,
    KeywordsAnaysisIcon,
    KeywordsIcon,
    MonitorIcon,
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
            key="analyize-keyword"
            primaryText={translate(
                "aquisitionintelligence.homepage.notouchsearch.keyword.primaryText",
            )}
            secondaryText={translate(
                "aquisitionintelligence.homepage.notouchsearch.keyword.secondaryText",
            )}
            buttonIconName="arrow-right"
            onClick={homepageItemClick.bind(
                null,
                "analyze keyword",
                "keywordanalysis_home",
                navigator,
                trackWithGuid,
            )}
            renderImage={KeywordsAnaysisIcon}
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
            key="affiliate-research"
            primaryText={translate(
                "aquisitionintelligence.homepage.notouchsearch.monitor.primaryText",
            )}
            secondaryText={translate(
                "aquisitionintelligence.homepage.notouchsearch.monitor.secondaryText",
            )}
            buttonIconName="arrow-right"
            onClick={homepageItemClick.bind(
                null,
                "Monitor competitors",
                "marketingWorkspace-home",
                navigator,
                trackWithGuid,
            )}
            renderImage={MonitorIcon}
        />,
    ];
};
export const DigitalMarketingNoTouchSearch = () => {
    const translate = useTranslation();
    const navigator = useMemo(() => {
        return Injector.get<SwNavigator>("swNavigator");
    }, []);
    const [track, trackWithGuid] = useTrack();
    return (
        <DigitalMarketingHomePage
            homePageItems={getHomepageItems(navigator, translate, trackWithGuid)}
            title={translate("aquisitionintelligence.homepage.notouchsearch.mainTitle")}
            subtitle={translate("aquisitionintelligence.homepage.notouchsearch.subTitle")}
            taglineText={translate("aquisitionintelligence.homepage.notouchsearch.tagline")}
            bodyText={translate("aquisitionintelligence.homepage.notouchsearch.bodyText")}
        />
    );
};
