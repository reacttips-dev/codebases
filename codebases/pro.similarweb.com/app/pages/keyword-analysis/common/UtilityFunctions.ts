import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { SWSettings } from "common/services/swSettings";
import { EGraphGranularities } from "pages/keyword-analysis/OrganicPage/Graph/GraphData";
import DurationService, { BasicDurations } from "services/DurationService";
import { allTrackers } from "services/track/track";
import { IColumnsPickerLiteProps } from "@similarweb/ui-components/dist/columns-picker";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";
export const isMonthsToDateSupported = ({ duration, visitsBelowThreshold }) =>
    [BasicDurations.LAST_THREE_MONTHS, BasicDurations.LAST_MONTH].includes(duration) &&
    !visitsBelowThreshold;

export const getInitialGranularity = ({
    duration,
    isMonthsToDateActive,
    isWeeklyKeywordsAvailable,
}) => {
    if (!isWeeklyKeywordsAvailable) {
        return EGraphGranularities.MONTHLY;
    }

    if (DurationService.isLessThanOrEqualToOneMonths(duration)) {
        return EGraphGranularities.WEEKLY;
    }
    if (isMonthsToDateActive) {
        return EGraphGranularities.WEEKLY;
    }
    return EGraphGranularities.MONTHLY;
};

export const isGranularityAvailable = (granularityType) => (swSettings: SWSettings) =>
    swSettings.components[granularityType].isAllowed;

export const isWeeklyKeywordsAvailable = isGranularityAvailable("WeeklyKeywords");

export const isMonthlyGranularityDisable = (duration) =>
    DurationService.isLessThanOrEqualToOneMonths(duration);

export const changeMonthToDateUrlState = (newValue) =>
    Injector.get<any>("swNavigator").applyUpdateParams({ mtd: newValue });

export const mtdToggleClickedCallback = (monthToDataValue) =>
    changeMonthToDateUrlState(monthToDataValue);

export const onTimeGranularityToggleCallback = (isMonthlyGranularity) => {
    if (isMonthlyGranularity) {
        changeMonthToDateUrlState(false);
    }
};

export const addToDashboard = ({
    webSource,
    type,
    metric,
    filters,
    onOpen = () => null,
    modelType = undefined,
    overrideAddToDashboardParams = {},
}: {
    type: string;
    metric: string;
    webSource?: string;
    filters?: Record<string, any> & { filter?: string };
    onOpen?: (modalRef) => void;
    modelType?: "fromKeyword" | "fromWebsite" | "fromMobile" | undefined;
    overrideAddToDashboardParams?: Record<string, any>;
}) => {
    const $widgetModelAdapterService = Injector.get<any>("widgetModelAdapterService");
    const $modal = Injector.get<any>("$modal");
    const $rootScope = Injector.get<any>("$rootScope");

    const getCustomModel = () => {
        const model = modelType
            ? $widgetModelAdapterService[modelType](metric, type, webSource, undefined, filters)
            : {
                  metric,
                  type,
                  webSource,
                  filter: filters,
              };
        return {
            ...model,
            ...overrideAddToDashboardParams,
        };
    };

    const addToDashboardModal = $modal.open({
        animation: true,
        controller: "widgetAddToDashboardController as ctrl",
        templateUrl: "/app/components/widget/widget-add-to-dashboard-modal.html",
        windowClass: "add-to-dashboard-modal",
        resolve: {
            widget: () => null,
            customModel: getCustomModel,
        },
        scope: $rootScope.$new(true),
    });
    onOpen(addToDashboardModal);
    return addToDashboardModal;
};

export const closeDashboardsModal = (addToDashBoardModal) => {
    return () => {
        // close an opened modal when the component is unmounted
        if (addToDashBoardModal.current && addToDashBoardModal.current.close) {
            addToDashBoardModal.current.close();
        }
    };
};

export const onOpenAddToDashboardModal = (addToDashBoardModal) => async (modal) => {
    addToDashBoardModal.current = modal;
    // clear the ref when the modal is closed
    if (addToDashBoardModal.current.result) {
        addToDashBoardModal.current.result.finally(() => {
            addToDashBoardModal.current = null;
        });
    }
};

export const onCalculateVisitsTrend = (
    setVisitsBelowThresholdCallback,
    avgVisitThreshold = 5000,
) => ({ calculatedAvgVisits }) => {
    if (calculatedAvgVisits < avgVisitThreshold) {
        setVisitsBelowThresholdCallback(true);
        changeMonthToDateUrlState(false);
    }
};

export const getCommonProps = (params) => {
    const { country, keyword, isWWW, duration } = params;
    const { from, to, isWindow } = DurationService.getDurationData(duration).forAPI;
    const isKeywordsGroup = keyword?.substring(0, 1) === "*";
    const keys = isKeywordsGroup ? keyword.substring(1) : keyword;
    const { GroupHash } = keywordsGroupsService.findGroupById(keyword.substring(1));
    const queryParams = {
        country,
        from,
        includeSubDomains: isWWW === "*",
        isWindow,
        keys,
        to,
        webSource: "Total",
        GroupHash,
    };
    return { queryParams, isKeywordsGroup, GroupHash };
};

export const onSelectedTabChange = (setSelectedTabIndex) => (index) => {
    const tab = index === 0 ? "domains" : "keywords";
    allTrackers.trackEvent("Tab", "click", `Table/${tab}`);
    setSelectedTabIndex(index);
    Injector.get<SwNavigator>("swNavigator").applyUpdateParams({ tab });
};

export const getColumnsPickerLiteProps = (
    tableColumns,
    onClickToggleColumns,
): IColumnsPickerLiteProps => {
    const columns = tableColumns.reduce((res, col, index) => {
        if (!col.fixed) {
            return [
                ...res,
                {
                    key: index.toString(),
                    displayName: col.displayName,
                    visible: col.visible,
                },
            ];
        }
        return res;
    }, []);
    return {
        columns,
        onColumnToggle: (key) => {
            // tslint:disable-next-line:radix
            onClickToggleColumns(parseInt(key));
        },
        onPickerToggle: () => null,
    };
};
