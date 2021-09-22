import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledListWebsitesCount = styled.div`
    flex-shrink: 0;
    max-width: 50%;
    ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 14 })};
`;

export const StyledListName = styled.div`
    flex-grow: 1;
    margin-right: 5px;
    ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 14 })};
`;

export const StyledListsDropdownItem = styled.div`
    align-items: center;
    background-color: ${colorsPalettes.carbon["0"]};
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    padding: 16px;
    transition: background-color 200ms ease-out;

    &:hover {
        background-color: ${colorsPalettes.bluegrey["200"]};
    }

    & > div {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;
