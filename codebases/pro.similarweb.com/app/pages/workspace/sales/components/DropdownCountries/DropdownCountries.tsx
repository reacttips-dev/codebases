import React from "react";
import { StyledDropdownContainer, StyledPrefix } from "./styles";
import { CountryFilter } from "components/filters-bar/country-filter/CountryFilter";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { ICountryObject } from "services/CountryService";
import { preparedCountryForDropdown } from "./helpers";
import { useSalesSettingsHelper } from "pages/sales-intelligence/services/salesSettingsHelper";

type SiteTrendsDropdownProps = {
    countryId: number;
    currentModule: string;
    onDropdownToggle?(isOpen: boolean): void;
    handleSelectCountry(country: ICountryObject): void;
};

const DropdownCountries: React.FC<SiteTrendsDropdownProps> = (props) => {
    const { currentModule, handleSelectCountry, countryId, onDropdownToggle } = props;
    const translate = useTranslation();
    const salesSettings = useSalesSettingsHelper();
    const allowedCountries = salesSettings.getAllowedCountries();
    const mobileWebCountries = salesSettings.getMobileWebCountries();
    const countries = React.useMemo(() => {
        return preparedCountryForDropdown(
            allowedCountries,
            mobileWebCountries,
            currentModule,
            translate,
        );
    }, [allowedCountries, mobileWebCountries, currentModule]);

    const [selectedCountryId, selectCountryId] = React.useState(getInitialCountryWithFallback());

    React.useEffect(() => {
        if (countryId) {
            selectCountryId(getInitialCountryWithFallback());
        }
    }, [countryId]);

    const handleCountryChange = (country) => {
        handleSelectCountry(country);
        selectCountryId(country.id);
    };

    function getInitialCountryWithFallback() {
        const countryObject = countries.find((country) => country.id === countryId);

        if (!countryObject) {
            return countries[0]?.id;
        }

        return countryId;
    }

    return (
        <StyledDropdownContainer>
            <StyledPrefix>In</StyledPrefix>
            <CountryFilter
                onToggle={onDropdownToggle}
                selectedCountryIds={{
                    [selectedCountryId]: true,
                }}
                dropdownPopupWidth={322}
                changeCountry={handleCountryChange}
                height={40}
                availableCountries={countries}
                dropdownPopupPlacement="ontop-left"
            />
        </StyledDropdownContainer>
    );
};

export default DropdownCountries;
