import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";
import { Button } from "@similarweb/ui-components/dist/button";

export const StyledListsPageLink = styled(Button)`
    align-items: center;
    cursor: pointer;

    & > span {
        ${mixins.setFont({ $color: colorsPalettes.blue["400"], $size: 14 })};
        margin-right: 6px;
    }

    .SWReactIcons svg path {
        fill: ${colorsPalettes.blue["400"]};
    }
`;

export const StyledListsItem = styled.div`
    margin-bottom: 16px;
`;

export const StyledListsContainer = styled.div`
    margin-bottom: 43px;
`;
