import { i18nFilter } from "filters/ngFilters";
import React, { FC } from "react";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import LeadGeneratorUtils from "../../../LeadGeneratorUtils";
import { DefaultSummary } from "../summary/DefaultSummary";
import CategoriesBoxFilter from "./CategoriesBoxFilter";
import CountriesBoxFilter from "./CountriesBoxFilter";
import { IChipsFilterProps } from "./types";

function getCountriesAllItems(isFullCountryList) {
    if (isFullCountryList) {
        return LeadGeneratorUtils.getCompanyInformationCountries();
    } else {
        const countries = LeadGeneratorUtils.getComponentCountries();
        const desktopCountries = LeadGeneratorUtils.getComponentDesktopOnlyCountries();
        const desktopOnlySuffix = i18nFilter()(
            "grow.lead_generator.wizard.countries.desktop_only_suffix",
        );
        return countries.map((country) => ({
            ...country,
            text: desktopCountries.find((desktop) => desktop.id === country.id)
                ? `${country.text} ${desktopOnlySuffix}`
                : country.text,
        }));
    }
}

export function getChipsSummaryDescription(crrVal) {
    if (!crrVal.length) {
        return "-";
    } else if (crrVal.length > 5) {
        return (
            crrVal
                .slice(0, 5)
                .map((item) => item.text || item)
                .join(", ") +
            " " +
            i18nFilter()("grow.lead_generator.new.chip_filter.more", {
                number: (crrVal.length - 5).toString(),
            })
        );
    }
    return crrVal.map((item) => item.text || item).join(", ");
}

export const ChipsSummaryFilter = ({ filter, filters }) => {
    let allItems;
    let crrVal;
    switch (filter.type) {
        case "countries":
            allItems = getCountriesAllItems(false);
            crrVal = getClientValueChips(filter.getValue(), allItems);
            return (
                <DefaultSummary
                    title={filter.title}
                    description={getChipsSummaryDescription(crrVal)}
                />
            );
        case "company_country_code_list":
            let title = filter.title;

            allItems = getCountriesAllItems(true);
            crrVal = getClientValueChips(filter.getValue(), allItems);
            const companyCountryCodeFunctionality = filters.find(
                (crr) => crr.stateName === "company_country_code_functionality",
            );

            if (companyCountryCodeFunctionality) {
                const FLAG_INCLUDE = "include_only";

                title =
                    FLAG_INCLUDE === companyCountryCodeFunctionality.getValue().inclusion
                        ? i18nFilter()("grow.lead_generator.new.company.headquarters.summary.title")
                        : i18nFilter()(
                              "grow.lead_generator.new.company.headquarters.summary.title.exclude",
                          );
            }

            return (
                <DefaultSummary title={title} description={getChipsSummaryDescription(crrVal)} />
            );
        case "categories":
            // Not rendering anything if no categories selected
            if (filter.getValue().length === 0) {
                return null;
            }

            allItems = LeadGeneratorUtils.getComponentCategories();
            crrVal = getClientValueChips(filter.getValue(), allItems);
            return (
                <DefaultSummary
                    title={filter.title}
                    description={getChipsSummaryDescription(crrVal)}
                />
            );
    }
};

export function getClientValueChips(crrValue, allItems) {
    return crrValue.map((val) =>
        allItems.find((item) => {
            if (typeof item.id === "number") {
                return val === item.id;
            }
            if (val === "ALL") {
                return "All" === item.id;
            }
            return val.replace("/", "~") === item.id;
        }),
    );
}

export const ChipsBoxFilter: FC<IChipsFilterProps> = ({ filters, filter, setBoxActive }) => {
    let DropDownComponent;
    let allItems;
    let onChange;
    let componentType;
    let placeholderKey;
    let isFullCountryList = false;

    const { placeholder, type, getValue, setValue } = filter;
    const desktopCountries = LeadGeneratorUtils.getComponentDesktopOnlyCountries();

    const setCountriesServerValue = (value, item) => {
        const isDesktop = value.find((item) =>
            desktopCountries.find((desktop) => desktop.id === item.id),
        );
        const newValue = {
            [filter.stateName]: value.map((item) => item.id),
            device: isDesktop ? "Desktop" : "Total",
        };
        if (isDesktop) {
            newValue.mobileweb_visits_share = "0...1";
        }
        setValue(newValue);
        setBoxActive(true);
    };

    const setCategoriesServerValue = (value) => {
        setValue({
            [filter.stateName]: value.map((item) => item.id),
        });
        setBoxActive(true);
    };

    switch (type) {
        case "countries":
            DropDownComponent = CountriesBoxFilter;
            allItems = getCountriesAllItems(false);
            onChange = setCountriesServerValue;
            componentType = "Countries";
            placeholderKey = "countries";
            isFullCountryList = false;
            break;
        case "company_country_code_list":
            DropDownComponent = CountriesBoxFilter;
            allItems = getCountriesAllItems(true);
            onChange = setCountriesServerValue;
            componentType = "Company Headquarters";
            placeholderKey = "company.headquarters";
            isFullCountryList = true;
            break;
        case "categories":
            DropDownComponent = CategoriesBoxFilter;
            allItems = LeadGeneratorUtils.getComponentCategories();
            onChange = setCategoriesServerValue;
            componentType = "Categories";
            placeholderKey = "categories";
            isFullCountryList = false;
            break;
    }

    const getClientValue = () => {
        return getClientValueChips(getValue()[0] === "All" ? [] : getValue(), allItems);
    };

    return (
        <DropDownComponent
            value={getClientValue()}
            onChange={onChange}
            isFullCountryList={isFullCountryList}
            componentType={componentType}
            placeholderKey={placeholderKey}
            placeholder={i18nFilter()(placeholder)}
        />
    );
};
