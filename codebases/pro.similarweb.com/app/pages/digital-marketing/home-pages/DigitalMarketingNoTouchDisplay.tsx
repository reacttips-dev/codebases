import PrimaryHomepageItem from "@similarweb/ui-components/dist/homepages/primary/src/PrimaryHomepageItem";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import React, { useMemo } from "react";
import {
    AdTechIcon,
    BenchmarkIcon,
    LeaderIcon,
    PublishersIcon,
} from "../DigitalMarketingHomepageIcons";
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
                "aquisitionintelligence.homepage.ntdisplay.paid_acquisition_strategy.primaryText",
            )}
            secondaryText={translate(
                "aquisitionintelligence.homepage.ntdisplay.paid_acquisition_strategy.secondaryText",
            )}
            buttonIconName="arrow-right"
            onClick={homepageItemClick.bind(
                null,
                "analyze acquisition strategy",
                "competitiveanalysis_home",
                navigator,
                trackWithGuid,
            )}
            renderImage={AdTechIcon}
        />,
        <PrimaryHomepageItem
            key="affiliate-research"
            primaryText={translate(
                "aquisitionintelligence.homepage.ntdisplay.notouchsearch.monitor.primaryText",
            )}
            secondaryText={translate(
                "aquisitionintelligence.homepage.ntdisplay.notouchsearch.monitor.secondaryText",
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
        <PrimaryHomepageItem
            key="analyize-keyword"
            primaryText={translate(
                "aquisitionintelligence.homepage.ntdisplay.notouchsearch.keyword.primaryText",
            )}
            secondaryText={translate(
                "aquisitionintelligence.homepage.ntdisplay.notouchsearch.keyword.secondaryText",
            )}
            buttonIconName="arrow-right"
            onClick={homepageItemClick.bind(
                null,
                "qualify publishers",
                "analyzepublishers_home",
                navigator,
                trackWithGuid,
            )}
            renderImage={BenchmarkIcon}
        />,
        <PrimaryHomepageItem
            key="adcreative-research"
            primaryText={translate(
                "aquisitionintelligence.homepage.ntdisplay.adCreativeResearch.primaryText",
            )}
            secondaryText={translate(
                "aquisitionintelligence.homepage.ntdisplay.adCreativeResearch.secondaryText",
            )}
            buttonIconName="arrow-right"
            onClick={homepageItemClick.bind(
                null,
                "find ad networks",
                "findadnetworks_home",
                navigator,
                trackWithGuid,
            )}
            renderImage={LeaderIcon}
        />,
    ];
};

export const DigitalMarketingNoTouchDisplay = () => {
    const translate = useTranslation();
    const navigator = useMemo(() => {
        return Injector.get<SwNavigator>("swNavigator");
    }, []);
    const [track, trackWithGuid] = useTrack();

    return (
        <DigitalMarketingHomePage
            homePageItems={getHomepageItems(navigator, translate, trackWithGuid)}
            title={translate("aquisitionintelligence.homepage.ntdisplay.notouchsearch.mainTitle")}
            subtitle={translate("aquisitionintelligence.homepage.ntdisplay.notouchsearch.subTitle")}
            taglineText={translate(
                "aquisitionintelligence.homepage.ntdisplay.notouchsearch.tagline",
            )}
            bodyText={translate("aquisitionintelligence.homepage.ntdisplay.notouchsearch.bodyText")}
            includeKeywordsOnAutocomplete={false}
        />
    );
};
