import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledCategoriesDescription = styled.div`
    ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 14 })};
    text-align: center;

    & a {
        ${mixins.setFont({ $color: colorsPalettes.blue["400"], $size: 14 })};
        cursor: pointer;
    }
`;
