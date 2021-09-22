import styled from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { Dropdown } from "@similarweb/ui-components/dist/dropdown";

export const StyledChipDownSelectWrapper = styled.div`
    color: ${colorsPalettes.carbon[500]};
    display: flex;
    align-items: center;

    & .benchmark-mode-wrapper {
        width: 180px;
        & span {
            background-color: transparent;
            cursor: pointer;
            font-family: Roboto;
            font-style: normal;
            font-weight: normal;
            line-height: 24px;
            color: ${colorsPalettes.carbon[500]};
        }

        & span.ChipItemText {
            font-size: 16px;
        }

        & div[data-automation-icon-name="clear-circle"] {
            display: none;
        }
    }
`;

export const StyledIcon = styled(SWReactIcons)`
    display: flex;
    align-items: center;
    cursor: pointer;
`;

export const StyledDropdownsContainer = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
    width: 100%;
`;

export const StyledDropdown = styled(Dropdown)`
    color: #3a5166;
    border: none;
    background: transparent;
    width: 153px;
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    line-height: 24px;
`;

export const StyledSingleSelectDropdown = styled.div`
    margin-left: 10px;

    & .DropdownButton-text {
        margin-right: 30px;
    }
    & .DropdownButton--triangle {
        color: ${colorsPalettes.carbon["500"]} !important;
    }
`;
