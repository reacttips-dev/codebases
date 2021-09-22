import * as React from "react";
import { FC } from "react";
import { StatefulDropdown } from "components/dashboard/widget-wizard/components/StatefulDropdown";
import I18n from "components/React/Filters/I18n";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { i18nFilter } from "filters/ngFilters";
import { getWebsiteTypeOptions } from "pages/website-analysis/keyword-competitors/filters/WebsiteTypeFilter";
import { Widget } from "components/widget/widget-types/Widget";
import { CheckboxFilter } from "pages/website-analysis/traffic-sources/search/components/filters/CheckboxFilter";

type SearchTypeId = "IsRelatedQuestions" | "IsNews" | "IsPpc" | "IsPla" | null;

export const searchTypeIds: SearchTypeId[] = ["IsNews", "IsRelatedQuestions", "IsPla", "IsPpc"];

const initialFilterObject = {
    domain: "",
    SiteFunctionality: "",
    searchType: "",
    isrise: false,
    isnew: false,
};

type FilterObject = typeof initialFilterObject;

export const parseFilters = (filters: Record<string, { operator: string; value: string }>) =>
    Object.entries(filters).reduce((acc, [filterName, { value }]: [string, any]) => {
        if (searchTypeIds.some((type) => type === filterName)) {
            // normalize filterName and value to FilterObject type
            value = filterName;
            filterName = "searchType";
        } else {
            // Parse value to remove "" characters around the string value
            value = JSON.parse(value);
        }
        return {
            ...acc,
            [filterName]: value,
        };
    }, {} as FilterObject);

const SearchCompetitorsWidgetFilters: FC<any> = (props) => {
    const i18n = i18nFilter();
    const selectedFilters = { filter: "" };
    const websiteTypeOptions = React.useMemo(
        () =>
            [
                // Add default empty value to dropdown
                { id: null, text: "topsites.table.site.functionality.filter.all.website.types" },
                ...getWebsiteTypeOptions(),
            ].map((item) => ({ ...item, text: i18n(item.text) })),
        [],
    );
    const searchTypeOptions = React.useMemo(
        () => props.searchTypes.map((item) => ({ ...item, text: i18n(item.text) })),
        [],
    );

    const filterObject: FilterObject = React.useMemo(() => {
        selectedFilters.filter = props.widgetFilters.filter;
        const parsedFilterResult = Widget.filterParse(props.widgetFilters.filter);
        const parsedFilterData = parseFilters(parsedFilterResult);
        return parsedFilterData;
    }, [props.widgetFilters.filter]);

    const onFilterChange = (filterName: keyof FilterObject, value: string | boolean) => {
        const newData = { ...filterObject, [filterName]: value };

        const filterList = [];
        if (newData.SiteFunctionality?.length) {
            filterList.push(`SiteFunctionality;==;"${newData.SiteFunctionality}"`);
        }
        if (newData.searchType?.length && (value as string).length) {
            filterList.push(`${newData.searchType};==;true`);
        }
        if (newData.domain?.length) {
            filterList.push(`domain;contains;"${newData.domain}"`);
        }
        if (newData.isrise) {
            filterList.push(`isrise;==;${newData.isrise}`);
        }
        if (newData.isnew) {
            filterList.push(`isnew;==;${newData.isnew}`);
        }

        selectedFilters.filter = filterList.join(",");
        props.changeFilter(getSelectedFilters());
    };

    const getSelectedFilters = () => {
        const filters = [];
        // eslint-disable-next-line prefer-const
        for (let filter in selectedFilters) {
            filters.push({ name: filter, value: selectedFilters[filter] });
        }
        return filters;
    };

    return (
        <div key="dynamicFiltersContainer" className="filters">
            <div key="websiteType" className="dynamicFilter">
                <h5>
                    <I18n>{`home.dashboards.wizard.filters.WebsiteType`}</I18n>
                </h5>
                <StatefulDropdown
                    key="websiteTypeFilter"
                    items={websiteTypeOptions}
                    selectedId={filterObject.SiteFunctionality || null}
                    onSelect={({ id }) => onFilterChange("SiteFunctionality", id)}
                />
            </div>
            <div key="searchtype" className="dynamicFilter">
                <h5>
                    <I18n>{`analysis.competitors.search.organic.table.filters.searchtype`}</I18n>
                </h5>
                <StatefulDropdown
                    key="searchTypesFilter"
                    items={searchTypeOptions}
                    selectedId={filterObject.searchType || null}
                    onSelect={({ id }) => onFilterChange("searchType", id)}
                />
            </div>
            <div key="searchTerm" className="filters" style={{ flexDirection: "column" }}>
                <h5>
                    <I18n>{`home.dashboards.wizard.filters.searchterm`}</I18n>
                </h5>
                <SearchInput
                    defaultValue={filterObject.domain}
                    debounce={400}
                    onChange={(value) => onFilterChange("domain", value)}
                    placeholder={i18n("forms.search.placeholder")}
                />
            </div>
            <div key="isrise" className="dynamicFilter" style={{ margin: "8px 0" }}>
                <CheckboxFilter
                    isSelected={filterObject.isrise}
                    isDisabled={filterObject.isnew}
                    onChange={() => onFilterChange("isrise", !filterObject.isrise)}
                    text={i18nFilter()(
                        "analysis.competitors.search.organic.filter.risingcompetitors",
                    )}
                    tooltip={i18nFilter()(
                        "analysis.competitors.search.organic.filter.risingcompetitors.tooltip",
                    )}
                />
            </div>
            <div key="newCompetitors" className="dynamicFilter" style={{ margin: "8px 0" }}>
                <CheckboxFilter
                    isSelected={filterObject.isnew}
                    isDisabled={filterObject.isrise}
                    onChange={() => onFilterChange("isnew", !filterObject.isnew)}
                    text={i18nFilter()("analysis.competitors.search.organic.filter.newcompetitors")}
                    tooltip={i18nFilter()(
                        "analysis.competitors.search.organic.filter.newcompetitors.tooltip",
                    )}
                />
            </div>
        </div>
    );
};

export default SearchCompetitorsWidgetFilters;
