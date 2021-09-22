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
import { InfoIcon } from "components/BoxTitle/src/BoxTitle";
import { AddToDashboardButton } from "components/React/AddToDashboard/AddToDashboardButton";
import { CategoryItem } from "components/React/CategoriesDropdown/CategoryDropdown";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { TagsCloud } from "components/TagsCloud/TagsCloud";
import {
    bigNumberFilter,
    categoryClassIconFilter,
    i18nCategoryFilter,
    i18nFilter,
    minVisitsFilter,
    percentageFilter,
    suffixFilter,
} from "filters/ngFilters";
import { SingleBox } from "pages/website-analysis/audience-interests/single/AudienceInterestsTableTop/AudienceInterestsTableTopStyles";
import { CategoryDistribution } from "pages/website-analysis/incoming-traffic/CategoryDisterbution";
import { DownloadExcelContainer, SearchContainer } from "pages/workspace/StyledComponent";
import { FunctionComponent } from "react";
import * as React from "react";
import { allTrackers } from "services/track/track";
import utils from "Shared/utils";
import styled, { css } from "styled-components";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";

const Section = styled.div<{ margin?: number }>`
    padding: 0 12px;
    display: flex;
    align-items: center;
    ${({ margin }) =>
        margin &&
        css`
            margin: ${margin}px 0;
        `};
`;
const TotalItem = styled.div`
    height: 41px;
    flex-grow: 1;
    text-transform: capitalize;
    padding-left: 15px;
    display: flex;
    align-items: center;
    border-right: 1px solid ${colorsPalettes.carbon[50]};
    justify-content: center;
    &:last-of-type {
        border-right: 0;
    }
`;
const NumberStyled = styled.span`
    margin-right: 4px;
    ${mixins.setFont({ $size: 32, $color: colorsPalettes.carbon[500], $weight: 300 })};}`;
const TextStyled = styled.span`
    ${mixins.setFont({ $size: 14, $color: rgba(colorsPalettes.carbon[500], 0.8) })};
    max-width: 100px;
    margin-left: 8px;
    line-height: 19px;
`;
const Separator = styled.hr`
    border-top-color: ${colorsPalettes.carbon[50]};
    margin: 0;
`;
const CategoryItemContainer = styled(CategoryItem)`
    font-weight: 400;
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
const StyledLabel = styled.div`
    ${mixins.setFont({ $color: colorsPalettes.carbon[500], $weight: 300, $size: 16 })};
`;

const Right = styled.div`
    flex-grow: 0;
    display: flex;
    align-items: center;
    margin-left: 10px;
`;
const CategoriesAndTopicsDist = styled.div`
    display: flex;
    padding: 17px;
`;
const CategoriesWrapper = styled(SingleBox)`
    flex-basis: 60%;
    margin-right: 16px;
`;

const TopicsWrapper = styled(SingleBox)`
    flex-basis: 40%;
    padding: 16px;
    box-sizing: border-box;
`;
const TopicsTitle = styled.div`
    ${mixins.setFont({ $size: 14, $color: colorsPalettes.carbon[500] })};
    margin-bottom: 20px;
    display: flex;
`;
export const OutgoingTrafficPageTableTop: FunctionComponent<any> = (props) => {
    const i18n = i18nFilter();
    const i18nCategory = i18nCategoryFilter();
    const bigNumber = bigNumberFilter();
    const minVisits = minVisitsFilter();
    const percentage = percentageFilter();
    const suffix = suffixFilter();
    const categoryClassIcon = categoryClassIconFilter();
    const {
        onSelectCategory: onSelectCategoryProps,
        tableTopData: {
            AllCategories,
            TotalVisits,
            TotalUnGroupedCount,
            TotalShare,
            domainMetaData,
            categoriesData,
            Topics,
        },
        isLoadingData,
        selectedCategory,
        selectedCategoryId,
        onClearAll,
        tableColumns,
        onClickToggleColumns,
        downloadExcelPermitted,
        excelLink,
        searchValue,
        onChange,
        a2d,
        getCategoryLink,
        selectedSites,
        selectedSite,
        onSelectSite,
        onClearSite,
        isCompare,
    } = props;
    const selectedSiteFilter =
        selectedSites.find((x) => x.value === selectedSite) || selectedSites[0];
    const selectedSiteFilterText = selectedSiteFilter.label;

    const getCategoriesOptions = () => {
        const categories = utils.manipulateCategories(AllCategories);
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
    };
    const convertCategory = ({ Count, Name, Sons = [], id }, parentId = null) => {
        const text = `${i18nCategory(Name)}${Count ? ` (${Count})` : ``}`;
        return {
            text,
            id,
            isCustomCategory: false,
            isChild: Sons.length === 0,
            icon: categoryClassIcon(id),
            forApi: `${parentId ? `${parentId}~` : ``}${id}`,
        };
    };
    const onSelectCategory = (category) => {
        const value = category
            ? category.forApi.replace("~", " > ").replace("_", " ")
            : "Clear Filter";
        allTrackers.trackEvent("Drop Down", "click", `Table/Category/${value}`);
        onSelectCategoryProps(category && category.forApi);
    };
    const onClearCategory = () => {
        onSelectCategory(null);
    };
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
    return !isLoadingData ? (
        <>
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
                </TopStyledLeft>
                <Button type="flat" onClick={onClearAll}>
                    {i18n("forms.buttons.clearall.text")}
                </Button>
            </TopStyled>
            <Separator />
            <Section margin={19}>
                <TotalItem>
                    <NumberStyled>{minVisits(bigNumber(TotalVisits))}</NumberStyled>
                    <TextStyled>{i18n("analysis.destination.out.visits")}</TextStyled>
                </TotalItem>
                <TotalItem>
                    <NumberStyled>{suffix(percentage(TotalShare, 2), "%")}</NumberStyled>
                    <TextStyled>{`${i18n("shared.totals.total")} ${i18n(
                        "analysis.destination.out.visits",
                    )}`}</TextStyled>
                </TotalItem>
                <TotalItem>
                    <NumberStyled>{TotalUnGroupedCount}</NumberStyled>
                    <TextStyled>{i18n("analysis.destination.out.domains")}</TextStyled>
                </TotalItem>
            </Section>
            <Separator />
            {domainMetaData && (
                <CategoriesAndTopicsDist>
                    <CategoriesWrapper border={1}>
                        <CategoryDistribution
                            domains={domainMetaData}
                            data={categoriesData}
                            getLink={getCategoryLink}
                        />
                    </CategoriesWrapper>
                    <TopicsWrapper border={1}>
                        <TopicsTitle>
                            {i18n("shared.cats-topics.title2")}
                            <PlainTooltip
                                placement="top"
                                tooltipContent={i18n("shared.cats-topics.title2.tooltip")}
                            >
                                <span>
                                    <InfoIcon iconName="info" />
                                </span>
                            </PlainTooltip>
                        </TopicsTitle>
                        <TagsCloud tags={Topics} />
                    </TopicsWrapper>
                </CategoriesAndTopicsDist>
            )}
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
                        <div>
                            <AddToDashboardButton onClick={a2d} />
                        </div>
                    </FlexRow>
                </Right>
            </SearchContainer>
        </>
    ) : null;
};
