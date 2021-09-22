import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledExportTitle = styled.h2`
    ${mixins.setFont({ $color: colorsPalettes.carbon["500"], $size: 20, $weight: 500 })};
    line-height: 24px;
    margin: 0;
`;

export const StyledExportSubtitle = styled.div`
    ${mixins.setFont({ $color: colorsPalettes.carbon["400"], $size: 14 })};
    line-height: 20px;
    margin-top: 30px;
`;

export const StyledExportModalFooter = styled.div`
    align-items: center;
    display: flex;
    justify-content: flex-end;
    padding: 16px;

    & > .Button:last-child {
        margin-left: 8px;
        min-width: 58px;
    }
`;

export const StyledExportModalBody = styled.div`
    flex-grow: 1;
    padding: 20px 24px;
`;

export const StyledExportModalInner = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
`;
