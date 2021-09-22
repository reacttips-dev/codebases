import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";

export const StyledOutOfLimitModal = styled.div``;

export const StyledTitleOutOfLimitModal = styled.div`
    font-size: 20px;
    font-weight: bold;
    color: ${colorsPalettes.carbon[500]};
    padding: 20px 24px 0px;
`;

export const StyledContentOutOfLimitModal = styled.div`
    font-size: 14px;
    line-height: 20px;
    color: ${colorsPalettes.carbon[400]};
    padding: 33px 24px 35px;
    & > div {
        margin-top: 20px;
    }
`;

export const StyledFooterOutOfLimitModal = styled.div`
    border-top: 1px solid ${colorsPalettes.carbon[100]};
    padding: 10px 24px 10px 24px;
    display: flex;
    flex-direction: row-reverse;
`;
