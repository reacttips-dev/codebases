import React, { useMemo } from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import { i18nFilter } from "filters/ngFilters";
import { onClickTryTracker } from "pages/competitive-tracking/arena/utils";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

export const TryTrackerButton = ({ onClickCallback }) => {
    const services = useMemo(() => {
        return {
            navigator: Injector.get<SwNavigator>("swNavigator"),
            eventTracker: TrackWithGuidService,
        };
    }, []);

    return (
        <Button
            type={"primary"}
            onClick={() => {
                onClickCallback();
                onClickTryTracker(services);
            }}
        >
            {i18nFilter()("competitive.tracker.arena.teaser.try.tracker")}
        </Button>
    );
};
