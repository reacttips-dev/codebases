import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledUpdateDescription = styled.div`
    span {
        ${mixins.setFont({ $color: colorsPalettes.carbon["300"], $size: 12 })};
    }
`;

export const StyledUpdateSection = styled.div`
    padding: 0 15px 0 24px;
`;

export const StyledNameInputLabel = styled.div`
    line-height: 16px;
    margin-bottom: 5px;

    span {
        ${mixins.setFont({ $color: colorsPalettes.carbon["300"], $size: 14 })};
    }
`;

export const StyledNameInputContainer = styled.div`
    margin-top: 24px;
`;

export const StyledModalSubtitle = styled.div`
    margin-top: 8px;

    span {
        ${mixins.setFont({ $color: colorsPalettes.carbon["400"], $size: 13 })};
        line-height: 16px;
    }
`;

export const StyledModalTitle = styled.h2`
    ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 20, $weight: 500 })};
    line-height: 24px;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const StyledModalFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    padding: 16px;

    & > button:last-child {
        margin-left: 8px;
    }
`;

export const StyledModalBody = styled.div`
    flex-grow: 1;
    padding: 20px 24px 8px;
`;

export const StyledModalContent = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;
