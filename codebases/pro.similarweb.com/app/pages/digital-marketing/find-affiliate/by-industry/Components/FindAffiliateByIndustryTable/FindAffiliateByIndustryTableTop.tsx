import React, { FunctionComponent, useMemo } from "react";
import { categoryClassIconFilter, i18nFilter, subCategoryFilter } from "filters/ngFilters";
import { ChipDownContainer, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { ICategory } from "common/services/categoryService.types";
import { Button } from "@similarweb/ui-components/dist/button";
import { DownloadExcelContainer, SearchContainer } from "pages/workspace/StyledComponent";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import {
    ColumnsPickerLite,
    IColumnsPickerLiteProps,
} from "@similarweb/ui-components/dist/columns-picker";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { getWebsiteTypeOptions } from "./FindAffiliateByIndustryTableSettings";
import capitalize from "lodash/capitalize";
import {
    CategoryItemWrapper,
    ChipWrapper,
    RightWrapper,
    StyledLabel,
    TopStyled,
    TopStyledLeft,
} from "./StyledComponents";
import { Injector } from "common/ioc/Injector";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import * as queryString from "querystring";

export interface ISource {
    count: number;
    id: string;
    text: string;
}
interface IReferralSourcesTableTopProps {
    children?: React.ReactNode;
    isLoadingData: boolean;
    allCategories: ICategory[];
    tableColumns: any;
    onClickToggleColumns: (col: number) => void;
    downloadExcelPermitted: boolean;
    searchValue: string;
    filtersStateObject: any;
    dataParamsAdapter: (params) => object;
}
export const FindAffiliateByIndustryTableTop: FunctionComponent<IReferralSourcesTableTopProps> = ({
    isLoadingData,
    allCategories,
    tableColumns,
    onClickToggleColumns,
    downloadExcelPermitted,
    dataParamsAdapter,
    searchValue,
    filtersStateObject,
}) => {
    const swNavigator: any = Injector.get("swNavigator");
    const categoryClassIcon = categoryClassIconFilter();
    const subCategory = subCategoryFilter();
    const selectedCategory = filtersStateObject.category
        ? decodeURIComponent(subCategory(filtersStateObject.category))
        : null;
    const selectedWebsiteTypeName =
        filtersStateObject.funcFlag &&
        getWebsiteTypeOptions().find((item) => item.id === filtersStateObject.funcFlag).text;

    const excelLink = useMemo(() => {
        const queryParams = {
            ...dataParamsAdapter(filtersStateObject),
            category: filtersStateObject.category ?? filtersStateObject.categoryDisplayApi,
        };
        const queryStringParams = queryString.stringify(queryParams);
        return `/widgetApi/IndustryAnalysis/IndustryAffiliate/Excel?${queryStringParams}`;
    }, [filtersStateObject]);
    const excelDownloadUrl = downloadExcelPermitted ? excelLink : "";

    let excelLinkHref = {};
    if (excelDownloadUrl !== "") {
        excelLinkHref = { href: excelDownloadUrl };
    }
    const trackExcelDownload = () => {
        TrackWithGuidService.trackWithGuid("find_affiliate_by_industry.download.excel", "click");
    };

    ////////  Categories Options Filter  ////////

    const getCategoriesOptions = () => {
        const items = allCategories.reduce((result, category) => {
            if (category.children.length > 0) {
                return [
                    ...result,
                    convertCategory(category),
                    ...category.children.map((child) => convertCategory(child, category.id)),
                ];
            } else {
                return [...result, convertCategory(category)];
            }
        }, []);
        return items.map((item, index) => {
            return (
                <CategoryItemWrapper
                    {...item}
                    key={index}
                    selected={item.forApi === selectedCategory}
                />
            );
        });
    };
    const convertCategory = ({ text, children = [], id }, parentId = null) => {
        return {
            text,
            id,
            isCustomCategory: false,
            isChild: !children || children.length === 0,
            icon: categoryClassIcon(id),
            forApi: `${parentId ? `${parentId}~` : ``}${id}`,
        };
    };
    const onClearCategory = (): void => {
        swNavigator.applyUpdateParams({
            selectedCategory: null,
        });
    };
    const onSelectCategory = (category): void => {
        const value = category
            ? category.forApi.replace("~", " > ").replace("_", " ")
            : "Clear Filter";
        TrackWithGuidService.trackWithGuid(
            "find_affiliate_by_industry.category_filter.click",
            "click",
            { category: value },
        );
        swNavigator.applyUpdateParams({
            selectedCategory: category && category.id,
        });
    };
    ///////////////////////////////////

    ////////  Website Type Filter  ////////
    const getWebsiteTypeItems = () => {
        const items = getWebsiteTypeOptions();
        return items.map((websiteTypeItem) => {
            return (
                <EllipsisDropdownItem
                    key={websiteTypeItem.text}
                    id={websiteTypeItem.id}
                    tooltipText={websiteTypeItem.tooltipText}
                    text={websiteTypeItem.text}
                >
                    {websiteTypeItem.text}
                </EllipsisDropdownItem>
            );
        });
    };
    const onWebsiteTypeItemClick = (websiteTypeItem) => {
        TrackWithGuidService.trackWithGuid(
            "find_affiliate_by_industry.website_type_filter.click",
            "click",
            { websiteType: websiteTypeItem.text },
        );
        swNavigator.applyUpdateParams({
            funcFlag: parseInt(websiteTypeItem.id),
        });
    };
    const onCloseWebsiteTypeItem = () => {
        swNavigator.applyUpdateParams({
            funcFlag: null,
        });
    };
    //////////////////////////////////////////

    const getColumnsPickerLiteProps = (): IColumnsPickerLiteProps => {
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
            onColumnToggle,
            onPickerToggle: () => null,
        };
    };
    const onColumnToggle = (key) => {
        TrackWithGuidService.trackWithGuid(
            "find_affiliate_by_industry.column_picker.click",
            "click",
            { state: "open" },
        );
        onClickToggleColumns(parseInt(key, 10));
    };
    const onClearAll = (): void => {
        TrackWithGuidService.trackWithGuid("find_affiliate_by_industry.clear_all.filters", "click");
        swNavigator.applyUpdateParams({
            selectedCategory: null,
            searchValue: null,
            funcFlag: null,
        });
    };
    const onSearch = (searchValue): void => {
        swNavigator.applyUpdateParams({
            searchValue,
        });
    };

    return (
        !isLoadingData && (
            <>
                <TopStyled>
                    <TopStyledLeft>
                        <StyledLabel>
                            {i18nFilter()("traffic.search.phrases.page.filterby.title")}
                        </StyledLabel>
                        {allCategories.length > 0 && (
                            <ChipWrapper>
                                <ChipDownContainer
                                    width={340}
                                    onClick={onSelectCategory}
                                    selectedText={selectedCategory ?? ""}
                                    onCloseItem={onClearCategory}
                                    buttonText={i18nFilter()(
                                        "widget.table.trafficsourcesoverviewdatakpiwidget.filters.allcategory",
                                    )}
                                    searchPlaceHolder={i18nFilter()(
                                        "home.dashboards.wizard.filters.searchCategory",
                                    )}
                                    tooltipDisabled={true}
                                    hasSearch={true}
                                >
                                    {getCategoriesOptions()}
                                </ChipDownContainer>
                            </ChipWrapper>
                        )}
                        <ChipWrapper>
                            <ChipDownContainer
                                width={280}
                                hasSearch={false}
                                selectedIds={
                                    filtersStateObject.funcFlag && {
                                        [filtersStateObject.funcFlag]: true,
                                    }
                                }
                                selectedText={
                                    selectedWebsiteTypeName && capitalize(selectedWebsiteTypeName)
                                }
                                buttonText={i18nFilter()(
                                    "analysis.source.search.keywords.filters.websitetype",
                                )}
                                onClick={onWebsiteTypeItemClick}
                                onCloseItem={onCloseWebsiteTypeItem}
                                tooltipDisabled={true}
                            >
                                {getWebsiteTypeItems()}
                            </ChipDownContainer>
                        </ChipWrapper>
                    </TopStyledLeft>
                    <Button type="flat" onClick={onClearAll}>
                        {i18nFilter()("forms.buttons.clearall.text")}
                    </Button>
                </TopStyled>
                <SearchContainer>
                    <SearchInput
                        disableClear={true}
                        defaultValue={searchValue}
                        debounce={400}
                        onChange={onSearch}
                        placeholder={i18nFilter()("forms.search.placeholder")}
                    />
                    <RightWrapper>
                        <FlexRow>
                            <DownloadExcelContainer {...excelLinkHref}>
                                <DownloadButtonMenu
                                    Excel={true}
                                    downloadUrl={excelDownloadUrl}
                                    exportFunction={trackExcelDownload}
                                    excelLocked={!downloadExcelPermitted}
                                />
                            </DownloadExcelContainer>
                            <div>
                                <ColumnsPickerLite {...getColumnsPickerLiteProps()} />
                            </div>
                        </FlexRow>
                    </RightWrapper>
                </SearchContainer>
            </>
        )
    );
};
