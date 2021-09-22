import { AffiliatesIcon } from "pages/competitive-tracking/arena/styled";
import React, { useMemo } from "react";
import { Banner } from "@similarweb/ui-components/dist/banner";
import { onClickTryTracker } from "pages/competitive-tracking/arena/utils";
import { i18nFilter } from "filters/ngFilters";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

export const TeaserBanner = () => {
    const services = useMemo(() => {
        return {
            translate: i18nFilter(),
            navigator: Injector.get<SwNavigator>("swNavigator"),
            eventTracker: TrackWithGuidService,
        };
    }, []);

    return (
        <div>
            <Banner
                title={services.translate("competitive.tracker.arena.teaser.banner.title")}
                subtitle={services.translate("competitive.tracker.arena.teaser.banner.subtitle")}
                buttonText={services.translate("competitive.tracker.arena.teaser.banner.cta")}
                buttonType={"primary"}
                onButtonClick={() => onClickTryTracker(services)}
                CustomIcon={<AffiliatesIcon iconName={"affiliates-competition"} />}
            />
        </div>
    );
};
