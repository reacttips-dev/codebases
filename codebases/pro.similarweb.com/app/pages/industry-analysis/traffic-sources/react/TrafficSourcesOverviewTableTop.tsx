import React, { FunctionComponent } from "react";
import { i18nFilter, categoryClassIconFilter } from "filters/ngFilters";
import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";
import { ChipDownContainer, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { CategoryItem } from "components/React/CategoriesDropdown/CategoryDropdown";
import { ICategory } from "common/services/categoryService.types";
import { Button } from "@similarweb/ui-components/dist/button";
import { allTrackers } from "services/track/track";
import { DownloadExcelContainer, SearchContainer } from "pages/workspace/StyledComponent";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import {
    ColumnsPickerLite,
    IColumnsPickerLiteProps,
} from "@similarweb/ui-components/dist/columns-picker";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";

const TopStyled = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px;
`;
const TopStyledLeft = styled.div`
    display: flex;
    align-items: center;
`;
const ChipWrap = styled.div`
    padding-left: 8px;
`;
const StyledLabel = styled.div`
    ${mixins.setFont({ $color: colorsPalettes.carbon[500], $weight: 300, $size: 16 })};
`;
const CategoryItemContainer = styled(CategoryItem)`
    font-weight: 400;
`;
const Right = styled.div`
    flex-grow: 0;
    display: flex;
    align-items: center;
    margin-left: 10px;
`;

export interface ISource {
    count: number;
    id: string;
    text: string;
}
interface ITrafficSourcesOverviewTableTopProps {
    children?: React.ReactNode;
    isLoadingData: boolean;
    allCategories: ICategory[];
    onSelectCategory: (value: string) => void;
    onClearAll: VoidFunction;
    selectedCategory: string;
    selectedCategoryId: string;
    allSources: ISource[];
    onSelectSourceType: (value: string) => void;
    selectSourceType: string;
    tableColumns: any;
    onClickToggleColumns: (col: number) => void;
    downloadExcelPermitted: boolean;
    excelLink: string;
    a2d: VoidFunction;
    searchValue: string;
    onChange: (search: string) => void;
    currentState: string;
}
export const TrafficSourcesOverviewTableTop: FunctionComponent<ITrafficSourcesOverviewTableTopProps> = ({
    isLoadingData,
    allCategories,
    onSelectCategory: onSelectCategoryProps,
    onClearAll,
    selectedCategory,
    selectedCategoryId,
    allSources,
    onSelectSourceType: onSelectSourceTypeProps,
    selectSourceType,
    tableColumns,
    onClickToggleColumns,
    downloadExcelPermitted,
    excelLink,
    a2d,
    searchValue,
    onChange,
    currentState,
}) => {
    const i18n = i18nFilter();
    const categoryClassIcon = categoryClassIconFilter();

    const excelDownloadUrl = downloadExcelPermitted ? excelLink : "";
    let excelLinkHref = {};
    if (excelDownloadUrl !== "") {
        excelLinkHref = { href: excelDownloadUrl };
    }
    const trackExcelDownload = () => {
        allTrackers.trackEvent("Download", "submit-ok", "Table/Excel");
    };

    const getCategoriesOptions = (): React.ReactNode[] => {
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
                <CategoryItemContainer
                    {...item}
                    key={index}
                    selected={item.forApi === selectedCategoryId}
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
        onSelectCategory(null);
    };
    const onClearSourceType = (): void => {
        onSelectSourceType(null);
    };
    const onSelectCategory = (category): void => {
        const value = category
            ? category.forApi.replace("~", " > ").replace("_", " ")
            : "Clear Filter";
        allTrackers.trackEvent("Drop Down", "click", `Table/Category/${value}`);
        onSelectCategoryProps(category && category.id);
    };
    const onSelectSourceType = (source): void => {
        const value = source ? source.id : "Clear Filter";
        allTrackers.trackEvent("Drop Down", "click", `Table/SourceType/${value}`);
        onSelectSourceTypeProps(source && source.id);
    };
    const getColumnsPickerLiteProps = (): IColumnsPickerLiteProps => {
        const columns = tableColumns.reduce((res, col, index) => {
            if (
                !col.fixed &&
                selectSourceType === "Display Ad" &&
                col.displayName !== "Source Type" &&
                currentState === "findpublishers_byindustry"
            ) {
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
        onClickToggleColumns(parseInt(key, 10));
    };

    return isLoadingData ? null : (
        <>
            <TopStyled>
                <TopStyledLeft>
                    <StyledLabel>{i18n("traffic.search.phrases.page.filterby.title")}</StyledLabel>
                    {allCategories.length > 0 && (
                        <ChipWrap>
                            <ChipDownContainer
                                width={340}
                                onClick={onSelectCategory}
                                selectedText={selectedCategory ?? ""}
                                onCloseItem={onClearCategory}
                                buttonText={i18n(
                                    "widget.table.trafficsourcesoverviewdatakpiwidget.filters.allcategory",
                                )}
                                searchPlaceHolder={i18n(
                                    "home.dashboards.wizard.filters.searchCategory",
                                )}
                                tooltipDisabled={true}
                                hasSearch={true}
                            >
                                {getCategoriesOptions()}
                            </ChipDownContainer>
                        </ChipWrap>
                    )}
                    {allSources.length > 0 &&
                        selectSourceType !== "Display Ad" &&
                        currentState !== "findpublishers_byindustry" && (
                            <ChipWrap>
                                <ChipDownContainer
                                    width={340}
                                    onClick={onSelectSourceType}
                                    selectedText={selectSourceType ?? ""}
                                    onCloseItem={onClearSourceType}
                                    buttonText={i18n(
                                        "widget.table.trafficsourcesoverviewdatakpiwidget.filters.allsources",
                                    )}
                                    searchPlaceHolder={i18n(
                                        "home.dashboards.wizard.filters.searchSourceType",
                                    )}
                                    tooltipDisabled={true}
                                    hasSearch={true}
                                >
                                    {allSources.map(
                                        (source: ISource): React.ReactNode => {
                                            const { count, id, text } = source;
                                            return (
                                                <EllipsisDropdownItem
                                                    id={id}
                                                    key={id}
                                                    text={text}
                                                    infoText={count}
                                                >
                                                    {text}
                                                </EllipsisDropdownItem>
                                            );
                                        },
                                    )}
                                </ChipDownContainer>
                            </ChipWrap>
                        )}
                </TopStyledLeft>
                <Button type="flat" onClick={onClearAll}>
                    {i18n("forms.buttons.clearall.text")}
                </Button>
            </TopStyled>
            <SearchContainer>
                <SearchInput
                    disableClear={true}
                    defaultValue={searchValue}
                    debounce={400}
                    onChange={onChange}
                    placeholder={i18n("forms.search.placeholder")}
                />
                <Right>
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
                        {selectSourceType !== "Display Ad" &&
                            currentState === "findpublishers_byindustry" && (
                                <div>
                                    <AddToDashboardButton onClick={a2d} />
                                </div>
                            )}
                    </FlexRow>
                </Right>
            </SearchContainer>
        </>
    );
};
