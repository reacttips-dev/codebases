import React from "react";
import classNames from "classnames";
import { SWReactIcons } from "@similarweb/icons";
import {
    ChipItemWrapper,
    ChipItemBasicWrapper,
    ChipItemText,
} from "@similarweb/ui-components/dist/chip/src/elements";
import {
    StyledCountryDropdownButton,
    StyledFilterWrapper,
} from "pages/workspace/sales/components/SalesTableHeader/Styled";
import { useTrack } from "components/WithTrack/src/useTrack";
import { getCountries } from "components/filters-bar/utils";
import { CountryFilter } from "components/filters-bar/country-filter/CountryFilter";
import { OpportunityListType } from "../../../../../sub-modules/opportunities/types";

type ListCountryDropdownProps = {
    list: OpportunityListType;
    onCountryChange(id: OpportunityListType["country"]): void;
};

// Copied from app/pages/workspace/sales/components/SalesTableHeader/SalesTableHeader.tsx
// TODO: Refactor if there is time for that
const ListCountryDropdown = (props: ListCountryDropdownProps) => {
    const { list, onCountryChange } = props;
    const [track] = useTrack();
    const countries = React.useMemo(() => getCountries(), []);
    const [selectedCountryId, selectCountryId] = React.useState(getInitialCountryWithFallback());
    const selectedCountryIds = React.useMemo(() => {
        return {
            [selectedCountryId]: true,
        };
    }, [selectedCountryId]);
    const handleDropdownToggle = (isOpen) => {
        track("Drop down", isOpen ? "Open" : "Close", "Header/Country Filter");
    };
    // "Any" because ICountryFilterProps is wrong
    const handleCountryChange = (country: any) => {
        track("Drop down", "Click", `Header/Country Filter/${country?.children ?? ""}`);
        selectCountryId(country.id);
        onCountryChange(country.id);
    };
    const renderCountryDropdownButton = React.useCallback(
        (selectedCountry: { id: number; text: string }) => {
            return (
                <StyledCountryDropdownButton key={selectedCountry.id}>
                    <ChipItemWrapper>
                        <i
                            className={classNames(
                                "chipsItemCountry",
                                `country-icon-${selectedCountry.id}`,
                            )}
                        />
                        <ChipItemBasicWrapper text={selectedCountry.text}>
                            <ChipItemText className="ChipItemText">
                                {selectedCountry.text}
                            </ChipItemText>
                        </ChipItemBasicWrapper>
                        <SWReactIcons iconName="arrow" />
                    </ChipItemWrapper>
                </StyledCountryDropdownButton>
            );
        },
        [],
    );

    function getInitialCountryWithFallback() {
        const countryObject = countries.find((country) => country.id === list.country);

        if (!countryObject) {
            return countries[0]?.id;
        }

        return list.country;
    }

    return (
        <StyledFilterWrapper>
            <CountryFilter
                width={215}
                height={40}
                availableCountries={countries}
                changeCountry={handleCountryChange}
                onToggle={handleDropdownToggle}
                selectedCountryIds={selectedCountryIds}
                dropdownPopupPlacement="ontop-left"
                renderButtonComponent={renderCountryDropdownButton}
            />
        </StyledFilterWrapper>
    );
};

export default ListCountryDropdown;
