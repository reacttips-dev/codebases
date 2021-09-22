import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import { TrafficAndEngagementContainer } from "pages/website-analysis/TrafficAndEngagement/Components/StyledComponents";
import { TrafficAndEngagementTabs } from "pages/website-analysis/TrafficAndEngagement/Components/TrafficAndEngagementTabs";
import {
    initPOPItemsCompareMode,
    initPOPItemsSingleMode,
    tabs,
} from "pages/website-analysis/TrafficAndEngagement/MD/Tabs";
import { DeduplicatedAudience } from "pages/website-analysis/TrafficAndEngagement/Metrics/DeduplicatedAudience";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import React from "react";
import { connect } from "react-redux";

const TrafficAndEngagementHighLevelDataInner: React.FunctionComponent<any> = ({
    params,
    showGAApprovedData,
    showBetaBranchData,
}) => {
    const chosenSitesService = Injector.get("chosenSites") as any;
    const chosenSites = chosenSitesService.get();
    const { duration, selectedWidgetTab, webSource, comparedDuration } = params;
    const meta = {
        is28Days: duration === "28d",
        isSingleMode: chosenSites.length === 1,
        isOneWebSource: webSource !== "Total",
        isPOP: comparedDuration !== "",
    };
    const initPOPItems = meta.isSingleMode ? initPOPItemsSingleMode : initPOPItemsCompareMode;
    const initItems = (meta.isPOP ? initPOPItems : tabs) as Array<{
        name: string;
        title: string;
        iconName: string;
        beta?: boolean;
        isAvailable?: ({}) => void;
        isSelected?: boolean;
    }>;
    const hasGaToken = chosenSitesService.getPrimarySite().hasGaToken;
    const gaPrivacyStatus = chosenSitesService.getPrimarySite().privacyStatus;
    const isGa = showGAApprovedData && hasGaToken;
    const availableTabs = React.useMemo(
        () =>
            initItems.filter(({ isAvailable }) =>
                isAvailable
                    ? isAvailable({
                          isOneWebSource: meta.isOneWebSource,
                          duration,
                          isGa,
                          showGAApprovedData,
                          showBetaBranchData,
                      })
                    : true,
            ),
        [initItems, meta.isOneWebSource, duration, isGa, showGAApprovedData, showBetaBranchData],
    );
    const selectedTab = React.useMemo(
        () =>
            availableTabs.filter(
                ({ isSelected, name }) => (isSelected = name === selectedWidgetTab),
            )[0],
        [availableTabs, selectedWidgetTab],
    );
    if (!selectedTab) {
        const swNavigator = Injector.get<any>("swNavigator");
        // the 0 timeout in order to execute the navigation at the end of the call stack
        setTimeout(
            () => swNavigator.applyUpdateParams({ selectedWidgetTab: availableTabs[0].name }),
            0,
        );
    }
    const i18n = i18nFilter();
    const hasDedupeClaim = !swSettings.components.WebDedup.IsDisabled;
    const dedupTab = tabs.find((tab) => tab.name === "DeduplicatedAudience");
    dedupTab.isLocked = !hasDedupeClaim;
    dedupTab.labelText = hasDedupeClaim ? "BETA" : "NEW";
    const graphProps = React.useMemo(
        () => ({
            meta,
            getSiteColor: chosenSitesService.getSiteColor,
            showGAApprovedData,
            showBetaBranchData,
            params,
            chosenSites,
            hasGaToken,
            name: i18n(selectedTab?.title),
            gaPrivacyStatus,
        }),
        [
            meta,
            chosenSitesService.getSiteColor,
            showGAApprovedData,
            showBetaBranchData,
            params,
            chosenSites,
            hasGaToken,
            selectedTab?.title,
            gaPrivacyStatus,
        ],
    );

    return (
        <TrafficAndEngagementContainer>
            {selectedTab && (
                <TrafficAndEngagementTabs
                    selectedTab={selectedTab}
                    availableTabs={availableTabs}
                    params={params}
                    showGAApprovedData={showGAApprovedData}
                    showBetaBranchData={showBetaBranchData}
                    graphProps={graphProps}
                    hasDedupeClaim={hasDedupeClaim}
                />
            )}
        </TrafficAndEngagementContainer>
    );
};

const mapStateToProps = (props) => {
    const {
        routing: { params },
        common: {
            showGAApprovedData,
            showBetaBranchData: { value: showBetaBranchData },
        },
    } = props;
    return {
        params,
        showGAApprovedData,
        showBetaBranchData,
    };
};

const TrafficAndEngagementHighLevelData = connect(mapStateToProps)(
    React.memo(TrafficAndEngagementHighLevelDataInner),
);

SWReactRootComponent(TrafficAndEngagementHighLevelData, "TrafficAndEngagementHighLevelData");
