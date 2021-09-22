import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const BackSection = styled.div`
    padding: 8px 13px;
    border-bottom: 1px #e9ebed solid;
`;

export const BackText = styled.span`
    font-size: 12px;
    line-height: 16px;
    color: #2b3b67;
    margin-left: 3px;
    vertical-align: middle;
`;

export const BottomSection = styled.div`
    background: ${colorsPalettes.bluegrey[100]};
    padding: 10px 22px 14px;
    display: flex;
    justify-content: flex-end;
`;
