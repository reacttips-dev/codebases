import { colorsPalettes } from "@similarweb/styles";
import { FlexColumn } from "styled components/StyledFlex/src/StyledFlex";
import styled from "styled-components";

export const RuleContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

export const RowElement = styled.div`
    margin: 0px;
`;

export const RowSeparator = styled(RowElement)`
    text-transform: uppercase;
    font-family: roboto;
    font-weight: bold;
    height: 66px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export const RowSeparatorVerticalLine = styled.div`
    background-color: ${colorsPalettes.midnight["50"]};
    width: 1px;
    height: 100%;
`;

export const RowSeparatorTitleContainer = styled.span`
    margin: 5px 0px;
`;

export const RowSeparatorTitle = styled.p`
    font-size: 14px;
    color: ${colorsPalettes.carbon["200"]};
    margin: 0px;
`;

export const RowSeparatorSubtitle = styled.p`
    margin: 0px;
    font-size: 14px;
    color: ${colorsPalettes.carbon["200"]};
    font-style: italic;
    text-transform: none;
    font-weight: initial;
    text-align: center;
`;
