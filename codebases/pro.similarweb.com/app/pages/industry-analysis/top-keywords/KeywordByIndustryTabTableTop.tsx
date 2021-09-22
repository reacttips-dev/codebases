import { useEffect, useMemo, useRef } from "react";
import { connect } from "react-redux";
import { BooleanSearchUtilityContainer } from "pages/keyword-analysis/keyword-generator-tool/styledComponents";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { i18nFilter } from "filters/ngFilters";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import {
    ColumnsPickerLite,
    IColumnsPickerLiteProps,
} from "@similarweb/ui-components/dist/columns-picker";
import categoryService from "common/services/categoryService";
import { swSettings } from "common/services/swSettings";
import { BooleanSearchUtilityWrapper } from "pages/website-analysis/traffic-sources/search/BooleanSearchUtilityWrapper";
import { CheckboxFilter } from "pages/website-analysis/traffic-sources/search/components/filters/CheckboxFilter";
import { brandedItems } from "pages/industry-analysis/keywords-seasonality/TableTop";
import { EBrandedValues } from "pages/industry-analysis/keywords-seasonality/TableTop";
import {
    TableTopSearchRowContainer,
    FiltersContainer,
    DownloadExcelContainer,
    LastItemsWrapper,
} from "./StyledComponents";
import { ChipDownContainer, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { WebsiteKeywordsPageTableTopContextProvider } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageContext";
import { ChipdownItem } from "pages/website-analysis/audience-interests/single/AudienceInterestsTableTop/AudienceInterestsTableTopStyles";
import { CpcFilterForWebsiteKeywords } from "pages/website-analysis/traffic-sources/search/components/filters/CpcFilter";
import { VolumeFilterForWebsiteKeywords } from "pages/website-analysis/traffic-sources/search/components/filters/VolumeFilter";
import { getWebsiteKeywordsPageTableTopContext } from "pages/website-analysis/traffic-sources/search/components/WebsiteKeywordsPageUtillities";
import {
    createCpcFilter,
    createVolumeFilter,
    getRangeFilterQueryParamValue,
} from "components/filtersPanel/src/RangeFilterUtilityFunctions";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import DurationService from "services/DurationService";

const toBoolean = (value: string) => value === "true";

const searchTermToIncludeExclude = (searchTerm: string) => {
    const split = searchTerm.split(",");

    return {
        IncludeTerms: split
            .filter((item) => item[0] === "|")
            .map((item) => item.slice(1))
            .join(","),
        ExcludeTerms: split
            .filter((item) => item[0] === "-")
            .map((item) => item.slice(1))
            .join(","),
    };
};

const getUpdatedFilter = (currentFilter = "", channel) => {
    let filter = currentFilter;
    // remove Source from filter
    filter = filter.replace(/,?Source;==;\d+/, "");

    if (channel) {
        const filters = [filter, `Source;==;${channel}`];
        filter = filters.join(",");
    }
    return filter;
};

interface IKeywordByIndustryTabTableTopProps {
    onFilterChange: (items: {}, shouldUpdateUrl?: boolean) => void;
    excelDownloadUrl: string;
    columns: any;
    onClickToggleColumns: (col: number) => void;
    totalRecords: number;
    allSourceTypes: any[];
    /** Received from redux via connect */
    params?: any;
}

export const KeywordByIndustryTabTableTop: React.FC<IKeywordByIndustryTabTableTopProps> = (
    props,
) => {
    const addToDashboardModal = useRef({ dismiss: () => null });
    const prevFilters = useRef();
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const $modal = Injector.get<any>("$modal");
    const $rootScope = Injector.get("$rootScope");
    const { columns, excelDownloadUrl, onClickToggleColumns, allSourceTypes = [], params } = props;
    const isDurationWIndow = DurationService.getDurationData(params.duration).forAPI.isWindow;

    const selectedBrandedId = useMemo(() => {
        if (params.includeNoneBranded === "true" && params.includeBranded !== "true") {
            return EBrandedValues.EXCLUDE;
        } else if (params.includeBranded === "true" && params.includeNoneBranded !== "true") {
            return EBrandedValues.INCLUDE;
        } else {
            return undefined;
        }
    }, [params.includeBranded, params.includeNoneBranded]);

    useEffect(() => {
        const { ExcludeTerms, IncludeTerms } = searchTermToIncludeExclude(
            params.BooleanSearchTerms,
        );

        const rangeFilter = getRangeFilterQueryParamValue([
            createVolumeFilter(params.volumeFromValue, params.volumeToValue),
            createCpcFilter(params.cpcFromValue, params.cpcToValue),
        ]);

        const update = (data) => {
            // update if this is not the first load
            if (prevFilters.current !== undefined) {
                props.onFilterChange(data);
            }
            prevFilters.current = data;
        };
        update({
            ExcludeTerms,
            IncludeTerms,
            IncludeTrendingKeywords: params.IncludeTrendingKeywords,
            IncludeNewKeywords: params.IncludeNewKeywords,
            IncludeQuestions: params.IncludeQuestions,
            includeBranded: params.includeBranded,
            includeNoneBranded: params.includeNoneBranded,
            channel: params.channel,
            rangeFilter,
            filter: getUpdatedFilter((props as any).filtersStateObject?.filter, params.channel),
        });
    }, [
        params.BooleanSearchTerms,
        params.IncludeTrendingKeywords,
        params.IncludeNewKeywords,
        params.IncludeQuestions,
        params.includeBranded,
        params.includeNoneBranded,
        params.channel,
        params.cpcFromValue,
        params.cpcToValue,
        params.volumeFromValue,
        params.volumeToValue,
    ]);

    useEffect(() => {
        return () => {
            addToDashboardModal.current.dismiss();
        };
    }, [addToDashboardModal]);

    const excelAllowed = swSettings.current.resources.IsExcelAllowed;
    const getColumnsPickerLiteProps = (tableColumns): IColumnsPickerLiteProps => {
        const onColumnToggle = (key) => {
            onClickToggleColumns(parseInt(key, 10));
        };

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
            onColumnToggle: onColumnToggle,
            onPickerToggle: () => null,
            maxHeight: 264,
            width: "auto",
        };
    };
    const onBooleanSearchChange = (items) => {
        updateFilterParams(searchTermToIncludeExclude(items));
    };

    const onCheckboxValueChange = (
        checkboxName: "IncludeTrendingKeywords" | "IncludeNewKeywords" | "IncludeQuestions",
    ) => {
        // toggles between "true" and "false"
        updateFilterParams({ [checkboxName]: (!toBoolean(params[checkboxName])).toString() });
    };

    const onSearchChannelChange = ({ id, selected }) => {
        updateFilterParams({ channel: !selected ? id : undefined });
    };
    const onSearchChannelClear = () => {
        onSearchChannelChange({ id: undefined, selected: false });
    };

    const onBrandedSelectionChange = ({ id }) => {
        const newParams = {
            includeNoneBranded: id === EBrandedValues.EXCLUDE,
            includeBranded: id === EBrandedValues.INCLUDE,
        };
        if (id === EBrandedValues.INCLUDE_BOTH) {
            newParams.includeBranded = true;
            newParams.includeNoneBranded = true;
        }
        updateFilterParams(newParams);
    };
    const onBrandedSelectionClear = () => {
        const newParams = { includeBranded: true, includeNoneBranded: true };
        updateFilterParams(newParams);
    };

    const updateFilterParams = (newParams: Record<string, any>) => {
        const oldParams = swNavigator.getParams();
        swNavigator.applyUpdateParams({ ...oldParams, ...newParams });
    };

    const a2d = () => {
        const categoryId = categoryService.categoryQueryParamToCategoryObject(params.category).id;
        const categoryData = UserCustomCategoryService.isCustomCategory(categoryId)
            ? UserCustomCategoryService.getCustomCategoryByName(categoryId?.slice(1))
            : categoryService.getCategory(categoryId);

        const key = UserCustomCategoryService.isCustomCategory(params.category)
            ? { id: categoryData.id, name: categoryData.name, category: categoryData.id }
            : {
                  id: `$${categoryData.id}`,
                  name: categoryData.text,
                  category: `$${categoryData.id}`,
              };

        const { ExcludeTerms, IncludeTerms } = searchTermToIncludeExclude(
            params.BooleanSearchTerms,
        );
        const rangeFilter = getRangeFilterQueryParamValue([
            createVolumeFilter(params.volumeFromValue, params.volumeToValue),
            createCpcFilter(params.cpcFromValue, params.cpcToValue),
        ]);

        addToDashboardModal.current = $modal.open({
            animation: true,
            controller: "widgetAddToDashboardController as ctrl",
            templateUrl: "/app/components/widget/widget-add-to-dashboard-modal.html",
            windowClass: "add-to-dashboard-modal",
            resolve: {
                widget: () => null,
                customModel: () => ({
                    country: params.country,
                    duration: params.duration,
                    family: "Industry",
                    type: "IndustryKeywordsDashboardTable",
                    metric: "SearchKeywordsAbbAll",
                    webSource: "Desktop",
                    key: [key],
                    customAsset: "Industry",
                    filters: {
                        timeGranularity: "Monthly",
                        IncludeNewKeywords: params.IncludeNewKeywords,
                        IncludeQuestions: params.IncludeQuestions,
                        IncludeTrendingKeywords: params.IncludeTrendingKeywords,
                        includeBranded: params.includeBranded,
                        includeNoneBranded: params.includeNoneBranded,
                        includeSubDomains: params.includeSubDomains,
                        rangeFilter,
                        ...(ExcludeTerms ? { ExcludeTerms } : {}),
                        ...(IncludeTerms ? { IncludeTerms } : {}),
                        filter: getUpdatedFilter(
                            (props as any).filtersStateObject?.filter,
                            params.channel,
                        ),
                    },
                }),
            },
            scope: $rootScope.$new(true),
        });
    };

    const contextValue = getWebsiteKeywordsPageTableTopContext({
        initialFiltersStateObject: { current: {} },
        nextTableParams: {
            cpcFromValue: params.cpcFromValue,
            cpcToValue: params.cpcToValue,
            volumeFromValue: params.volumeFromValue,
            volumeToValue: params.volumeToValue,
        },
        tableData: { TotalCount: props.totalRecords },
        addTempParams: (values) => {
            Injector.get<SwNavigator>("swNavigator").applyUpdateParams(values);
        },
    });

    return (
        <>
            <FiltersContainer>
                <WebsiteKeywordsPageTableTopContextProvider value={contextValue}>
                    <ChipdownItem>
                        <CpcFilterForWebsiteKeywords />
                    </ChipdownItem>
                    <ChipdownItem>
                        <VolumeFilterForWebsiteKeywords />
                    </ChipdownItem>
                </WebsiteKeywordsPageTableTopContextProvider>

                <div>
                    <ChipDownContainer
                        width={305}
                        onClick={onSearchChannelChange}
                        selectedText={
                            allSourceTypes.find((item) => item.id === params.channel)?.text
                        }
                        onCloseItem={onSearchChannelClear}
                        buttonText={i18nFilter()(
                            "industry_analysis.top_keywords.dropdown.search_channels.placeholder",
                        )}
                    >
                        {allSourceTypes.map(({ text, id, count }) => (
                            <EllipsisDropdownItem
                                key={`source-type-item-${id}`}
                                id={id}
                                selected={params.channel === id}
                                infoText={`(${count})`}
                            >
                                {i18nFilter()(text)}
                            </EllipsisDropdownItem>
                        ))}
                    </ChipDownContainer>
                </div>
                <div>
                    <ChipDownContainer
                        width={305}
                        onClick={onBrandedSelectionChange}
                        selectedText={brandedItems.find(({ id }) => id === selectedBrandedId)?.text}
                        onCloseItem={onBrandedSelectionClear}
                        buttonText={i18nFilter()(
                            "industry_analysis.top_keywords.dropdown.branded.placeholder",
                        )}
                    >
                        {brandedItems.map(({ text, id }) => (
                            <EllipsisDropdownItem
                                key={`branded-item-${id}`}
                                id={id}
                                selected={selectedBrandedId === id}
                            >
                                {i18nFilter()(text)}
                            </EllipsisDropdownItem>
                        ))}
                    </ChipDownContainer>
                </div>
                {!isDurationWIndow && (
                    <CheckboxFilter
                        isSelected={toBoolean(params.IncludeNewKeywords)}
                        onChange={() => onCheckboxValueChange("IncludeNewKeywords")}
                        text={i18nFilter()(
                            "industry_analysis.top_keywords.checkbox.new.placeholder",
                        )}
                        tooltip={i18nFilter()(
                            "industry_analysis.top_keywords.checkbox.new.tooltip",
                        )}
                    />
                )}
                <LastItemsWrapper>
                    <CheckboxFilter
                        isSelected={toBoolean(params.IncludeTrendingKeywords)}
                        onChange={() => onCheckboxValueChange("IncludeTrendingKeywords")}
                        text={i18nFilter()(
                            "industry_analysis.top_keywords.checkbox.trending.placeholder",
                        )}
                        tooltip={i18nFilter()(
                            "industry_analysis.top_keywords.checkbox.trending.tooltip",
                        )}
                    />
                    {!isDurationWIndow && (
                        <CheckboxFilter
                            isSelected={toBoolean(params.IncludeQuestions)}
                            onChange={() => onCheckboxValueChange("IncludeQuestions")}
                            text={i18nFilter()(
                                "industry_analysis.top_keywords.checkbox.questions.placeholder",
                            )}
                            tooltip={i18nFilter()(
                                "industry_analysis.top_keywords.checkbox.questions.tooltip",
                            )}
                        />
                    )}
                </LastItemsWrapper>
            </FiltersContainer>
            <TableTopSearchRowContainer>
                <BooleanSearchUtilityContainer>
                    <BooleanSearchUtilityWrapper
                        onChange={onBooleanSearchChange}
                        shouldEncodeSearchString={false}
                    />
                </BooleanSearchUtilityContainer>
                <FlexRow>
                    <DownloadExcelContainer href={excelDownloadUrl}>
                        <DownloadButtonMenu
                            Excel
                            downloadUrl={excelDownloadUrl}
                            excelLocked={!excelAllowed}
                        />
                    </DownloadExcelContainer>
                    <ColumnsPickerLite {...getColumnsPickerLiteProps(columns)} withTooltip />
                    <AddToDashboardButton onClick={a2d} />
                </FlexRow>
            </TableTopSearchRowContainer>
        </>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const mapStateToProps = (state) => {
    const {
        routing: { params },
    } = state;
    return {
        params: {
            ...params,
            BooleanSearchTerms: params.BooleanSearchTerms || "",
        },
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(KeywordByIndustryTabTableTop);
