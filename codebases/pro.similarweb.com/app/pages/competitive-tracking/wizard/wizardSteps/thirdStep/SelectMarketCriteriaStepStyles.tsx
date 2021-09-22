import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";

export const InputSectionContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 40px;
`;

export const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    margin-bottom: 30px;
    width: 520px;
`;

export const InputLabel = styled.span`
    font-size: 12px;
    color: ${colorsPalettes.carbon[400]};
    margin-bottom: 4px;
`;

export const CountriesAutocompleteContainer = styled.div`
    height: 40px;
    border: 1px ${colorsPalettes.carbon[50]} solid;
    border-radius: 3px;
    .CountryFilter-dropdownButton {
        ${setFont({ $size: 14 })};
    }

    .DropdownButton--filtersBarDropdownButton {
        border-left: none;
    }
`;
