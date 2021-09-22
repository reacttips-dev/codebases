import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledModalFooter = styled.div`
    border-top: 1px solid ${colorsPalettes.carbon["100"]};
    display: flex;
    justify-content: flex-end;
    padding: 6px 16px;
`;

export const StyledDescription = styled.div`
    margin-top: 15px;

    span {
        ${mixins.setFont({ $color: colorsPalettes.carbon["400"], $size: 14 })};
        line-height: 20px;
    }
`;

export const StyledTitle = styled.div`
    span {
        ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 20, $weight: 500 })};
    }
`;

export const StyledModalContent = styled.div`
    padding: 20px 25px 15px;
`;
