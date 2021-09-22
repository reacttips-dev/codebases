import React, { StatelessComponent } from "react";
import PropTypes from "prop-types";
import {
    Dropdown,
    CountryDropdownItem,
    CountryDropdownButton,
} from "@similarweb/ui-components/dist/dropdown";
import ContactUsItemWrap from "components/React/ContactUs/ContactUsItemWrap";

export interface ICountryItem {
    isChild?: boolean;
    text: string;
    id: number;
    isCustomCountry: boolean;
}

function searchFilter(term, item) {
    return item.text.toLowerCase().includes(term.toLowerCase());
}

export const CountryDropdown: StatelessComponent<any> = ({
    placeHolder,
    selectedCountryId = 0,
    countries,
    onSelect,
    hintText,
    ...rest
}) => {
    function getFilterText(filterId, options) {
        const chosenFilter = options.find((item) => item.id == filterId);
        return chosenFilter ? chosenFilter.text : hintText || "";
    }

    const items = placeHolder ? [placeHolder, ...countries] : countries;
    return (
        <Dropdown
            shouldScrollToSelected={true}
            hasSearch={true}
            selectedIds={{ [selectedCountryId]: true }}
            searchFilter={searchFilter}
            itemsComponent={CountryDropdownItem}
            onClick={onSelect}
            itemWrapper={ContactUsItemWrap}
            {...rest}
        >
            {[
                <CountryDropdownButton key="CountryButton1" countryId={selectedCountryId}>
                    {getFilterText(selectedCountryId, items)}
                </CountryDropdownButton>,
                ...items,
            ]}
        </Dropdown>
    );
};

CountryDropdown.propTypes = {
    selectedCountryId: PropTypes.number,
    countries: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    searchFilter: PropTypes.func,
};
CountryDropdown.defaultProps = {
    buttonWidth: 196,
    dropdownPopupMinScrollHeight: 60,
    dropdownPopupHeight: 180,
    searchFilter,
};
