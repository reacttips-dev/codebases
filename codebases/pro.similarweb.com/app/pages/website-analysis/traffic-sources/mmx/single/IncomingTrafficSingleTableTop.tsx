import { colorsPalettes, mixins, rgba } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";
import {
    ColumnsPickerLite,
    IColumnsPickerLiteProps,
} from "@similarweb/ui-components/dist/columns-picker";
import { ChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import * as React from "react";
import styled, { css } from "styled-components";

import BoxSubtitle from "../../../../../../.pro-features/components/BoxSubtitle/src/BoxSubtitle";
import { PrimaryBoxTitle } from "../../../../../../.pro-features/styled components/StyledBoxTitle/src/StyledBoxTitle";
import { Injector } from "../../../../../../scripts/common/ioc/Injector";
import { SwNavigator } from "../../../../../../scripts/common/services/swNavigator";
import utils from "../../../../../../scripts/Shared/utils";
import { AddToDashboardButton } from "../../../../../components/React/AddToDashboard/AddToDashboardButton";
import { DownloadButtonMenu } from "../../../../../components/React/DownloadButtonMenu/DownloadButtonMenu";
import {
    categoryClassIconFilter,
    i18nCategoryFilter,
    i18nFilter,
} from "../../../../../filters/ngFilters";
import { allTrackers } from "../../../../../services/track/track";
import { DownloadExcelContainer, SearchContainer } from "../../../../workspace/StyledComponent";
import { SubTitleReferrals } from "../../../incoming-traffic/StyledComponents";
import { CategoryItem } from "../../../../../components/React/CategoriesDropdown/CategoryDropdown";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { addToDashboard } from "UtilitiesAndConstants/UtilityFunctions/addToDashboard";
import { apiHelper } from "common/services/apiHelper";
import { buildFiltersForTable } from "./IncomingTrafficTableUtils";

interface IIncomingTrafficSingleTableTopProps {
    allCategories: Array<{
        Count: number;
        Name: string;
        Value: number;
    }>;
    topCategories: Array<{
        Count: number;
        Name: string;
        Value: number;
    }>;
    totalSectionData: {
        totalShare: number;
        totalUnGroupedCount: number;
        totalVisits: number;
    };
    onFilterChange: any;
    selectedCategory?: any;
    selectedCategoryId?: string;
    searchTerm?: string;
    excelLink: string;
    tableColumns: any[];
    onClickToggleColumns: (index) => void;
    referralsTrafficShare: Array<{
        color: string;
        name: string;
        percentage: number;
        value: number;
        valueText: string;
        width: number;
    }>;
    topics: Array<{ Name: string; Value: number }>;
    categoriesData: any[];
    domainMetaData: any[];
    filtersStateObject?: {
        filter: string;
        webSource: string;
    };
    downloadExcelPermitted?: boolean;
}

const Container = styled.div`
    display: flex;
    align-items: center;
    ${SearchContainer} {
        flex-grow: 1;
    }
`;

const Right = styled.div`
    flex-grow: 0;
    display: flex;
    align-items: center;
    margin-left: 10px;
`;

const CategoryItemContainer = styled(CategoryItem)`
    font-weight: 400;
`;

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

const ChipdownItem = styled.div`
    flex-grow: 0;
    margin-right: 8px;
`;

const Title = styled.div`
    padding: 24px 24px 22px 24px;
    ${mixins.setFont({ $size: 20, $color: colorsPalettes.carbon[500], $weight: 500 })};
`;

const Separator = styled.hr`
    border-top-color: ${colorsPalettes.carbon[50]};
    margin: 0;
`;

const SectionContainer = styled.div`
    padding: 0 24px;
`;

const i18n = i18nFilter();

export class IncomingTrafficSingleTableTop extends React.PureComponent<
    IIncomingTrafficSingleTableTopProps,
    any
> {
    public static defaultProps = {
        allCategories: [],
        selectedCategory: "",
        topics: [],
    };

    private swNavigator = Injector.get<SwNavigator>("swNavigator");
    private addToDashboardModal: { dismiss: (reason?: string) => void };

    constructor(props, context) {
        super(props, context);
    }

    public componentWillUnmount() {
        if (this.addToDashboardModal) {
            this.addToDashboardModal.dismiss();
        }
    }

    public render() {
        const subTitleFilters = [
            {
                filter: "webSource",
                value: this.swNavigator.getParams().webSource,
            },
        ];
        const excelDownloadUrl = this.props.downloadExcelPermitted ? this.props.excelLink : "";
        let excelLinkHref = {};
        if (excelDownloadUrl !== "") {
            excelLinkHref = { href: excelDownloadUrl };
        }
        return (
            <div>
                <Title>
                    <PrimaryBoxTitle>
                        {i18n("analysis.common.trafficsource.referrals.websites")}
                    </PrimaryBoxTitle>
                    <SubTitleReferrals>
                        <BoxSubtitle filters={subTitleFilters} />
                    </SubTitleReferrals>
                </Title>
                <Separator />
                <SectionContainer>
                    <Section margin={19}>
                        {
                            <ChipdownItem>
                                <ChipDownContainer
                                    width={340}
                                    onClick={this.onSelectCategory}
                                    selectedText={
                                        this.props.selectedCategory
                                            ? this.props.selectedCategory.id
                                                  .replace(/~/g, " > ")
                                                  .replace(/_/g, " ")
                                            : undefined
                                    }
                                    onCloseItem={this.onClearCategory}
                                    buttonText={i18n("common.category.all")}
                                    searchPlaceHolder={i18n(
                                        "home.dashboards.wizard.filters.searchCategory",
                                    )}
                                    hasSearch={true}
                                >
                                    {this.getCategoriesOptions()}
                                </ChipDownContainer>
                            </ChipdownItem>
                        }
                        <Button
                            type="flat"
                            isDisabled={this.isClearAllDisabled()}
                            onClick={this.onClearAll}
                        >
                            {i18n("forms.buttons.clearall.text")}
                        </Button>
                    </Section>
                </SectionContainer>
                <Container>
                    <SearchContainer>
                        <SearchInput
                            defaultValue={this.props.searchTerm}
                            debounce={400}
                            onChange={this.onSearch}
                            placeholder={i18n("forms.search.placeholder")}
                        />
                        <Right>
                            <FlexRow>
                                <DownloadExcelContainer {...excelLinkHref}>
                                    <DownloadButtonMenu
                                        Excel={true}
                                        downloadUrl={excelDownloadUrl}
                                        exportFunction={this.trackExcelDownload}
                                        excelLocked={!this.props.downloadExcelPermitted}
                                    />
                                </DownloadExcelContainer>
                                <div>
                                    <ColumnsPickerLite {...this.getColumnsPickerLiteProps()} />
                                </div>
                                <div>
                                    <AddToDashboardButton onClick={this.a2d} />
                                </div>
                            </FlexRow>
                        </Right>
                    </SearchContainer>
                </Container>
            </div>
        );
    }

    private getColumnsPickerLiteProps = (): IColumnsPickerLiteProps => {
        const columns = this.props.tableColumns.reduce((res, col, index) => {
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
            onColumnToggle: this.onColumnToggle,
            onPickerToggle: () => null,
            maxHeight: 264,
            width: "auto",
        };
    };

    private onColumnToggle = (key) => {
        this.props.onClickToggleColumns(parseInt(key));
    };

    private convertCategory = ({ Count, Name, Sons = [], id }, parentId = null) => {
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
    private getCategoriesOptions = () => {
        const categories = utils.manipulateCategories(this.props.allCategories);
        const items = categories.reduce((result, category) => {
            if (category.Sons.length > 0) {
                return [
                    ...result,
                    this.convertCategory(category),
                    ...category.Sons.map((son) => this.convertCategory(son, category.id)),
                ];
            } else {
                return [...result, this.convertCategory(category)];
            }
        }, []);

        return items.map((item, index) => {
            return (
                <CategoryItemContainer
                    {...item}
                    key={index}
                    selected={
                        item.forApi ===
                        (this.props.selectedCategory && this.props.selectedCategory.id)
                    }
                />
            );
        });
    };

    private onSearch = (search) => {
        const filters = buildFiltersForTable({
            search: search,
            category: this.props.selectedCategory?.id ?? "",
        });
        this.props.onFilterChange(filters, false);
        this.swNavigator.applyUpdateParams(
            {
                search: search || null,
            },
            { notify: false },
        );
    };

    private onSelectCategory = (category) => {
        const value = category
            ? category.forApi.replace("~", " > ").replace("_", " ")
            : "Clear Filter";
        allTrackers.trackEvent("Drop Down", "click", `Table/Category/${value}`);

        const filters = buildFiltersForTable({
            search: this.props.searchTerm,
            category: category?.forApi ?? "",
        });

        this.props.onFilterChange(filters, false);

        this.swNavigator.applyUpdateParams({
            category: category?.forApi || "no-category",
        });
    };

    private onClearCategory = () => {
        this.onSelectCategory(null);
    };

    private isClearAllDisabled = () => {
        // button is disabled unless one of the filters has selected value
        return !this.props.selectedCategory;
    };

    private onClearAll = () => {
        this.onSelectCategory(null);
        allTrackers.trackEvent("Button", "click", "Table/Clear all");
    };

    private trackExcelDownload = () => {
        allTrackers.trackEvent("Download", "submit-ok", "Table/Excel");
    };

    private a2d = () => {
        const { webSource, filter } = this.props.filtersStateObject;

        this.addToDashboardModal = addToDashboard({
            modelType: "fromWebsite",
            metric: "TopReferrals",
            type: "TopReferralsDashboardTable",
            webSource: webSource,
            filters: { filter: this.convertFiltersToDashboard(filter) },
        });
    };

    private convertFiltersToDashboard = (filter = "") => {
        return filter.replace("Category;", "category;");
    };
}
