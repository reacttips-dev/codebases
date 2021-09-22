import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import styled from "styled-components";

export const CountryFilterStyledWrapper = styled.div`
    display: flex;
    width: 100%;
    .CountryFilter-dropdownButton {
        display: flex;
        align-items: center;
        ${setFont({ $size: 14, weight: 400 })};
        box-sizing: border-box;
        min-width: 0;
    }

    .CountryFilter-dropdownButton-icon {
        min-width: 22px;
        height: 22px;
        margin-right: 8px;
    }

    .CountryFilter-dropdownButton-text {
        text-overflow: ellipsis;
        overflow: hidden;
        text-indent: 0;
    }

    .CountryDropdownItem {
        &.DropdownItem {
            border-radius: 0;
        }
        .DropdownItem-iconContainer {
            padding: 0 0 0 16px;
        }
        .DropdownItem-countryFlag {
            width: 22px;
            height: 22px;
        }
    }

    .CountryFilterCompact {
        .DropdownContent-search {
            padding-left: 42px;
            height: 30px;
        }
        &.DropdownContent-searchContainer {
            margin: 9px 0 0 0;
        }
    }

    .CountryFilterCompactItem {
        a,
        a:hover,
        a:focus {
            // bootstrap override :(((
            text-decoration: none;
        }
        .CountryDropdownItem {
            .DropdownItem-text {
                max-width: 175px;
            }
            .DropdownItem-iconContainer {
                padding: 0 0 0 47px;
            }
        }
    }
`;

export const StyledAllCountriesItem = styled.div`
    height: 48px;
    line-height: 48px;
    padding: 0 8px;
`;

export const StyledAllCountriesInfoIcon = styled.div`
    margin-left: 5px;
    margin-top: 3px;
`;
