import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledMoreBlock = styled.div`
    ${mixins.setFont({ $weight: 500, $color: colorsPalettes.carbon["400"], $size: 14 })};
    align-items: center;
    display: flex;
    flex-shrink: 0;
    padding: 0 32px 0 8px;
`;

export const StyledCountryText = styled.span`
    ${mixins.setFont({ $color: colorsPalettes.carbon["400"], $size: 14 })};
    margin-left: 8px;
`;

export const StyledCountry = styled.div`
    align-items: center;
    display: flex;

    &:not(:last-child) {
        margin-right: 24px;
    }
`;

export const StyledCountriesContainer = styled.div`
    align-items: center;
    display: flex;
`;

export const StyledPrefix = styled.span`
    ${mixins.setFont({ $weight: 500, $color: colorsPalettes.carbon["400"], $size: 14 })};
    flex-shrink: 0;
    margin-right: 16px;
    text-transform: capitalize;
`;

export const StyledLeftSection = styled.div`
    align-items: center;
    display: flex;
`;

export const StyledSimilarSitesPanelCountries = styled.div`
    background-color: ${colorsPalettes.carbon["50"]};
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    margin: 19px 24px 0;
    padding: 12px 24px;
`;
