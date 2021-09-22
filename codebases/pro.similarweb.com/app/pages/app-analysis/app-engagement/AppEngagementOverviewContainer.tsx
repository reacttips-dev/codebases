import React from "react";
import { useDispatch } from "react-redux";
import { colorsPalettes } from "@similarweb/styles";
import { Injector } from "common/ioc/Injector";
import { addPinkBadge, hidePinkBadge } from "actions/routingActions";
import {
    abbrNumberVisitsFilter,
    i18nFilter,
    percentageSignFilter,
    smallNumbersPercentageFilter,
} from "filters/ngFilters";
import { swSettings } from "common/services/swSettings";
import { SwNavigator } from "common/services/swNavigator";
import { PageContentsContainer, AppEngagementOverviewTableWrapper } from "./styledComponents";
import AppEngagementServiceApi from "pages/app-analysis/app-engagement/AppEngagementServiceApi";
import { AppEngagementOverviewGraph } from "pages/app-analysis/app-engagement/AppEngagementOverviewGraph";
import { chosenItems } from "common/services/chosenItems";
import { AppEngagementOverviewTable } from "./AppEngagementOverviewTable";

const algoChangeDate = swSettings.getDataIndicators("APPS_ALGO_CHANGE");

const visitsFormatter = (num) => {
    const result = abbrNumberVisitsFilter()(num);
    return result && result !== "0" ? result : "N/A";
};

const percentageSignFilterFormatter = (val) => {
    const result = percentageSignFilter()(val, 2);
    return result !== "0.00%" ? result : "<0.01%";
};

export const AppEngagementVerticals = {
    meta: {
        CurrentInstalls: {
            title: "apps.engagementoverview.tabs.currentinstalls.title",
            dataKey: "Current Installs",
            name: "CurrentInstalls",
            infoIcon: "apps.engagementoverview.tabs.currentinstalls.tooltip",
            filter: (val) => percentageSignFilterFormatter(val),
            yAxisFilter: smallNumbersPercentageFilter(),
            isPercentage: true,
            algoChangeDate,
            metric: "AppEngagementCurrentInstalls",
            dashboardWidgetType: "AppEngagementMetricsDashboardGraph",
            chartTitle: "apps.engagementoverview.tabs.currentinstalls.title",
        },
        Downloads: {
            title: "apps.engagementoverview.tabs.downloads.title",
            dataKey: "Downloads",
            name: "Downloads",
            infoIcon: "apps.engagementoverview.tabs.downloads.tooltip",
            filter: visitsFormatter,
            yAxisFilter: abbrNumberVisitsFilter(),
            algoChangeDate,
            metric: "AppEngagementDownloads",
            dashboardWidgetType: "AppEngagementMetricsDashboardGraph",
            chartTitle: "apps.engagementoverview.tabs.downloads.title",
        },
        UniqueInstalls: {
            title: "apps.engagementoverview.tabs.unique.installs.title",
            dataKey: "Unique Installs",
            name: "UniqueInstalls",
            infoIcon: "apps.engagementoverview.tabs.unique.installs.tooltip",
            labelText: "beta",
            filter: visitsFormatter,
            yAxisFilter: abbrNumberVisitsFilter(),
            labelColor: colorsPalettes.mint[400],
            metric: "AppEngagementUniqueInstalls",
            dashboardWidgetType: "AppEngagementMetricsDashboardGraph",
            chartTitle: "apps.engagementoverview.tabs.unique.installs.title",
        },
        DailyActiveUsers: {
            title: "apps.engagementoverview.tabs.dau.title",
            dataKey: "Daily Active Users",
            name: "DailyActiveUsers",
            infoIcon: "apps.engagementoverview.tabs.dau.tooltip.ud",
            filter: visitsFormatter,
            yAxisFilter: abbrNumberVisitsFilter(),
            algoChangeDate,
            metric: "AppEngagementDailyActiveUsers",
            dashboardWidgetType: "AppEngagementMetricsDashboardGraph",
            chartTitle: "apps.engagementoverview.tabs.dau.title",
        },
        MonthlyActiveUsers: {
            title: "apps.engagementoverview.tabs.mau.title",
            dataKey: "Monthly Active Users",
            name: "MonthlyActiveUsers",
            infoIcon: "apps.engagementoverview.tabs.mau.tooltip.ud",
            labelText: "beta",
            filter: visitsFormatter,
            yAxisFilter: abbrNumberVisitsFilter(),
            labelColor: colorsPalettes.mint[400],
            algoChangeDate,
            metric: "AppEngagementMonthlyActiveUsers",
            dashboardWidgetType: "AppEngagementMetricsDashboardGraph",
            chartTitle: "apps.engagementoverview.tabs.mau.chart.title",
        },
    },
    Google: [
        "CurrentInstalls",
        "Downloads",
        "UniqueInstalls",
        "DailyActiveUsers",
        "MonthlyActiveUsers",
    ],
    Apple: ["Downloads", "MonthlyActiveUsers"],
};

export const AppEngagementOverviewContainer = () => {
    const services = React.useMemo(
        () => ({
            apiService: AppEngagementServiceApi.getInstance(),
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
            i18n: i18nFilter(),
        }),
        [],
    );

    const dispatch = useDispatch();
    const appStore = chosenItems[0].AppStore === "Google" ? "Google" : "Apple";

    React.useLayoutEffect(() => {
        if (appStore === "Apple") {
            dispatch(addPinkBadge(services.i18n(services.swNavigator.current().pinkBadgeTitle)));
        } else {
            dispatch(hidePinkBadge());
        }
    }, [appStore]);

    return (
        <PageContentsContainer>
            {appStore !== "Apple" && (
                <AppEngagementOverviewTableWrapper>
                    <AppEngagementOverviewTable />
                </AppEngagementOverviewTableWrapper>
            )}
            <AppEngagementOverviewGraph appStore={appStore} />
        </PageContentsContainer>
    );
};
