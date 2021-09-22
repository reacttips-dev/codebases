import styled from "styled-components";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { StyledAddToListDropdownContent } from "pages/sales-intelligence/sub-modules/opportunities/components/AddToListDropdown/styles";

export const StyledSelectDomainsDropdown = styled.div`
    position: relative;
`;

export const StyledDomainDropdownItem = styled.div<{ selected: boolean }>`
    color: ${colorsPalettes.carbon[500]};
    font-size: 14px;
    padding: 14px 16px;
    background-color: ${({ selected }) => (selected ? colorsPalettes.bluegrey[100] : "transparent")}
    cursor: pointer;
    &:hover {
        background-color: ${colorsPalettes.carbon[25]};
    }
`;

export const StyledDomainsList = styled.div`
    color: ${colorsPalettes.black[0]};
    padding: 8px 0;
`;

export const StyledDomainBottom = styled.div`
    display: flex;
    align-items: center;
    font-size: 12px;
    padding: 14px 8px 16px;
    margin: 0 8px;
    border-top: 1px solid ${colorsPalettes.carbon[100]};
    color: ${colorsPalettes.carbon[400]};
`;

export const StyledText = styled.div`
    color: ${colorsPalettes.carbon[400]};
    margin-left: 8px;
`;

export const StyledDomainNumber = styled.div`
    font-weight: bold;
    ${colorsPalettes.black[0]};
    margin-left: 3px;
`;

export const StyledDropdownButton = styled.div`
    padding: 10px 10px;
    border-radius: 4px;
    border: 1px solid ${rgba(colorsPalettes.carbon["25"], 0.4)};
    align-items: center;
    cursor: pointer;
    display: flex;
    font-size: 16px;
    color: ${colorsPalettes.carbon[0]};

    .SWReactIcons {
        display: flex;
        margin-left: 8px;

        path {
            fill: ${colorsPalettes.carbon["0"]};
        }
    }

    &:hover {
        background-color: ${rgba(colorsPalettes.carbon[0], 0.2)};
    }
`;

export const StyledButtonLabel = styled.div<{ maxLength: number }>`
    max-width: ${({ maxLength }) => maxLength}px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const StyledListDropdownContent = styled(StyledAddToListDropdownContent)`
    z-index: 20;
`;
