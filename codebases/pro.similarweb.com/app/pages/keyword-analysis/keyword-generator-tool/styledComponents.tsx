import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { Button, IconButton } from "@similarweb/ui-components/dist/button";
import { Bar } from "components/TrendsBar/src/TrendsBar";
import * as React from "react";
import styled from "styled-components";
import { TabList } from "@similarweb/ui-components/dist/tabs";
import { AutocompleteStyled } from "components/AutocompleteKeywords/AutocompleteKeywords";

export const KeywordGeneratorToolPageWrapper = styled.div`
    margin: 0 auto;
    width: calc(100% - 72px);
    max-width: 1087px;
    .swReactTableCell,
    .swReactTableCell:hover .search-keyword {
        white-space: pre;
    }
`;
export const BackButtonWrapper = styled.div`
    padding: 15px 0 28px;
    button {
        position: relative;
        right: 16px;
    }
`;
export const TableHeaderText = styled.div<{ size?: number; weight?: number }>`
    ${({ size = 14, weight = 300 }) => setFont({ $size: size, $weight: weight })};
`;
export const PageTitle = styled.h1`
    ${setFont({ $size: 24, $weight: 400 })};
    margin-top: 0;
    color: ${colorsPalettes.carbon["500"]};
`;

export const KeywordGeneratorToolInlinePageGroupWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    ${AutocompleteStyled} {
        width: 320px;
        padding: 0 15px;
        height: 40px;
    }
    .ListItemsContainer {
        max-height: 480px;
        overflow: auto;
        transition: max-height 0.3s ease-out;
    }
`;
export const TableWrap = styled.div`
    ${TabList} {
        height: auto;
        background-color: ${colorsPalettes.carbon["0"]};
        box-shadow: 0px 3px 6px 0px rgba(14, 30, 62, 0.08);
        border-radius: 6px;
    }
`;
export const KeywordGeneratorToolPageModalFooter = styled.div`
    display: flex;
    flex-direction: row-reverse;
    height: 60px;
    padding-top: 10px;
`;
export const KeywordGeneratorToolPageModalHeader = styled.div`
    ${setFont({ $size: 16, $weight: 500 })};
    padding-bottom: 15px;
`;
export const KeywordGeneratorToolPageModalBody = styled.div`
    flex-grow: 1;
    align-self: center;
`;
export const KeywordGeneratorToolPageModalContainer = styled.div`
    display: flex;
    flex-direction: column;
`;
export const KeywordGeneratorToolPageTableHeaderStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 16px;
`;

export const BooleanSearchUtilityContainer = styled.div`
    width: 100%;
    padding-left: 15px;
`;

export const ButtonContainer = styled(Button)`
    margin-left: 4px;
`;
export const FirstStepWrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
export const IllustrationContainer = styled.div`
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    width: 1000px;
    margin-bottom: 80px;
    @media (max-width: 1440px) {
        width: auto;
    }
`;
export const SeparatorContainer = styled.div`
    display: flex;
    align-items: center;
`;

export const SuggestionWidgetWrapper = styled.div`
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    align-items: center;
    width: 283px;
    height: 48px;
    border-radius: 6px;
    padding: 0 4px 0 12px;
    box-sizing: border-box;
    margin-bottom: 8px;
    border: 1px solid rgba(14, 30, 62, 0.08);
    .SeedKWSuggestionWidget-loader {
        margin-left: 50px;
    }
`;

export const SuggestionWidgetTextWrapper = styled.div`
    ${setFont({ $size: 12, $weight: 400 })};
    color: ${colorsPalettes.carbon["500"]};
    flex-basis: 48%;
    line-height: 16px;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    /*
  * no compliant with IE 11.
  *limits lines of text to 2.
  */
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

export const SuggestionWidgetTrendBarWrapper = styled.div`
    width: auto;
    ${Bar} {
        margin-right: 3px;
        width: 4px;
    }
    .SeedKWSuggestionWidget-NA {
        display: inline-block;
        margin: 4px 4px 0 0;
    }
`;

export const SuggestionWidgetIconButton = styled(IconButton)`
    border-radius: 50%;
    box-sizing: border-box;
    .SWReactIcons svg path {
        fill: ${colorsPalettes.blue["400"]};
    }
    &:hover,
    &:active {
        .SWReactIcons svg path {
            fill: ${colorsPalettes.blue["400"]};
        }
    }
`;

export const SuggestionWidgetRightSection = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;

export const NoDataContainer = styled.div`
    width: 264px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    margin-top: 40px;
    margin-bottom: 10px;
    svg {
        width: 156px;
        height: 96px;
    }
`;

export const NoDataText = styled.div`
    font-size: 12px;
    color: ${rgba(colorsPalettes.carbon["500"], 0.6)};
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const NoDataTitle = styled.div``;

export const NoDataSubTitle = styled.div``;

export const TableHeaderItemsContainer = styled.div`
    display: flex;
    padding-left: 20px;
    height: 80px;
    background: ${rgba(colorsPalettes.carbon[25], 0.5)};
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
`;

export const TableHeaderItemContainer = styled.div`
    padding-right: 75px;
    display: flex;
    flex-direction: column;
    justify-content: center;
`;
