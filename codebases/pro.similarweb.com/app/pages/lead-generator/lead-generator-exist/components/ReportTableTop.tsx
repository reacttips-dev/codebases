import * as React from "react";
import { Component } from "react";
import { TableSearch } from "../../../../components/React/Table/TableSearch/TableSearch";
import {
    ReportTableTopWrapper,
    FirstLine,
    SecondLine,
    ReportTableFilters,
    ReportTableSettings,
    LeadGeneratorDownloadIcon,
} from "./elements";
import { i18nFilter } from "filters/ngFilters";
import LeadGeneratorTooltip from "../../components/LeadGeneratorTooltip";
import { CategoryPicker } from "../../../../components/React/CategoriesDropdown";
import { CountryPicker } from "../../../../components/React/CountriesDropdown/CountryPicker";
import { allTrackers } from "services/track/track";
import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import { IconButton } from "@similarweb/ui-components/dist/button";
import I18n from "../../../../components/React/Filters/I18n";
import { ColumnsPickerModal } from "../../../../components/React/ColumnsPickerModal/ColumnsPickerModal";

interface IReportTableTopProps {
    onFilterChange: (any, boolean) => void;
    onClickToggleColumns: (any) => void;
    filtersStateObject: any;
    tableColumns: any[];
    tableToggleGroups: any;
    categoriesOptions: any[];
    countriesOptions: any[];
    excelApi: string;
    sort: string;
    asc: boolean;
    isFirstRun: boolean;
}

interface IReportTableTopState {
    isColumnsPickerOpen: boolean;
}

class ReportTableTop extends Component<IReportTableTopProps, IReportTableTopState> {
    constructor(props) {
        super(props);

        this.state = {
            isColumnsPickerOpen: false,
        };
    }

    private onSearch = (search) => {
        this.props.onFilterChange({ search }, true);
        allTrackers.trackEvent("Search Bar", "click", `Table/${search}`);
    };

    private onToggleCountry = (isOpen) => {
        const state = isOpen ? "open" : "close";
        allTrackers.trackEvent("Drop down", state, "Table/country list");
    };

    private onSelectCountry = (country) => {
        let countryId = country.id;
        if (parseInt(countryId) === 0) {
            countryId = null;
        }
        this.props.onFilterChange({ country: countryId }, true);
        allTrackers.trackEvent("Drop down", "click", `Table/country list/${country.text}`);
    };

    private onToggleCategory = (isOpen) => {
        const state = isOpen ? "open" : "close";
        allTrackers.trackEvent("Drop down", state, "Table/category list");
    };

    private onSelectCategory = (category) => {
        let categoryId = category.id;
        if (categoryId === "no-category") {
            categoryId = null;
        }
        this.props.onFilterChange({ category: categoryId }, true);
        allTrackers.trackEvent("Drop down", "click", `Table/category list/${category.text}`);
    };

    private onClickCheckbox = (item) => {
        let clicked = !this.props.filtersStateObject[item];
        if (!clicked) {
            clicked = null;
        }
        this.props.onFilterChange({ [item]: clicked }, true);
        allTrackers.trackEvent("Checkbox", "click", `Table/new/${clicked}`);
    };

    private onDownloadExcel = () => {
        allTrackers.trackEvent("Download", "submit-ok", "Table/Excel");
    };

    private getExcelLink() {
        let params = "";
        Object.entries(this.props.filtersStateObject).forEach(([key, value]) => {
            if (!!value) {
                params += params.length > 0 ? `&${key}=${value}` : `?${key}=${value}`;
            }
        });
        return `${this.props.excelApi}${params}`;
    }

    private onCancelColumnsPicker = () => {
        this.setState({ isColumnsPickerOpen: false });
        allTrackers.trackEvent("Drop down", "close", "lead generation reports/edit_columns");
    };

    private onApplyColumnsPicker = (groupsColumns) => {
        this.setState({ isColumnsPickerOpen: false });
        this.props.onClickToggleColumns(groupsColumns.map((column) => column.visible));
    };

    private openColumnPicker = () => {
        this.setState({ isColumnsPickerOpen: true });
        allTrackers.trackEvent("Drop down", "open", "lead generation reports/edit_columns");
    };

    render() {
        return (
            <ReportTableTopWrapper>
                <FirstLine>
                    <ReportTableFilters>
                        <TableSearch
                            inputText={this.props.filtersStateObject.search}
                            onSearch={this.onSearch}
                        />
                        <CountryPicker
                            selectedCountryId={this.props.filtersStateObject.country}
                            onSelect={this.onSelectCountry}
                            countries={this.props.countriesOptions}
                            onToggle={this.onToggleCountry}
                        />
                        <CategoryPicker
                            selectedCategoryId={this.props.filtersStateObject.category}
                            onSelect={this.onSelectCategory}
                            categories={this.props.categoriesOptions}
                            onToggle={this.onToggleCategory}
                        />
                    </ReportTableFilters>
                    <ReportTableSettings style={{ display: "flex" }}>
                        <LeadGeneratorTooltip
                            text={i18nFilter()("grow.lead_generator.exist.table.download_excel")}
                        >
                            <a
                                href={this.getExcelLink()}
                                style={{ textDecoration: "none" }}
                                onClick={this.onDownloadExcel}
                            >
                                <LeadGeneratorDownloadIcon />
                            </a>
                        </LeadGeneratorTooltip>
                        <LeadGeneratorTooltip
                            text={i18nFilter()("grow.lead_generator.exist.table.columns_settings")}
                        >
                            <IconButton
                                iconName="columns"
                                type="flat"
                                onClick={this.openColumnPicker}
                            />
                        </LeadGeneratorTooltip>
                    </ReportTableSettings>
                </FirstLine>
                <hr />
                <SecondLine>
                    <b>
                        <I18n>grow.lead_generator.exist.table.show_only</I18n>
                    </b>
                    <LeadGeneratorTooltip
                        text={i18nFilter()("grow.lead_generator.exist.table.show_only.new.tooltip")}
                    >
                        <Checkbox
                            label={i18nFilter()("grow.lead_generator.exist.table.show_only.new")}
                            onClick={() => this.onClickCheckbox("isNew")}
                            selected={this.props.filtersStateObject.isNew}
                            isDisabled={this.props.isFirstRun}
                        />
                    </LeadGeneratorTooltip>
                    <LeadGeneratorTooltip
                        text={i18nFilter()(
                            "grow.lead_generator.exist.table.show_only.returning.tooltip",
                        )}
                    >
                        <Checkbox
                            label={i18nFilter()(
                                "grow.lead_generator.exist.table.show_only.returning",
                            )}
                            onClick={() => this.onClickCheckbox("isReturning")}
                            selected={this.props.filtersStateObject.isReturning}
                            isDisabled={this.props.isFirstRun}
                        />
                    </LeadGeneratorTooltip>
                </SecondLine>
                <ColumnsPickerModal
                    isOpen={this.state.isColumnsPickerOpen}
                    onCancelClick={this.onCancelColumnsPicker}
                    onApplyClick={this.onApplyColumnsPicker}
                    groupsData={this.props.tableToggleGroups}
                    columnsData={this.props.tableColumns}
                />
            </ReportTableTopWrapper>
        );
    }
}

export default ReportTableTop;
