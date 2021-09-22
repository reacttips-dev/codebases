import React from "react";
import { OnOffSwitch } from "@similarweb/ui-components/dist/on-off-switch";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { SWReactIcons } from "@similarweb/icons";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { i18nFilter } from "filters/ngFilters";

export interface IWordsOnlyToggleProps {
    isActive: boolean;
    onToggle: (event) => void;
}

export const WordsOnlyContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-basis: 150px;
`;

export const WordsOnlyTitleContainer = styled.span`
    font-size: 14px;
    font-family: Roboto;
    color: ${colorsPalettes.carbon["500"]};
    margin-right: 5px;
`;

export const WordsOnlyTooltipIconContainer = styled.div`
    margin-right: 11px;
`;

export function WordsOnlyToggle(props: IWordsOnlyToggleProps) {
    const { isActive, onToggle } = props;

    return (
        <WordsOnlyContainer>
            <WordsOnlyTitleContainer>
                {i18nFilter()("segmentsWizard.edit.words-only-toggle")}
            </WordsOnlyTitleContainer>
            <PlainTooltip
                tooltipContent={i18nFilter()("segmentsWizard.edit.words-only-toggle-tooltip")}
            >
                <WordsOnlyTooltipIconContainer>
                    <SWReactIcons size="xs" iconName="info" />
                </WordsOnlyTooltipIconContainer>
            </PlainTooltip>
            <OnOffSwitch isSelected={isActive} onClick={onToggle} />
        </WordsOnlyContainer>
    );
}
