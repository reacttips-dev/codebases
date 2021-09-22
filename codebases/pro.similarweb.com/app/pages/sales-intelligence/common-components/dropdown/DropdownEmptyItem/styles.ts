import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledDropdownEmptyItem = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
    padding: 15px;

    & > span {
        ${mixins.setFont({ $color: colorsPalettes.carbon["400"], $size: 14 })};
        margin-left: 6px;
    }
`;
