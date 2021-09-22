import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const InputLineContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    padding-left: 13px;
    width: 592px;

    .chipItem {
        max-width: 200px;
        margin-right: 0;
    }
    .ChipItemText {
        max-width: 100px;
    }
`;

export const AutocompleteContainer = styled.div`
    max-width: 447px;
    flex-grow: 1;
    flex-shrink: 1;
`;

export const SeparatorText = styled.span`
    font-size: 12px;
    color: ${colorsPalettes.carbon[300]};
    margin: 0 12px;
    height: 40px;
    display: inline-flex;
    align-items: center;
`;

export const AutocompleteTrackerWizardMultiSelectContainer = styled.div`
    width: 450px;
`;
