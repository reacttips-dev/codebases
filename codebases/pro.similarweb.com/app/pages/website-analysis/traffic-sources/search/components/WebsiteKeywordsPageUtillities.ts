import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { AddToDashboardWrapper } from "components/React/AddToDashboard/AddToDashboardButton";
import { IWidgetTableResult } from "components/widget/widget-types/TableWidget";
import { booleanSearchActionsTypesEnumToString } from "pages/website-analysis/traffic-sources/search/booleanSearchUtility";
import { BooleanSearchWrapper } from "pages/website-analysis/traffic-sources/search/BooleanSearchUtilityWrapper";
import {
    EBrandedNonBrandedValues,
    EOrganicPaidFilterValues,
    IWebsiteKeywordsPageFilters,
} from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageTypes";
import { IDurationData } from "services/DurationService";
import { allTrackers } from "services/track/track";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import UIComponentStateService from "services/UIComponentStateService";
import { IColumnsPickerLiteProps } from "@similarweb/ui-components/dist/columns-picker";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { IChosenItem } from "../../../../../../app/@types/chosenItems";
import { IWebsiteKeywordsPageTableTopContext } from "./WebsiteKeywordsPageContext";
import { FILTER_DEFAULT_SEPARATOR } from "pages/website-analysis/constants/constants";
import { BooleanSearchActionListStyled } from "@similarweb/ui-components/dist/boolean-search/src/BooleanSearchStyled";
import _ from "lodash";

export const mapStateToProps = (state) => {
    const { routing } = state;
    const { currentPage, params, chosenItems } = routing;
    return {
        currentPage,
        params,
        chosenItems,
    };
};

type ParamValueType = string | number | any[];

const elementsAreDifferent = (prevList: any[], nextList: any[]) => {
    const orderedPrevVal = [...prevList].sort();
    const orderedNextVal = [...nextList].sort();

    return !_.isEqual(orderedPrevVal, orderedNextVal);
};

const hasValue = (val: ParamValueType) => {
    return !(
        (typeof val === "string" && val.trim() === "") ||
        (Array.isArray(val) && val.length === 0) ||
        _.isNil(val)
    );
};

const isNextParamsDifferent = (prevParams, nextParams) => {
    return Object.entries(nextParams).some(([paramName, paramValue]) => {
        if (!prevParams.hasOwnProperty(paramName) && hasValue(nextParams[paramName])) {
            return true;
        } else if (prevParams[paramName] !== nextParams[paramName]) {
            if (Array.isArray(nextParams[paramName]) && Array.isArray(prevParams[paramName])) {
                return elementsAreDifferent(prevParams[paramName], nextParams[paramName]);
            } else {
                // filters assign different falsy/empty (ex. null, [], "" ...) values to params,
                // therefore, check for all possible "undefined" values when comparing
                return hasValue(prevParams[paramName]) || hasValue(nextParams[paramName]);
            }
        }
    });
};

const openCompareModal = () => {
    const LOCALE_STORAGE_KEY = "search-keywords-sigle";
    allTrackers.trackEvent("drop down", "open", `Keyword analysis advanced filter`);
    const $modal = Injector.get<any>("$modal");
    const $scope = Injector.get<any>("$rootScope").$new();
    $scope.customSubmit = (config) => {
        UIComponentStateService.setItem(LOCALE_STORAGE_KEY, "localStorage", "true", false);
        Injector.get<any>("swNavigator").updateParams(config);
    };
    $modal.open({
        templateUrl: "/partials/websites/modal-compare.html",
        controller: "ModalCompareInstanceCtrl",
        controllerAs: "ctrl",
        scope: $scope,
    });
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
        onColumnToggle: (key) => onClickToggleColumns(parseInt(key)),
        onPickerToggle: () => null,
        maxHeight: 264,
        width: "auto",
    };
};

export const onChipAdd = (newChip) => {
    const chipKind = booleanSearchActionsTypesEnumToString(newChip.action);
    TrackWithGuidService.trackWithGuid("keyword.boolean.search.chip", "click", {
        mode: chipKind,
        name: newChip.text,
        action: "add",
    });
};

