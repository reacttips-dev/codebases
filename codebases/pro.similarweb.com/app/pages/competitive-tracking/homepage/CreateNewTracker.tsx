import { StartPageButton } from "pages/competitive-tracking/startpage/CompetitiveTrackingStartPageStyles";
import { CompetitiveTrackerService } from "services/competitiveTracker/competitiveTrackerService";
import React from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { i18nFilter } from "filters/ngFilters";

export const CreateNewTracker: React.FC<{ buttonComponent?: React.FC }> = ({
    buttonComponent: ButtonComponent = StartPageButton,
}) => {
    const handleCreateNewTracker = () => {
        TrackWithGuidService.trackWithGuid("competitive.tracking.create.new.tracker", "click");
        Injector.get<SwNavigator>("swNavigator").go("companyresearch_competitivetracking_wizard");
    };
    const i18n = i18nFilter();
    const isDisabled = !CompetitiveTrackerService.allowToAddTracker();
    return (
        <ButtonComponent
            type={"primary"}
            onClick={handleCreateNewTracker}
            iconName={"add"}
            iconSize={"xs"}
            isDisabled={isDisabled}
        >
            {i18n("competitive.tracker.home.create.tracker")}
        </ButtonComponent>
    );
};
