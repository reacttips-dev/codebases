import PropTypes from "prop-types";
import { CountryDropdown, ICountryItem } from "./CountryDropdown";
import React, { StatelessComponent } from "react";

interface ICountryPickerProps {
    placeHolder?: boolean | ICountryItem;
    selectedCountryId?: number;
    countries: ICountryItem[];
    onSelect(item: ICountryItem): void;
    onToggle?(isOpen: boolean): void;
    disabled?: boolean;
}

export const CountryPicker: StatelessComponent<ICountryPickerProps> = (props) => (
    <CountryDropdown {...props} />
);

const defaultPlaceHolder = {
    id: 0,
    text: "Select a Country",
    isCustomCountry: false,
    isChild: false,
};

CountryPicker.propTypes = {
    countries: PropTypes.array.isRequired,
    onSelect: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    onToggle: PropTypes.func,
    placeHolder: PropTypes.oneOfType([PropTypes.bool, PropTypes.any]),
    selectedCountryId: PropTypes.number,
};

CountryPicker.defaultProps = {
    placeHolder: defaultPlaceHolder,
    selectedCountryId: defaultPlaceHolder.id,
};
