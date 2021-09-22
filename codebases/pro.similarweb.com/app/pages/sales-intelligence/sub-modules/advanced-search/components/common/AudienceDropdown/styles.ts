import styled from "styled-components";
import { CheckboxIcon } from "@similarweb/ui-components/dist/dropdown";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";

export const StyledCheckboxContainer = styled.div`
    align-items: center;
    display: flex;
    flex-shrink: 0;
    margin-left: 5px;

    ${CheckboxIcon} {
        margin-left: 8px;
    }
`;

export const StyledItemText = styled.span`
    ${mixins.setFont({ $size: 14, $color: colorsPalettes.carbon["500"] })};
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const StyledDropdownItem = styled.div`
    align-items: center;
    background-color: ${colorsPalettes.carbon["0"]};
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    padding: 12px 20px 12px 16px;

    &:hover {
        background-color: ${rgba(colorsPalettes.carbon["500"], 0.05)};
    }
`;
