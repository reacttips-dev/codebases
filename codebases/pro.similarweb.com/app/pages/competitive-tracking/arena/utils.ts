import { PreferencesService } from "services/preferences/preferencesService";
import {
    EUserArenaOrTrackerPreference,
    UserArenaOrTrackerPreferenceKey,
} from "pages/competitive-tracking/arena/types";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

export const onClickTryTracker = (services: {
    navigator: SwNavigator;
    eventTracker: typeof TrackWithGuidService;
}) => {
    PreferencesService.add({
        [UserArenaOrTrackerPreferenceKey]: EUserArenaOrTrackerPreference.TRACKER,
    });
    services.eventTracker.trackWithGuid("competitive.tracking.banner.click", "click");
    services.navigator.go("companyresearch_competitivetracking_wizard");
};
