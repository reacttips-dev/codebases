import { StyledBox } from "Arena/StyledComponents";
import { CountryFilter } from "components/filters-bar/country-filter/CountryFilter";
import { sfConvertPageContext } from "pages/website-analysis/sfconvert/SfConvertPage";
import React, { useContext } from "react";
import styled from "styled-components";

const Wrapper = styled(StyledBox)`
    min-height: initial;
    box-sizing: border-box;
    margin: 12px 0 0 0;
    border: 1px solid #e5e7ea;
    display: flex;
    flex-direction: column;
    position: relative;
    box-shadow: none;

    .DropdownButton--filtersBarDropdownButton {
        &:hover {
            box-shadow: 0 3px 5px 0 rgba(42, 62, 82, 0.12);
            border: 1px solid #{map-get($color_palette_carbon, 100)};
            background: transparent;
        }
    }
`;

export const SfCountryFilter = ({ onChange }) => {
    const sfConvertPageState = useContext(sfConvertPageContext);
    const { country, countries } = sfConvertPageState;
    return (
        <Wrapper>
            <CountryFilter
                dropdownPopupWidth={"94%"}
                dropdownPopupPlacement="ontop-left"
                height={40}
                width={"100%"}
                changeCountry={onChange}
                availableCountries={countries}
                selectedCountryIds={Object.assign({ [country]: true }, {})}
            />
        </Wrapper>
    );
};
