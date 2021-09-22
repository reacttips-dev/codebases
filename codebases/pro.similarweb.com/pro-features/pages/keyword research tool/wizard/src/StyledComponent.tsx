import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { Button } from "@similarweb/ui-components/dist/button";
import { SuggestionWidgetWrapper } from "pages/keyword-analysis/keyword-generator-tool/styledComponents";
import styled from "styled-components";

export const Container = styled.div<{ withHeight?: boolean }>`
    height: ${({ withHeight }) => (withHeight ? "auto" : "305px")};
    width: 1087px;
    display: flex;
    flex-direction: column;
    justify-content: ${({ withHeight }) => (withHeight ? "" : "center")};
    align-items: center;
    background: #ffffff;
    box-shadow: 0px 3px 6px 0px rgba(14, 30, 62, 0.08);
    border-radius: 6px;
    padding-bottom: ${({ withHeight }) => (withHeight ? "42px" : "0")};
`;
export const TitleContainer = styled.div`
    height: 34px;
    display: flex;
    margin-top: 71px;
    margin-bottom: 17px;
`;
export const Icon: any = styled(SWReactIcons)`
    svg {
        path {
            fill: #1b2653;
        }
    }
`;
export const Title = styled.span`
    ${setFont({ $size: 30, $weight: 500, $color: colorsPalettes.midnight["500"] })};
    margin-left: 7px;
`;
export const SubTitle = styled.div`
    width: 554px;
    ${setFont({ $size: 14 })};
    color: ${rgba(colorsPalettes.midnight["500"], 0.54)};
    line-height: 24px;
    text-align: center;
    margin-bottom: 26px;
`;
export const InputContainer = styled.div<{ withMargin?: boolean }>`
    display: flex;
    margin-bottom: ${({ withMargin }) => (withMargin ? "66px" : "24px")};
    align-items: center;
    width: 700px;
`;
export const CountryContainer = styled.div`
    height: 40px;
    border: 1px #eceef0 solid;
    margin: 4px;
    .CountryFilter-dropdownButton {
        ${setFont({ $size: 14, weight: 400, $color: colorsPalettes.midnight["500"] })};
    }
`;
export const InputPlaceHolder = styled.div`
    height: 40px;
    width: 318px;
    border: 1px solid #eceef0;
    margin: 4px;
`;
export const ButtonContainer = styled(Button)`
    margin: 4px;
`;

const SuggestionsContainerBase = styled.div`
    align-self: flex-start;
    margin-left: 255px;
`;

export const SuggestionsTitleContainer = styled(SuggestionsContainerBase)`
    margin-bottom: 10px;
    line-height: 18px;
    p {
        margin: 0;
        ${setFont({
            $size: 14,
            $family: "Roboto",
            $color: rgba(colorsPalettes.midnight["500"], 0.54),
        })};
    }
`;

export const SuggestionsTitle = styled.p``;

export const SuggestionsArenaTitle = styled.span`
    ${setFont({ $color: colorsPalettes.midnight["500"], $weight: 600 })};
`;

export const SuggestionsContainer = styled.div`
    width: 576px;
    height: auto;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    ${SuggestionWidgetWrapper}:nth-last-child(2) {
        margin-bottom: 0;
    }
    ${SuggestionWidgetWrapper}:last-child {
        margin-bottom: 0;
    }
`;
