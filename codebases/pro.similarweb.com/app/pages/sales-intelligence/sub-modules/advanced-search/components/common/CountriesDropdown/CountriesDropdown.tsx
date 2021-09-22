import React from "react";
import {
    Dropdown,
    IDropDownItem,
    DropdownButton,
    MultiSelectCountryDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import { ICountryObject } from "services/CountryService";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { StyledBaseDropdownButtonWrap, StyledDropdownContainer } from "../../styles";

type CountriesDropdownProps = {
    appendTo?: string;
    placeholder: string;
    items: readonly IDropDownItem[];
    dropdownPopupHeight?: number;
    dropdownPopupPlacement?: string;
    selectedItems: readonly IDropDownItem["id"][];
    onSelect(country: ICountryObject): void;
    renderButton?(): React.ReactNode;
};

const CountriesDropdown = (props: CountriesDropdownProps) => {
    const translate = useTranslation();
    const {
        items,
        selectedItems,
        placeholder,
        onSelect,
        renderButton,
        appendTo,
        dropdownPopupHeight,
        dropdownPopupPlacement,
    } = props;
    const selectedIds = selectedItems.reduce((map, id) => {
        map[id] = true;
        return map;
    }, {});

    const handleSearch = (term: string, item: JSX.Element) => {
        return (item.props as IDropDownItem).text.toLowerCase().includes(term.toLowerCase());
    };

    const renderDDButton = () => {
        if (typeof renderButton === "function") {
            return renderButton();
        }

        return (
            <StyledBaseDropdownButtonWrap key="countries-dropdown-button">
                <DropdownButton>
                    {translate("si.components.countries_dd.button.text")}
                </DropdownButton>
            </StyledBaseDropdownButtonWrap>
        );
    };

    return (
        <StyledDropdownContainer>
            <Dropdown
                hasSearch
                onClick={onSelect}
                appendTo={appendTo}
                closeOnItemClick={false}
                selectedIds={selectedIds}
                searchFilter={handleSearch}
                virtualize={items.length > 10}
                searchPlaceholder={placeholder}
                dropdownPopupHeight={dropdownPopupHeight}
                dropdownPopupPlacement={dropdownPopupPlacement}
            >
                {[renderDDButton()].concat(
                    items.map((item) => <MultiSelectCountryDropdownItem key={item.id} {...item} />),
                )}
            </Dropdown>
        </StyledDropdownContainer>
    );
};

export default CountriesDropdown;
