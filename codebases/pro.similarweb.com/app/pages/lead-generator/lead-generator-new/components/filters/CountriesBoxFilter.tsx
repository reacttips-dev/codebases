import { CountryChipItem } from "@similarweb/ui-components/dist/chip";
import { MultiSelectCountryDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import React from "react";
import LeadGeneratorChips from "../../../components/LeadGeneratorChips";
import LeadGeneratorUtils from "../../../LeadGeneratorUtils";

function getDropDownProps() {
    return {
        shouldScrollToSelected: false,
        itemsComponent: MultiSelectCountryDropdownItem,
    };
}

export default function CountriesBoxFilter(props) {
    const { isFullCountryList } = props;
    let items = [];

    if (isFullCountryList) {
        items = LeadGeneratorUtils.getCompanyInformationCountries();
    } else {
        const desktopCountries = LeadGeneratorUtils.getComponentDesktopOnlyCountries();
        items = LeadGeneratorUtils.getComponentCountries().map((country) => ({
            ...country,
            showDeviceIcon: true,
            mobileWeb: !desktopCountries.find((desktop) => desktop.id === country.id),
        }));
    }

    return (
        <LeadGeneratorChips
            {...props}
            type={props.componentType}
            items={items}
            getDropDownProps={getDropDownProps}
            ChipsComponent={CountryChipItem}
        />
    );
}
