import { CountryDropdown } from "components/React/CountriesDropdown/CountryDropdown";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { FC } from "react";
import { allTrackers } from "services/track/track";
import LeadGeneratorUtils from "../../../LeadGeneratorUtils";
import { DefaultSummary } from "../summary/DefaultSummary";
import { IBoxFilterProps } from "./types";

export function getCountrySubtitle(serverValue, title) {
    const allItems = LeadGeneratorUtils.getCompanyInformationCountries();
    return i18nFilter()(title, {
        name: allItems.find((item) => serverValue === item.id).text,
    });
}

export function getCountryListSubtitle(list, allItems) {
    return list.map((listItem) => allItems.find((item) => listItem === item.id).text).join(", ");
}

function getUIValue(filter, filters) {
    const stateFilter = filters.find((crr) => crr.stateName.includes("state"));
    return stateFilter && stateFilter.getValue() !== stateFilter.initValue
        ? stateFilter.getValue()
        : filter.getValue();
}

export const CountrySummaryFilter: FC<IBoxFilterProps> = ({ filter, filters }) => {
    const crrValue = getUIValue(filter, filters);
    const allItems = LeadGeneratorUtils.getCompanyInformationCountries();
    const crrItem = allItems.find((item) => crrValue === item.id);
    const description = crrItem.text;

    return <DefaultSummary title={filter.title} description={description} />;
};

export const CountryBoxFilter: FC<IBoxFilterProps> = ({ filter, filters, setBoxActive }) => {
    const setServerValue = (value) => {
        if (value.parent) {
            filter.setValue({
                [filter.stateName]: value.parent,
                [filter.stateName.replace("country", "state")]: value.id,
            });
        } else {
            filter.setValue({
                [filter.stateName]: value.id,
                [filter.stateName.replace("country", "state")]: filter.initValue,
            });
        }
        setBoxActive(true);
        allTrackers.trackEvent("Drop down", "click", `countries list/${value.text}`);
        allTrackers.trackEvent("Drop down", "click", `Headquarters country/${value.text}`);
    };

    const getClientValue = () => {
        return getUIValue(filter, filters);
    };

    return (
        <CountryDropdown
            selectedCountryId={getClientValue()}
            onSelect={setServerValue}
            countries={LeadGeneratorUtils.getCompanyInformationCountries()}
            hintText={i18nFilter()(
                "grow.lead_generator.new.company_information.country.placeholder",
            )}
            searchFilter={(term, item) => item.text.toLowerCase().includes(term.toLowerCase())}
            buttonWidth="100%"
            dropdownPopupHeight={240}
        />
    );
};
