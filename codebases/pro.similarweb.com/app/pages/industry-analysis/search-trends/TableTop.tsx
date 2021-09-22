import { SearchContainer } from "pages/workspace/StyledComponent";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import React from "react";
import { ColumnsPickerLite } from "@similarweb/ui-components/dist/columns-picker";
import { getColumnsPickerLiteProps } from "pages/keyword-analysis/common/UtilityFunctions";
import { ExcelDownload } from "UtilitiesAndConstants/UtilitiesComponents/ExcelDownload";
import {
    FiltersContainer,
    Right,
    BooleanSearchContainer,
    OrangeStyledPill,
} from "./StyledComponents";
import { DefaultFetchService } from "services/fetchService";
import { BooleanSearchUtilityWrapper } from "pages/website-analysis/traffic-sources/search/BooleanSearchUtilityWrapper";
import { booleanSearchToObject } from "pages/website-analysis/traffic-sources/search/booleanSearchUtility";
import { AddToDashboard } from "pages/industry-analysis/search-trends/AddToDashboard";
import { BrandedNonBrandedFilter } from "pages/website-analysis/traffic-sources/search/components/filters/BrandedNonBrandedFilter";
import { EBrandedNonBrandedValues } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageTypes";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import {
    IncludeNewKeywordsFilterView,
    IncludeTrendingKeywordsFilterView,
} from "pages/website-analysis/traffic-sources/search/components/filters/CheckboxFilter";
import { BasicDurations } from "services/DurationService";

const EXCEL_ENDPOINT = "widgetApi/IndustryAnalysisTopKeywords/SearchKeywordsAbb/Excel";

export const TableTop = ({
    tableColumns,
    onClickToggleColumns,
    onFilterChange,
    params,
    excelEndpoint = EXCEL_ENDPOINT,
    filtersStateObject,
}) => {
    const {
        IncludeNewKeywords: includeNewKeywords,
        IncludeTrendingKeywords: includeTrendingKeywords,
    } = filtersStateObject;
    const { duration } = params;
    const is28d = duration === BasicDurations.LAST_TWENTY_EIGHT_DAYS;
    const onSearchChange = (search) =>
        onFilterChange(booleanSearchToObject(decodeURIComponent(search)));
    const fetcherService = DefaultFetchService.getInstance();
    const excelLink = `${excelEndpoint}?${fetcherService.requestParams(filtersStateObject)}`;
    const onBrandedNonBrandedChange = (item) => {
        const swNavigator = Injector.get<SwNavigator>("swNavigator");
        if (!item) {
            onFilterChange({
                IncludeBranded: null,
                IncludeNoneBranded: null,
            });
            swNavigator.applyUpdateParams({ includeBranded: true, includeNoneBranded: true });
            return;
        }
        const { id } = item;
        const brandedValues = {
            IncludeBranded: id === EBrandedNonBrandedValues.IncludeBranded,
            IncludeNoneBranded: id === EBrandedNonBrandedValues.IncludeNoneBranded,
        };
        onFilterChange(brandedValues);
        const {
            IncludeBranded: includeBranded,
            IncludeNoneBranded: includeNoneBranded,
        } = brandedValues;
        swNavigator.applyUpdateParams({ includeBranded, includeNoneBranded });
    };
    const onChangeNewlyDiscovered = (includeNewKeywords) => {
        const swNavigator = Injector.get<SwNavigator>("swNavigator");
        const newlyDiscoveredParams = { IncludeNewKeywords: includeNewKeywords };
        onFilterChange(newlyDiscoveredParams);
        swNavigator.applyUpdateParams(newlyDiscoveredParams);
    };
    const onChangeTrending = (includeTrendingKeywords) => {
        const swNavigator = Injector.get<SwNavigator>("swNavigator");
        const includeTrendingKeywordsParams = { IncludeTrendingKeywords: includeTrendingKeywords };
        onFilterChange(includeTrendingKeywordsParams);
        swNavigator.applyUpdateParams(includeTrendingKeywordsParams);
    };

    const displayNewKeywordsFilter = () => !is28d;
    const displayTrendingFilterNewPill = () => is28d;
    return (
        <div>
            <FiltersContainer>
                <BrandedNonBrandedFilter
                    tableFilters={filtersStateObject}
                    onBrandedNonBrandedChange={onBrandedNonBrandedChange}
                />
                {displayNewKeywordsFilter() && (
                    <IncludeNewKeywordsFilterView
                        includeNewKeywords={includeNewKeywords}
                        onChangeNewlyDiscovered={onChangeNewlyDiscovered}
                    />
                )}
                <IncludeTrendingKeywordsFilterView
                    includeTrendingKeywords={includeTrendingKeywords}
                    onChangeTrending={onChangeTrending}
                />
                {displayTrendingFilterNewPill() && <OrangeStyledPill>NEW</OrangeStyledPill>}
            </FiltersContainer>
            <SearchContainer>
                <BooleanSearchContainer>
                    <BooleanSearchUtilityWrapper onChange={onSearchChange} />
                </BooleanSearchContainer>
                <Right>
                    <FlexRow>
                        <ExcelDownload excelLink={excelLink} />
                        <div>
                            <ColumnsPickerLite
                                {...getColumnsPickerLiteProps(tableColumns, onClickToggleColumns)}
                                withTooltip={true}
                            />
                        </div>
                        <div>
                            <AddToDashboard
                                filtersStateObject={filtersStateObject}
                                params={params}
                            />
                        </div>
                    </FlexRow>
                </Right>
            </SearchContainer>
        </div>
    );
};
