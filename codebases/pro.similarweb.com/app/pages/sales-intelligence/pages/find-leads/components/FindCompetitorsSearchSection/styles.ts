import styled from "styled-components";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";

export const StyledTrafficDropdownButton = styled.div`
    width: 188px;

    .DropdownButton {
        background-color: ${colorsPalettes.carbon["0"]};
        border: 1px solid #e9ebed;
        height: 40px;
        ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 14 })};
    }

    .DropdownButton--triangle {
        color: ${colorsPalettes.carbon["200"]};
    }
`;

export const StyledTrafficDropdownContainer = styled.div`
    flex-shrink: 0;
    margin-left: 16px;
    width: 188px;
`;

export const StyledAutocompleteContainer = styled.div`
    flex-grow: 1;
`;

export const StyledDropdownsContainer = styled.div`
    align-items: center;
    display: flex;
    justify-content: space-between;
`;

export const StyledFindCompetitorsFooter = styled.div`
    align-items: center;
    border-top: 1px solid #e0e0e0; // Color is just like on the design
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    padding: 14px 24px;
`;

export const StyledFindCompetitorsInner = styled.div`
    padding: 28px 24px;
`;

export const StyledFindCompetitorsSection = styled.div`
    background-color: ${colorsPalettes.carbon["0"]};
    border-radius: 4px;
    top: 35px;
    box-shadow: 0 3px 6px ${rgba(colorsPalettes.midnight["600"], 0.08)};
    left: 0;
    position: absolute;
    width: 100%;
`;

export const StyledFindCompetitorsSectionRelativeContainer = styled.div`
    height: 60px;
    position: relative;
`;
