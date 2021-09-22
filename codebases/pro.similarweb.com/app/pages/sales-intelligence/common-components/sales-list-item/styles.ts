import styled from "styled-components";
import { colorsPalettes, mixins, rgba } from "@similarweb/styles";

export const StyledSalesListItemIcon = styled.div`
    flex-shrink: 0;
`;

export const StyledSalesListItemNewWebsitesText = styled.span`
    ${mixins.setFont({ $color: colorsPalettes.orange["400"], $size: 12 })};
`;

export const StyledSalesListItemSecondaryText = styled.div`
    ${mixins.setFont({ $color: colorsPalettes.carbon["300"], $size: 12 })};
`;

export const StyledSalesListItemPrimaryText = styled.div`
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    span {
        ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 16 })};
    }
`;

export const StyledSalesListItemTextContainer = styled.div`
    flex-grow: 1;
    margin-left: 16px;
    overflow: hidden;
`;

export const StyledSalesListItem = styled.div`
    align-items: center;
    background-color: ${colorsPalettes.carbon["0"]};
    border: 1px solid ${colorsPalettes.carbon["50"]};
    border-radius: 8px;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    padding: 11px 16px;
    transform: translate3d(0, 0, 0);
    transition: box-shadow 100ms ease-in-out, transform 100ms ease-in-out;
    width: 100%;

    &:hover {
        border: 1px solid ${colorsPalettes.carbon["50"]};
        box-shadow: 0 12px 24px 0 ${rgba(colorsPalettes.black[0], 0.2)};
        transform: translate3d(0, -4px, 0);
    }
`;
