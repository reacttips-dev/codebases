import React, { FC, useMemo, useState, useEffect } from "react";
import { NavBarGroupItemWithButton } from "@similarweb/ui-components/dist/navigation-bar";
import { i18nFilter } from "filters/ngFilters";
import { CompetitiveTrackerService } from "services/competitiveTracker/competitiveTrackerService";
import {
    GroupItemContainer,
    ICompetitiveTrackingSectionProps,
    TRACKING_HOME_PAGE,
    TRACKING_TRACKER_PAGE,
    TRACKING_WIZARD_PAGE,
} from "./CompetitiveTrackingTypes";
import { renderGroupIcon } from "./CompetitiveTrackingHelper";
import { renderTrackerNavItems } from "components/SecondaryBar/NavBars/MarketResearch/NavBarSections/CompetitiveTracking/CompetitiveTrackingHelper";
import { Injector } from "common/ioc/Injector";
import { IRootScopeService } from "angular";
import { ITrackers } from "services/competitiveTracker/types";
import { swSettings } from "common/services/swSettings";
import { PreferencesService } from "services/preferences/preferencesService";
import {
    EUserArenaOrTrackerPreference,
    UserArenaOrTrackerPreferenceKey,
} from "pages/competitive-tracking/arena/types";
import { marketingWorkspaceApiService } from "services/marketingWorkspaceApiService";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { colorsPalettes } from "@similarweb/styles";

export const CompetitiveTrackingSection: FC<ICompetitiveTrackingSectionProps> = (props) => {
    const { currentPage, navigator, params } = props;

    const services = useMemo(() => {
        return {
            translate: i18nFilter(),
            trackersService: CompetitiveTrackerService,
            rootScope: Injector.get<IRootScopeService>("$rootScope"),
            tracking: TrackWithGuidService,
        };
    }, []);

    const [userTrackers, setUserTrackers] = useState<ITrackers>(() =>
        services.trackersService.get(),
    );

    // temporary solution, wil be deleted by EOY.
    const [workspaces, setWorkspaces] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const { hasMR, isSimilarWebUser, isFro } = swSettings.user;
    useEffect(() => {
        const fetchWorkspaces = async () => {
            setIsLoading(true);
            try {
                const workspaces = await marketingWorkspaceApiService.getMarketingWorkspaces();
                setWorkspaces(workspaces);
            } finally {
                setIsLoading(false);
            }
        };
        if (hasMR && !isSimilarWebUser && !isFro) fetchWorkspaces();
    }, []);

    const groupState = useMemo(() => {
        const hasSelectedTracker = userTrackers?.some((tracker) => tracker.id === params.trackerId);
        const isGroupSelected = currentPage === TRACKING_HOME_PAGE;
        const isGroupOpen = isGroupSelected || hasSelectedTracker;

        return {
            hasSelectedTracker,
            isGroupSelected,
            isGroupOpen,
        };
    }, [userTrackers, params, currentPage]);

    // In case any of the trackers has been updated/deleted/added, we want to make sure
    // that we re-render the navigation menu with the updated trackers. so - upon navigation
    // change, we update the trackers list, which causes the TrackerNavItems to re-render.
    useEffect(() => {
        const updateTrackers = () => {
            const updatedTrackers = services.trackersService.get();
            setUserTrackers(updatedTrackers);
        };

        services.rootScope.$on("navChangeComplete", updateTrackers);
        services.rootScope.$on("navUpdate", updateTrackers);
    }, [services, setUserTrackers]);

    const handleGroupClick = () => {
        navigator.go(TRACKING_HOME_PAGE);
    };

    const handleTrackerClick = (trackerId: string) => {
        navigator.go(TRACKING_TRACKER_PAGE, { trackerId });
    };

    const handleAddTrackerClick = () => {
        services.tracking.trackWithGuid("competitive.tracking.create.new.tracker", "click");
        navigator.go(TRACKING_WIZARD_PAGE);
    };

    const TrackerNavItems = useMemo(() => {
        return renderTrackerNavItems(userTrackers, handleTrackerClick, params?.trackerId);
    }, [userTrackers, handleTrackerClick, params]);

    const isAddDisabled = !CompetitiveTrackerService.allowToAddTracker();
    const hasZeroWorkspaces = !workspaces || workspaces?.length === 0;
    const optIn =
        PreferencesService.get(UserArenaOrTrackerPreferenceKey) ===
        EUserArenaOrTrackerPreference.TRACKER;
    const shouldDisplayTrackersSection =
        !isFro && (isSimilarWebUser || (hasMR && hasZeroWorkspaces) || optIn);
    if (!shouldDisplayTrackersSection) {
        return null;
    }
    if (isLoading) {
        return <PixelPlaceholderLoader width={"100%"} height={24} />;
    }
    return (
        <div style={{ borderBottom: `1px solid ${colorsPalettes.carbon[100]}` }}>
            <GroupItemContainer>
                <NavBarGroupItemWithButton
                    id="trackers-group"
                    text={services.translate("sidebar.marketresearch.tracking.title")}
                    isSelected={groupState.isGroupSelected}
                    isOpened={groupState.isGroupOpen}
                    buttonIcon="add"
                    onClick={handleGroupClick}
                    onButtonClick={!isAddDisabled && handleAddTrackerClick}
                    renderIconToggle={() => renderGroupIcon(groupState.isGroupSelected)}
                    badgeType="beta"
                    isButtonDisabled={isAddDisabled}
                >
                    {TrackerNavItems}
                </NavBarGroupItemWithButton>
            </GroupItemContainer>
        </div>
    );
};