export const onChipRemove = (removeChip) => {
    const chipKind = booleanSearchActionsTypesEnumToString(removeChip.action);
    TrackWithGuidService.trackWithGuid("keyword.boolean.search.chip", "click", {
        mode: chipKind,
        name: removeChip.text,
        action: "remove",
    });
};

export const getWebsiteKeywordsPageTableTopContext: (
    args: Record<string, any>,
) => IWebsiteKeywordsPageTableTopContext = (args) => {
    const {
        isLoadingData,
        nextTableParams,
        initialFiltersStateObject,
        applyChangesToUrl,
        isCompare,
        chosenItems,
        sourcesFilter,
        channelsFilter,
        tableData,
        addTempParams,
        isLast28Days,
        serpDataLoading,
    } = args;
    const swNavigator: SwNavigator = Injector.get("swNavigator");
    return {
        resetEnabled: !isLoadingData,
        onReset: () => {
            swNavigator.applyUpdateParams(
                Object.fromEntries(
                    Object.entries(nextTableParams)
                        .filter(([key, value]) => {
                            return !["country", "duration", "webSource", "key"].includes(key);
                        })
                        .map(([key, value]) => [key, null]),
                ),
            );
            TrackWithGuidService.trackWithGuid("website.keywords.table.filters.reset", "click");
        },
        applyEnabled:
            !isLoadingData &&
            isNextParamsDifferent(initialFiltersStateObject.current, nextTableParams),
        onApply: () => {
            applyChangesToUrl();
        },
        isCompare,
        chosenItems: chosenItems,
        tableFilters: nextTableParams,
        searchEngines: sourcesFilter,
        searchTypes: channelsFilter,
        tableData: tableData,
        onAdvancedFilterToggle: openCompareModal,
        onAdvancedFilterDone: (item) => {
            if (Array.isArray(item)) {
                addTempParams({
                    limits: item
                        .map((v) =>
                            v
                                ? `${v
                                      .map((i) => `${i / 100}-`)
                                      .join("")
                                      .slice(0, -1)};`
                                : `;`,
                        )
                        .join(""),
                });
            } else {
                const urlParams: any = {
                    limits: item && item.id,
                };
                if (item && item.id === "opportunities") {
                    urlParams.IncludeNoneBranded = true;
                    urlParams.IncludeBranded = false;
                }
                addTempParams(urlParams);
            }
        },
        onAdvancedFilterClose: () => {
            addTempParams({
                limits: null,
            });
        },
        onOrganicPaidChange: (item) => {
            addTempParams({
                IncludeOrganic: item?.id === EOrganicPaidFilterValues.IncludeOrganic || false,
                IncludePaid: item?.id === EOrganicPaidFilterValues.IncludePaid || false,
            });
            item &&
                TrackWithGuidService.trackWithGuid(
                    "website.keywords.table.filters.organicpaid",
                    "click",
                    { value: EOrganicPaidFilterValues[item.id] },
                );
        },
        onBrandedNonBrandedChange: (item) => {
            addTempParams({
                IncludeBranded: item?.id === EBrandedNonBrandedValues.IncludeBranded || false,
                IncludeNoneBranded:
                    item?.id === EBrandedNonBrandedValues.IncludeNoneBranded || false,
            });
            item &&
                TrackWithGuidService.trackWithGuid(
                    "website.keywords.table.filters.branded",
                    "click",
                    { value: EBrandedNonBrandedValues[item.id] },
                );
        },
        onSearchChannelChange: (items) => {
            if (items?.length === 0) {
                addTempParams({
                    family: null,
                });
            } else {
                const family = items.reduce(
                    (acc, item) =>
                        acc ? `${acc}${FILTER_DEFAULT_SEPARATOR}"${item.id}"` : `"${item.id}"`,
                    "",
                );

                addTempParams({ family });
                TrackWithGuidService.trackWithGuid(
                    "website.keywords.table.filters.searchEngine",
                    "click",
                    { value: family },
                );
            }
        },
        onSearchTypeChange: (items) => {
            if (items?.length === 0) {
                addTempParams({
                    source: null,
                });
            } else {
                const source = items.reduce(
                    (acc, item) =>
                        acc ? `${acc}${FILTER_DEFAULT_SEPARATOR}${item.id}` : `${item.id}`,
                    "",
                );

                addTempParams({ source });
                TrackWithGuidService.trackWithGuid(
                    "website.keywords.table.filters.searchType",
                    "click",
                    { value: source },
                );
            }
        },
        onChangeNewlyDiscovered: (value) => {
            addTempParams({
                IncludeNewKeywords: value,
            });
            value &&
                TrackWithGuidService.trackWithGuid(
                    "website.keywords.table.filters.newlyDiscovered",
                    "switch",
                    { value: value },
                );
        },
        onChangeTrending: (value) => {
            addTempParams({
                IncludeTrendingKeywords: value,
            });
            value &&
                TrackWithGuidService.trackWithGuid(
                    "website.keywords.table.filters.trending",
                    "switch",
                    { value: value },
                );
        },
        onChangeQuestions: (value) => {
            addTempParams({
                IncludeQuestions: value,
            });
            value &&
                TrackWithGuidService.trackWithGuid(
                    "website.keywords.table.filters.questions",
                    "switch",
                    { value: value },
                );
        },
        onVolumeChange: (value) => {
            const { fromValue, toValue } = value;
            addTempParams({
                volumeFromValue: fromValue,
                volumeToValue: toValue,
            });
            if (fromValue || toValue) {
                TrackWithGuidService.trackWithGuid(
                    "website.keywords.table.filters.volume",
                    "switch",
                    { fromValue: fromValue, toValue: toValue },
                );
            }
        },
        onCpcChange: (value) => {
            const { fromValue, toValue } = value;
            addTempParams({
                cpcFromValue: fromValue,
                cpcToValue: toValue,
            });
            if (fromValue || toValue) {
                TrackWithGuidService.trackWithGuid("website.keywords.table.filters.cpc", "switch", {
                    fromValue: fromValue,
                    toValue: toValue,
                });
            }
        },
        onPhraseChange: (value) => {
            addTempParams({
                selectedPhrase: value,
            });
            value &&
                TrackWithGuidService.trackWithGuid(
                    "website.keywords.table.filters.phrase",
                    "click",
                    { value: value },
                );
        },
        isLast28Days: isLast28Days,
        onSerpFilterApply: (features) => {
            addTempParams({
                serp: features,
            });
        },
        serpDataLoading: serpDataLoading,
    };
};

