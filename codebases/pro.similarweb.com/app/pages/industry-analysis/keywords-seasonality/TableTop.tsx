import {
    ColumnsPickerLite,
    IColumnsPickerLiteProps,
} from "@similarweb/ui-components/dist/columns-picker";
import { ChipDownContainer, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import { FooterButton } from "components/MultiCategoriesChipDown/src/MultiCategoryChipdownStyles";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { useDidMountEffect } from "custom-hooks/useDidMountEffect";
import { i18nFilter } from "filters/ngFilters";
import dayjs from "dayjs";
import {
    BooleanSearchUtilityWrapper,
    BooleanSearchWrapper,
} from "pages/website-analysis/traffic-sources/search/BooleanSearchUtilityWrapper";
import * as queryString from "querystring";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import DurationService from "services/DurationService";
import { allTrackers } from "services/track/track";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { AddToDashboardWrapper } from "components/React/AddToDashboard/AddToDashboardButton";
import I18n from "components/React/Filters/I18n";
import { CpcFilterForWebsiteKeywords } from "pages/website-analysis/traffic-sources/search/components/filters/CpcFilter";
import { WebsiteKeywordsPageTableTopContextProvider } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageContext";
import { getWebsiteKeywordsPageTableTopContext } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageUtillities";
import { SwNavigator } from "common/services/swNavigator";
import { VolumeFilterForWebsiteKeywords } from "pages/website-analysis/traffic-sources/search/components/filters/VolumeFilter";
import {
    createCpcFilter,
    createVolumeFilter,
    getRangeFilterQueryParamValue,
} from "components/filtersPanel/src/RangeFilterUtilityFunctions";

const i18n = i18nFilter();

const Right = styled.div`
    flex-grow: 0;
    display: flex;
    align-items: center;
    margin-left: 10px;
`;

const SearchContainer = styled.div`
    padding: 10px 15px;
    justify-content: space-between;
    display: flex;
    border-top: 1px solid #d4d8dc;
    ${BooleanSearchWrapper} {
        flex-grow: 1;
    }
    ${AddToDashboardWrapper} {
        display: flex;
        align-items: center;
    }
`;
SearchContainer.displayName = "SearchContainer";

const DownloadExcelContainer = styled.a`
    margin: 0 8px 0 16px;
`;

const ChipdownItem = styled.div`
    flex-grow: 0;
    margin-right: 8px;
`;

const FiltersContainers = styled(FlexRow)`
    padding: 10px 15px;
`;

export enum EBrandedValues {
    INCLUDE = 1,
    EXCLUDE,
    INCLUDE_BOTH,
}
export const brandedItems = [
    {
        text: i18n("industry_analysis.top_keywords.dropdown.text.all"),
        id: EBrandedValues.INCLUDE_BOTH,
    },
    {
        text: i18n("industry_analysis.top_keywords.dropdown.text.branded"),
        id: EBrandedValues.INCLUDE,
    },
    {
        text: i18n("industry_analysis.top_keywords.dropdown.text.non_branded"),
        id: EBrandedValues.EXCLUDE,
    },
];

const splitMonthsToRanges = (months) => {
    const ranges = [];
    let currentRange = [];
    let prevMonth = months[0];
    for (const month of months) {
        // out of range
        if (month - prevMonth > 1) {
            ranges.push([...currentRange]);
            currentRange = [month];
        } else {
            // in range
            currentRange.push(month);
        }
        prevMonth = month;
    }
    ranges.push([...currentRange]);
    return ranges;
};
const monthToStr = (month) => {
    return dayjs
        .utc()
        .month(month - 1)
        .format("MMM");
};
const text = (sortedMonths) => {
    if (sortedMonths.length === 0) {
        return null;
    }
    const ranges = splitMonthsToRanges(sortedMonths);
    const rangesStr = ranges
        .map((range) => {
            if (range.length > 1) {
                return `${monthToStr(range[0])}-${monthToStr(range[range.length - 1])}`;
            } else return monthToStr(range[0]);
        })
        .join(", ");
    return `Trending in: ${rangesStr}`;
};

export const TableTop: React.FC<any> = (props) => {
    // set the initial selected months
    const { TrendingMonthsFilter: trendingMonthsFilter } = props.filtersStateObject;
    const initialMonths = useRef<any>();
    initialMonths.current = (trendingMonthsFilter?.split(",") ?? [])
        .map(Number)
        .sort((a, b) => a - b);
    useEffect(() => {
        initialMonths.current = (props.filtersStateObject.TrendingMonthsFilter?.split(",") ?? [])
            .map(Number)
            .sort((a, b) => a - b);
    }, [props.filtersStateObject]);
    // add state for saving the months until the user submit his changes;
    const [localMonths, setLocalMonths] = useState(initialMonths.current);
    const chipdownRef = useRef<any>();
    useDidMountEffect(() => {
        const { from, to } = DurationService.getDurationData("12m").forAPI;
        props.onFilterChange({ ...props.params, duration: "12m", from, to });
    }, [props.params.orderBy, props.params.duration]);
    const getColumnsPickerLiteProps = (): IColumnsPickerLiteProps => {
        const columns = props.tableColumns.reduce((res, col, index) => {
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
                props.onClickToggleColumns(parseInt(key));
            },
            onPickerToggle: () => null,
        };
    };
    const trackExcelDownload = () => {
        allTrackers.trackEvent("Download", "submit-ok", "Table/Excel");
    };

    /**** Click on dropdown items ****/
    const onMonthItemClick = useCallback(
        ({ id }) => {
            const newLocalMonths = [...localMonths];
            const monthIndex = newLocalMonths.findIndex((month) => month === id);
            if (monthIndex > -1) {
                newLocalMonths.splice(monthIndex, 1);
            } else {
                newLocalMonths.push(id);
            }
            setLocalMonths(newLocalMonths.sort((a, b) => a - b));
        },
        [localMonths, props.filtersStateObject],
    );
    const onMonthApply = useCallback(() => {
        Injector.get<any>("swNavigator").applyUpdateParams({ months: localMonths.join(",") });
        props.onFilterChange({ TrendingMonthsFilter: localMonths.join(",") });
        chipdownRef?.current?.closePopup();
    }, [props.onFilterChange, localMonths, chipdownRef]);
    const onBrandedItemClick = useCallback(
        (type) => {
            const newParams = {
                includeNoneBranded: type.id === EBrandedValues.EXCLUDE,
                includeBranded: type.id === EBrandedValues.INCLUDE,
            };
            if (type.id === EBrandedValues.INCLUDE_BOTH) {
                newParams.includeBranded = true;
                newParams.includeNoneBranded = true;
            }
            Injector.get<any>("swNavigator").applyUpdateParams(newParams);
            props.onFilterChange(newParams);
        },
        [props.onFilterChange],
    );

    /**** clear dropdown values ****/
    const onCloseMonthItem = useCallback(() => {
        Injector.get<any>("swNavigator").applyUpdateParams({
            months: null,
        });
        props.onFilterChange({ TrendingMonthsFilter: null });
        setLocalMonths("");
    }, [props.onFilterChange]);
    const onCloseBrandedItem = useCallback(() => {
        const params = { includeBranded: true, includeNoneBranded: true };
        Injector.get<any>("swNavigator").applyUpdateParams(params);
        props.onFilterChange(params);
    }, [props.onFilterChange]);

    /**** create dropdown items ****/
    const monthsItems = Array(12)
        .fill(null)
        .map((val, i) => i + 1)
        .map((month) => {
            return (
                <EllipsisDropdownItem
                    key={month}
                    id={month}
                    showCheckBox={true}
                    selected={localMonths.includes(month)}
                >
                    {dayjs
                        .utc()
                        .month(month - 1)
                        .format("MMMM")}
                </EllipsisDropdownItem>
            );
        });
    const brandedItems1 = brandedItems.map((type) => {
        return (
            <EllipsisDropdownItem key={type.id} id={type.id}>
                {type.text}
            </EllipsisDropdownItem>
        );
    });

    const excelLink = useMemo(() => {
        const queryStringParams = queryString.stringify(props.filtersStateObject);
        return `/api/SeasonalKeywords/Excel?${queryStringParams}`;
    }, [props.filtersStateObject]);
    const excelAllowed = swSettings.current.resources.IsExcelAllowed;
    const selectedMonthsText = text(initialMonths.current);
    const selectedMonthsIds =
        localMonths.length > 0
            ? localMonths.reduce((res, month) => {
                  res[month] = true;
                  return res;
              }, {})
            : {};

    const getSelectedBrandedId = () => {
        let { includeNoneBranded, includeBranded } = props.filtersStateObject;
        includeBranded = includeBranded !== undefined ? JSON.parse(includeBranded) : true;
        includeNoneBranded =
            includeNoneBranded !== undefined ? JSON.parse(includeNoneBranded) : true;
        if ((includeNoneBranded && includeBranded) || (!includeNoneBranded && !includeBranded)) {
            return undefined;
        }
        if (includeNoneBranded && !includeBranded) {
            return EBrandedValues.EXCLUDE;
        }
        return EBrandedValues.INCLUDE;
    };
    const selectedBrandedId: EBrandedValues = getSelectedBrandedId();
    const onMonthFilterToggle = (isOpen, isOutsideClick) => {
        if (isOutsideClick) {
            setLocalMonths(initialMonths.current);
        }
    };
    const onBooleanSearchChange = (items) => {
        const split = items.split(",");
        const IncludeTerms = split
            .filter((item) => item[0] === "|")
            .map((item) => item.slice(1))
            .join(",");
        const ExcludeTerms = split
            .filter((item) => item[0] === "-")
            .map((item) => item.slice(1))
            .join(",");
        props.onFilterChange({ ExcludeTerms, IncludeTerms });
    };

    const { cpcFromValue, cpcToValue, volumeFromValue, volumeToValue } = props.params;
    const contextValue = useMemo(() => {
        return getWebsiteKeywordsPageTableTopContext({
            initialFiltersStateObject: { current: {} },
            nextTableParams: { cpcFromValue, cpcToValue, volumeFromValue, volumeToValue },
            tableData: {},
            addTempParams: (values) => {
                Injector.get<SwNavigator>("swNavigator").applyUpdateParams(values);

                // create updated version for params with new values
                const newParams = { ...props.params, ...values };
                const rangeFilter = getRangeFilterQueryParamValue([
                    createVolumeFilter(newParams.volumeFromValue, newParams.volumeToValue),
                    createCpcFilter(newParams.cpcFromValue, newParams.cpcToValue),
                ]);
                props.onFilterChange({ rangeFilter });
            },
        });
    }, [cpcFromValue, cpcToValue, volumeFromValue, volumeToValue, Injector]);

    return (
        <div>
            <WebsiteKeywordsPageTableTopContextProvider value={contextValue}>
                <FiltersContainers alignItems="center">
                    <ChipdownItem>
                        <ChipDownContainer
                            ref={chipdownRef}
                            onToggle={onMonthFilterToggle}
                            hasSearch={false}
                            selectedIds={selectedMonthsIds}
                            selectedText={selectedMonthsText}
                            buttonText={i18n("keywords.seasonality.month.filter")}
                            onClick={onMonthItemClick}
                            onCloseItem={onCloseMonthItem}
                            closeOnItemClick={false}
                            width={300}
                            footerComponent={() => (
                                <FooterButton onClick={onMonthApply}>
                                    <I18n>common.apply</I18n>
                                </FooterButton>
                            )}
                        >
                            {monthsItems}
                        </ChipDownContainer>
                    </ChipdownItem>
                    <ChipdownItem>
                        <ChipDownContainer
                            hasSearch={false}
                            selectedIds={selectedBrandedId && { [selectedBrandedId]: true }}
                            selectedText={
                                selectedBrandedId &&
                                brandedItems.find(({ id }) => id === selectedBrandedId).text
                            }
                            buttonText={brandedItems[0].text}
                            onClick={onBrandedItemClick}
                            onCloseItem={onCloseBrandedItem}
                            ref={chipdownRef.current}
                        >
                            {brandedItems1}
                        </ChipDownContainer>
                    </ChipdownItem>
                    <ChipdownItem>
                        <CpcFilterForWebsiteKeywords />
                    </ChipdownItem>
                    <ChipdownItem>
                        <VolumeFilterForWebsiteKeywords />
                    </ChipdownItem>
                </FiltersContainers>
            </WebsiteKeywordsPageTableTopContextProvider>
            <div>
                <SearchContainer>
                    <div>
                        <BooleanSearchUtilityWrapper
                            onChange={onBooleanSearchChange}
                            shouldEncodeSearchString={false}
                        />
                    </div>
                    <Right>
                        <FlexRow>
                            <DownloadExcelContainer href={excelLink}>
                                <DownloadButtonMenu
                                    Excel={true}
                                    downloadUrl={excelLink}
                                    exportFunction={trackExcelDownload}
                                    excelLocked={!excelAllowed}
                                />
                            </DownloadExcelContainer>
                            <div>
                                <ColumnsPickerLite
                                    {...getColumnsPickerLiteProps()}
                                    withTooltip={true}
                                />
                            </div>
                        </FlexRow>
                    </Right>
                </SearchContainer>
            </div>
        </div>
    );
};

TableTop.defaultProps = {
    families: [],
    sources: [],
    categories: [],
};
