import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";
import {
    ColumnsPickerLite,
    IColumnsPickerLiteProps,
} from "@similarweb/ui-components/dist/columns-picker";
import {
    ChipDownContainer,
    DomainsChipDownContainer,
} from "@similarweb/ui-components/dist/dropdown";
import { ListItemWebsite } from "@similarweb/ui-components/dist/list-item";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { CategoryItem } from "components/React/CategoriesDropdown/CategoryDropdown";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { categoryClassIconFilter, i18nCategoryFilter, i18nFilter } from "filters/ngFilters";
import {
    Separator,
    Title,
} from "pages/website-analysis/audience-interests/single/AudienceInterestsTableTop/AudienceInterestsTableTopStyles";
import { DownloadExcelContainer, SearchContainer } from "pages/workspace/StyledComponent";
import React, { FunctionComponent } from "react";
import { allTrackers } from "services/track/track";
import utils from "Shared/utils";
import { PrimaryBoxTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import styled from "styled-components";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";

const StyledLabel = styled.div`
    ${mixins.setFont({ $color: colorsPalettes.carbon[500], $weight: 300, $size: 16 })};
`;
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
const CategoryItemContainer = styled(CategoryItem)`
    font-weight: 400;
`;
const Right = styled.div`
    flex-grow: 0;
    display: flex;
    align-items: center;
    margin-left: 10px;
`;
export const CompetitiveLandscapeTableTop: FunctionComponent<any> = (props) => {
    const i18n = i18nFilter();
    const categoryClassIcon = categoryClassIconFilter();
    const {
        onSelectCategory: onSelectCategoryProps,
        tableColumns,
        onClickToggleColumns,
        selectedSite,
        excelLink,
        downloadExcelPermitted,
        onChange,
        searchValue,
        isLoadingData,
        selectedCategory,
        selectedCategoryId,
        onClearAll,
        selectedSites,
        onSelectSite,
        onClearSite,
        isCompare,
        allCategories,
    } = props;
    const selectedSiteFilter =
        selectedSites.find((x) => x.value === selectedSite) || selectedSites[0];
    const selectedSiteFilterText = selectedSiteFilter.label;

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
            maxHeight: 264,
            width: "auto",
        };
    };
    const onColumnToggle = (key) => {
        onClickToggleColumns(parseInt(key, 10));
    };
    const excelDownloadUrl = downloadExcelPermitted ? excelLink : "";
    let excelLinkHref = {};
    if (excelDownloadUrl !== "") {
        excelLinkHref = { href: excelDownloadUrl };
    }
    const trackExcelDownload = () => {
        allTrackers.trackEvent("Download", "submit-ok", "Table/Excel");
    };
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
    const onSelectCategory = (category) => {
        const value = category
            ? category.forApi.replace("~", " > ").replace("_", " ")
            : "Clear Filter";
        allTrackers.trackEvent("Drop Down", "click", `Table/Category/${value}`);
        onSelectCategoryProps(category && category.id);
    };
    const onClearCategory = () => {
        onSelectCategory(null);
    };
    return isLoadingData ? null : (
        <>
            <Title>
                <PrimaryBoxTitle>
                    {i18n("analysis.common.competitors.similar.title", { site: selectedSite })}
                    <PlainTooltip
                        tooltipContent={i18n("analysis.common.competitors.similar.title.tooltip")}
                    >
                        <div style={{ display: "inline-block", marginLeft: 6 }}>
                            <SWReactIcons iconName="info" size="xs" />
                        </div>
                    </PlainTooltip>
                </PrimaryBoxTitle>
            </Title>
            <Separator />
            <TopStyled>
                <TopStyledLeft>
                    <StyledLabel>{i18n("traffic.search.phrases.page.filterby.title")}</StyledLabel>
                    {isCompare && (
                        <ChipWrap>
                            <DomainsChipDownContainer
                                onClick={onSelectSite}
                                selectedIds={{ [selectedSiteFilter.value]: true }}
                                selectedDomainText={selectedSiteFilterText}
                                selectedDomainIcon={selectedSiteFilter.icon}
                                onCloseItem={onClearSite}
                                buttonText={selectedSiteFilter.label}
                            >
                                {selectedSites.map((item, index) => {
                                    const { value, label, icon } = item;
                                    return (
                                        <ListItemWebsite key={index} text={label} img={icon}>
                                            {label}
                                        </ListItemWebsite>
                                    );
                                })}
                            </DomainsChipDownContainer>
                        </ChipWrap>
                    )}
                    {allCategories.length > 0 && (
                        <ChipWrap>
                            <ChipDownContainer
                                width={340}
                                onClick={onSelectCategory}
                                selectedText={selectedCategory ?? ""}
                                onCloseItem={onClearCategory}
                                buttonText={i18n("common.category.all")}
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
                    </FlexRow>
                </Right>
            </SearchContainer>
        </>
    );
};
