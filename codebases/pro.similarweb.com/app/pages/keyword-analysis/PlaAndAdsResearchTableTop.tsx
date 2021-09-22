import { colorsPalettes, mixins } from "@similarweb/styles";
import {
    ColumnsPickerLite,
    IColumnsPickerLiteProps,
} from "@similarweb/ui-components/dist/columns-picker";
import { DomainsChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { ListItemWebsite } from "@similarweb/ui-components/dist/list-item";
import categoryService from "common/services/categoryService";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { Injector } from "common/ioc/Injector";
import { MultiCategoriesChipDown } from "components/MultiCategoriesChipDown/src/MultiCategoriesChipDown";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import { i18nCategoryFilter, i18nFilter } from "filters/ngFilters";
import { DownloadExcelContainer, SearchContainer } from "pages/workspace/StyledComponent";
import React from "react";
import { allTrackers } from "services/track/track";
import styled from "styled-components";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";

const TopStyled = styled.div`
    display: flex;
    align-items: center;
    padding: 12px;
`;
const StyledLabel = styled.div`
    ${mixins.setFont({ $color: colorsPalettes.carbon[500], $weight: 300, $size: 16 })};
`;
const ChipWrap = styled.div`
    padding-left: 8px;
`;

const Right = styled.div`
    flex-grow: 0;
    display: flex;
    align-items: center;
    margin-left: 10px;
`;
const ChipdownItem = styled.div`
    flex-grow: 0;
    margin-right: 8px;
    margin-left: 8px;
`;
const PlaAndAdsResearchTableTop = (props) => {
    const i18n = i18nFilter();
    const i18nCategory = i18nCategoryFilter();
    const categories = categoryService.getCategories();
    const availableAdTypes = [
        {
            value: "all",
            label: i18n("keyword.analysis.ads.type.all"),
        },
        {
            value: "text",
            label: i18n("keyword.analysis.ads.type.text"),
        },
        {
            value: "shopping",
            label: i18n("keyword.analysis.ads.type.shopping"),
        },
    ];
    const {
        downloadExcelPermitted,
        excelLink,
        tableColumns,
        onClickToggleColumns,
        onCategorySelected,
        selectedCategory,
        onSearch,
        searchValue,
        showCategorySelector = true,
        showDomainSelector = false,
        onSelectDomain,
        selectedDomain,
    } = props;
    const onChange = (value) => {
        onSearch(value);
    };
    const convertCategory = ({ Count = 0, text: Name, sons: Sons = [], id }, parentId = null) => {
        let text;
        if (parentId) {
            text = `${i18nCategory(`${parentId}/${Name}`, true)}`;
        } else {
            text = i18nCategory(Name);
        }
        const forApi = `${parentId ? `${parentId}~` : ``}${id}`;
        return {
            text,
            count: Count,
            name: text,
            id: forApi,
            isCustomCategory: false,
            isChild: parentId !== null,
            icon: text.replace(/~.+/g, "").replace(/\s+/g, "-").toLowerCase(),
            forApi,
            parentId,
        };
    };
    const getCategoriesOptions = () => {
        return categories.reduce((result, category) => {
            return [
                ...result,
                {
                    ...convertCategory(category),
                    sons: (category.Sons || []).map((son) => convertCategory(son, category.id)),
                },
            ];
        }, []);
    };
    const excelDownloadUrl = downloadExcelPermitted ? excelLink : "";
    let excelLinkHref = {};
    if (excelDownloadUrl !== "") {
        excelLinkHref = { href: excelDownloadUrl };
    }
    const onColumnToggle = (key) => {
        onClickToggleColumns(parseInt(key, 10));
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
    const trackExcelDownload = () => {
        allTrackers.trackEvent("Download", "submit-ok", "Table/Excel");
    };

    const domains = Injector.get<any>("chosenSites").sitelistForLegend();
    const selectedDomainObj = selectedDomain
        ? domains.find((domain) => domain.name === selectedDomain)
        : domains[0];
    const getDomainsOptions = () => {
        return domains.map(({ name, icon }, index) => {
            return <ListItemWebsite key={index} text={name} img={icon} />;
        });
    };
    const categorySelector = (
        <ChipWrap>
            <MultiCategoriesChipDown
                categories={getCategoriesOptions()}
                initialSelectedCategories={selectedCategory}
                onDone={onCategorySelected}
                buttonText="All Categories"
                searchPlaceholder="Search for categories"
            />
        </ChipWrap>
    );
    const domainsSelector = selectedDomainObj && (
        <ChipdownItem>
            <DomainsChipDownContainer
                width={200}
                onClick={onSelectDomain}
                selectedDomainText={selectedDomainObj.name}
                selectedDomainIcon={selectedDomainObj.icon}
                onCloseItem={onSelectDomain}
                buttonText={i18n("common.category.all")}
            >
                {getDomainsOptions()}
            </DomainsChipDownContainer>
        </ChipdownItem>
    );

    return (
        <>
            <TopStyled>
                <StyledLabel>{i18n("keyword.analysis.ads.page.filterby")}</StyledLabel>
                {showCategorySelector && categorySelector}
                {showDomainSelector && domainsSelector}
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
                        {downloadExcelPermitted && (
                            <DownloadExcelContainer {...excelLinkHref}>
                                <DownloadButtonMenu
                                    Excel={true}
                                    downloadUrl={excelDownloadUrl}
                                    exportFunction={trackExcelDownload}
                                    excelLocked={!downloadExcelPermitted}
                                />
                            </DownloadExcelContainer>
                        )}
                        <div>
                            <ColumnsPickerLite {...getColumnsPickerLiteProps()} withTooltip />
                        </div>
                    </FlexRow>
                </Right>
            </SearchContainer>
        </>
    );
};

export default PlaAndAdsResearchTableTop;