export interface IWebsiteKeywordsPageTableTop {
    filtersStateObject: IWebsiteKeywordsPageFilters & {
        webSource: string;
        keys: string;
        includeSubDomains: boolean;
    };
    onClickToggleColumns: (column) => void;
    onAddToDashboard: (filtets) => void;
    isLoadingData: boolean;
    headerData: {
        organic: number;
        paid: number;
        percentage: number;
        total: number;
    };
    breakdown: {
        [domain: string]: {
            percentage: number;
            value: number;
        };
    };
    channelsFilter: Array<{ count: number; id: string; text: string }>;
    sourcesFilter: Array<{ count: number; id: string; text: string }>;
    durationObject: IDurationData;
    excelLink: string;
    onColumnToggle?: (column) => void;
    tableColumns: any[];
    chosenItems: IChosenItem;
    isLast28Days: boolean;
    noData?: boolean;
    tableData: IWidgetTableResult;
    serpFilterItems: Array<{ count: number; id: string; text: string }>;
    disableSerpFilter: boolean;
    serpDataLoading: boolean;
}

export const SearchContainer = styled(FlexRow)`
    padding: 10px 15px;
    justify-content: space-between;
    ${BooleanSearchWrapper} {
        flex-grow: 1;
        .boolean-search {
            width: 95%;
            ${BooleanSearchActionListStyled} {
                top: 36px;
            }
        }
    }
    ${AddToDashboardWrapper} {
        display: flex;
        align-items: center;
        @media (max-width: 1365px) {
            margin-top: 6px;
        }
    }
`;

export const buildFilters = (filters) => {
    return Object.entries(filters)
        .reduce((result, [filterName, filterValue]) => {
            if (filterValue === null) {
                return result;
            }
            return `${filterName};==;${filterValue},${result}`;
        }, "")
        .slice(0, -1);
};
