import * as React from "react";
import { FunctionComponent, useCallback, useEffect, useState } from "react";
import capitalize from "lodash/capitalize";
import utils from "Shared/utils";
import { getWebsiteTypeOptions } from "pages/keyword-analysis/Organic";
import { SearchContainer } from "pages/workspace/StyledComponent";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";
import { CategoryItem } from "components/React/CategoriesDropdown/CategoryDropdown";
import { categoryClassIconFilter, i18nCategoryFilter, i18nFilter } from "filters/ngFilters";
import { ChipDownContainer, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { Button, IconButton } from "@similarweb/ui-components/dist/button";
import { ColumnsPickerModal } from "components/React/ColumnsPickerModal/ColumnsPickerModal";
import { UPDATE_HIGHLIGHT_CLICKED_ROW_EVENT } from "components/React/Table/FlexTable/Big/FlexTable";
import { Injector } from "common/ioc/Injector";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import ExcelClientDownload from "components/React/ExcelButton/ExcelClientDownload";
import { FindAffiliateByKeywordsTableSettings } from "pages/digital-marketing/find-affiliate/by-keywords/FindAffiliateByKeywordsTableSettings";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { apiHelper } from "common/services/apiHelper";

interface IFindAffiliateByKeywordsTableTopProps {
    allCategories: Array<{
        Count: number;
        Name: string;
        Value: number;
    }>;
    onFilterChange: any;
    selectedCategory?: string;
    selectedCategoryId?: string;
    selectedWebsiteType?: string;
    searchTerm?: string;
    excelLink: string;
    tableColumns: any[];
    onClickToggleColumns: (index) => void;
    filtersStateObject?: {
        filter: string;
        webSource: string;
    };
    downloadExcelPermitted?: boolean;
    excelRequestBody: string[];
    isLoadingData: boolean;
    hideTopBar: boolean;
    useSelection: boolean;
    hideUtils: boolean;
}

const Right = styled.div`
    flex-grow: 0;
    display: flex;
    align-items: center;
    margin-left: 10px;
`;

const CategoryItemContainer = styled(CategoryItem)`
    font-weight: 400;
`;

const ChipdownItem = styled.div`
    flex-grow: 0;
    margin-right: 8px;
`;

const FiltersContainers = styled(FlexRow)`
    height: 70px;
    margin: auto;
    margin-left: 15px;
`;

const TopLine = styled.div`
    display: flex;
    align-items: center;
    ${SearchContainer} {
        flex-grow: 1;
    }
`;

const getTableToggleGroups = () => [
    {
        key: "keyword",
        displayName:
            "affiliate.by.opportunities.table.columns.picker.categories.keyword.related.metrics",
    },
    {
        key: "website",
        displayName:
            "affiliate.by.opportunities.table.columns.picker.categories.website.related.metrics",
    },
];

export const FindAffiliateByKeywordsTableTop: FunctionComponent<IFindAffiliateByKeywordsTableTopProps> = (
    props,
) => {
    const {
        allCategories,
        excelLink,
        downloadExcelPermitted,
        selectedCategoryId,
        selectedCategory,
        selectedWebsiteType,
        onFilterChange,
        tableColumns,
        onClickToggleColumns,
        searchTerm,
        isLoadingData,
        excelRequestBody,
        hideTopBar,
        useSelection,
        hideUtils,
        filtersStateObject,
    } = props;
    const i18n = i18nFilter();
    const getVisibleIndexes = (columns) => columns.map((col) => col.visible);
    const [isColumnsPickerOpen, setIsColumnsPickerOpen] = useState<boolean>();
    const [visibleColumns, setVisibleColumns] = useState(getVisibleIndexes(tableColumns));
    const [excelDownloading, setExcelDownloading] = useState(false);
    const swNavigator = Injector.get("swNavigator") as any;
    const tableToggleGroups = getTableToggleGroups().map((obj) => ({
        ...obj,
        displayName: i18nFilter()(obj.displayName),
    }));

    const onSearch = (search) => {
        const { filter } = apiHelper.transformParamsForAPI({
            filter: { domain: search },
        });
        onFilterChange({ filter }, false);
        swNavigator.applyUpdateParams({
            search: search || null,
        });
    };

    const onCategoryItemClick = (category) => {
        const { filter } = apiHelper.transformParamsForAPI({
            filter: { category: category.forApi },
        });
        onFilterChange({ filter }, false);

        const value = category
            ? category.forApi.replace("~", " > ").replace("_", " ")
            : "Clear Filter";
        TrackWithGuidService.trackWithGuid("affiliate.by.keywords.category.filter.click", "click", {
            selection: value,
        });
        swNavigator.applyUpdateParams({
            category: category && category.forApi,
        });
    };

    const onWebsiteTypeItemClick = (websiteType) => {
        onFilterChange({ funcFlag: parseInt(websiteType.id) }, false);
        TrackWithGuidService.trackWithGuid(
            "affiliate.by.keywords.website.type.filter.click",
            "click",
            { selection: websiteType.text },
        );
        swNavigator.applyUpdateParams({
            websiteType: websiteType.text,
        });
    };

    const onCloseCategoryItem = () => {
        onFilterChange({ filter: { category: null } }, false);
        swNavigator.applyUpdateParams({
            category: null,
        });
    };

    const onCloseWebsiteTypeItem = () => {
        onFilterChange({ funcFlag: null }, false);
        swNavigator.applyUpdateParams({
            websiteType: null,
        });
    };

    const convertCategory = ({ Count, Name, Sons = [], id }, parentId = null) => {
        const text = `${i18nCategoryFilter()(Name)}${Count ? ` (${Count})` : ``}`;
        return {
            text,
            id,
            isCustomCategory: false,
            isChild: Sons.length === 0,
            icon: categoryClassIconFilter()(id),
            forApi: `${parentId ? `${parentId}~` : ``}${id}`,
        };
    };

    const categoryItems = () => {
        if (allCategories) {
            const categories = utils.manipulateCategories(allCategories);
            const items = categories.reduce((result, category) => {
                if (category.Sons.length > 0) {
                    return [
                        ...result,
                        convertCategory(category),
                        ...category.Sons.map((son) => convertCategory(son, category.id)),
                    ];
                } else {
                    return [...result, convertCategory(category)];
                }
            }, []);

            return items.map((item, index) => {
                return (
                    <CategoryItemContainer
                        {...item}
                        key={index}
                        selected={item.forApi === selectedCategoryId}
                    />
                );
            });
        } else {
            return null;
        }
    };

    const websiteTypeItems = getWebsiteTypeOptions().map((websiteType) => {
        return (
            <EllipsisDropdownItem
                key={websiteType.text}
                id={websiteType.id}
                text={i18n(websiteType.text)}
                selected={i18n(websiteType.text) === selectedWebsiteType}
            >
                {i18n(websiteType.text)}
            </EllipsisDropdownItem>
        );
    });

    useEffect(() => {
        $("body").trigger(UPDATE_HIGHLIGHT_CLICKED_ROW_EVENT);
    }, [isColumnsPickerOpen]);

    const onApplyColumnsPicker = (columns) => {
        setIsColumnsPickerOpen(false);
        setVisibleColumns(getVisibleIndexes(columns));
        onClickToggleColumns(columns.map((column) => column.visible));
    };

    const getVisibleColumns = () => {
        return tableColumns.map((col, idx) => {
            return {
                ...col,
                visible: visibleColumns[idx],
            };
        });
    };

    const toggleColumnsPicker = (toVal: boolean) => {
        if (toVal) {
            TrackWithGuidService.trackWithGuid(
                "affiliate.by.keywords.column.picker.open.click",
                "open",
            );
        }

        setIsColumnsPickerOpen(toVal);
    };

    const isClearAllDisabled = () => !selectedCategoryId && !selectedWebsiteType;

    const onClearAll = () => {
        onFilterChange({ filter: { category: null }, funcFlag: null }, false);
        swNavigator.applyUpdateParams({
            category: null,
            websiteType: null,
        });
    };

    const onExcelDownload = useCallback(async () => {
        TrackWithGuidService.trackWithGuid("affiliate.by.keywords.download.excel", "click");
        setExcelDownloading(true);
        try {
            await ExcelClientDownload(excelLink, excelRequestBody);
        } catch (e) {
        } finally {
            setExcelDownloading(false);
        }
    }, [excelLink]);

    return (
        !isLoadingData &&
        !hideTopBar && (
            <div>
                <TopLine>
                    <FiltersContainers alignItems="center">
                        {allCategories && (
                            <ChipdownItem>
                                <ChipDownContainer
                                    width={400}
                                    tooltipDisabled={true}
                                    hasSearch={true}
                                    selectedIds={
                                        selectedCategoryId && { [selectedCategoryId]: true }
                                    }
                                    selectedText={selectedCategory}
                                    buttonText={i18n("dropdown.category")}
                                    onClick={onCategoryItemClick}
                                    onCloseItem={onCloseCategoryItem}
                                    searchPlaceHolder={i18n(
                                        "home.dashboards.wizard.filters.searchCategory",
                                    )}
                                >
                                    {categoryItems()}
                                </ChipDownContainer>
                            </ChipdownItem>
                        )}
                        <ChipdownItem>
                            <ChipDownContainer
                                width={280}
                                hasSearch={false}
                                selectedIds={selectedWebsiteType && { [selectedWebsiteType]: true }}
                                selectedText={
                                    selectedWebsiteType && capitalize(selectedWebsiteType)
                                }
                                buttonText={i18n(
                                    "analysis.source.search.keywords.filters.websitetype",
                                )}
                                onClick={onWebsiteTypeItemClick}
                                onCloseItem={onCloseWebsiteTypeItem}
                                tooltipDisabled={true}
                            >
                                {websiteTypeItems}
                            </ChipDownContainer>
                        </ChipdownItem>
                        <Button type="flat" isDisabled={isClearAllDisabled()} onClick={onClearAll}>
                            {i18n("forms.buttons.clearall.text")}
                        </Button>
                    </FiltersContainers>
                </TopLine>
                <SearchContainer>
                    <SearchInput
                        clearValue={false}
                        defaultValue={searchTerm}
                        debounce={400}
                        onChange={onSearch}
                        placeholder={i18n("forms.search.placeholder")}
                    />
                    {!hideUtils && (
                        <Right>
                            <FlexRow>
                                {downloadExcelPermitted && (
                                    <PlainTooltip
                                        placement="top"
                                        text={i18n("directives.csv.downloadCSV")}
                                    >
                                        <div className="export-buttons-wrapper">
                                            <div data-automation="Download Excel">
                                                <IconButton
                                                    isLoading={excelDownloading}
                                                    type="flat"
                                                    iconName="excel"
                                                    onClick={onExcelDownload}
                                                />
                                            </div>
                                        </div>
                                    </PlainTooltip>
                                )}
                                <PlainTooltip
                                    text={i18n(
                                        "affiliate.by.opportunities.table.top.columns.picker.tooltip",
                                    )}
                                    placement="top"
                                >
                                    <div>
                                        <IconButton
                                            iconName="columns"
                                            type="flat"
                                            dataAutomation="list-header-columns-configure-button"
                                            onClick={() => toggleColumnsPicker(true)}
                                        />
                                    </div>
                                </PlainTooltip>
                            </FlexRow>
                        </Right>
                    )}
                </SearchContainer>
                <ColumnsPickerModal
                    isOpen={isColumnsPickerOpen}
                    onCancelClick={() => toggleColumnsPicker(false)}
                    onApplyClick={onApplyColumnsPicker}
                    groupsData={tableToggleGroups}
                    columnsData={getVisibleColumns()}
                    showRestore={true}
                    defaultColumnsData={FindAffiliateByKeywordsTableSettings.getColumns(
                        null,
                        useSelection,
                    )}
                    storageKey="find_affiliate_by_opportunities"
                />
            </div>
        )
    );
};
