import PrimaryHomepageItem from "@similarweb/ui-components/dist/homepages/primary/src/PrimaryHomepageItem";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import React, { useMemo } from "react";
import { RoadMapIcon, AffiliateIcon, BenchmarkIcon } from "../DigitalMarketingHomepageIcons";
import { useTrack } from "components/WithTrack/src/useTrack";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { DigitalMarketingHomePage } from "../DigitalMarketingHomepageComponent";

const homepageItemClick = (trackName, gotoState, navigator, trackWithGuid): void => {
    // eslint-disable-next-line @typescript-eslint/camelcase
    trackWithGuid("ai-homepage.item.click", "click", { item_name: trackName });
    navigator.go(gotoState);
};

const getHomepageItems = (navigator: SwNavigator, translate, trackWithGuid): JSX.Element[] => {
    return [
        <PrimaryHomepageItem
            key="keyword-research"
            primaryText={translate(
                "aquisitionintelligence.homepage.ntaffiliate.monitor.primaryText",
            )}
            secondaryText={translate(
                "aquisitionintelligence.homepage.ntaffiliate.monitor.secondaryText",
            )}
            buttonIconName="arrow-right"
            onClick={homepageItemClick.bind(
                null,
                "Monitor competitors",
                "marketingWorkspace-home",
                navigator,
                trackWithGuid,
            )}
            renderImage={RoadMapIcon}
        />,
        <PrimaryHomepageItem
            key="affiliate-research"
            primaryText={translate("aquisitionintelligence.homepage.ntaffiliate.find.primaryText")}
            secondaryText={translate(
                "aquisitionintelligence.homepage.ntaffiliate.find.secondaryText",
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
            key="analyize-keyword"
            primaryText={translate(
                "aquisitionintelligence.homepage.ntaffiliate.qualify.primaryText",
            )}
            secondaryText={translate(
                "aquisitionintelligence.homepage.ntaffiliate.qualify.secondaryText",
            )}
            buttonIconName="arrow-right"
            onClick={homepageItemClick.bind(
                null,
                "qualify affiliates",
                "affiliateanalysis_home",
                navigator,
                trackWithGuid,
            )}
            renderImage={BenchmarkIcon}
        />,
    ];
};

export const DigitalMarketingNoTouchAffiliate = () => {
    const translate = useTranslation();
    const navigator = useMemo(() => {
        return Injector.get<SwNavigator>("swNavigator");
    }, []);
    const [track, trackWithGuid] = useTrack();

    return (
        <DigitalMarketingHomePage
            homePageItems={getHomepageItems(navigator, translate, trackWithGuid)}
            title={translate("aquisitionintelligence.homepage.ntaffiliate.mainTitle")}
            subtitle={translate("aquisitionintelligence.homepage.ntaffiliate.subTitle")}
            taglineText={translate("aquisitionintelligence.homepage.ntaffiliate.tagline")}
            bodyText={translate("aquisitionintelligence.homepage.ntaffiliate.bodyText")}
            includeKeywordsOnAutocomplete={false}
        />
    );
};
